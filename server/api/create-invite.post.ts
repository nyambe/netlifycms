import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  const config = useRuntimeConfig()
  initializeApp({
    credential: cert({
      projectId: config.firebaseAdmin.projectId,
      privateKey: config.firebaseAdmin.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebaseAdmin.clientEmail,
    })
  })
}

const db = getFirestore()
const auth = getAuth()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  // Get the ID token from the authorization header
  const authHeader = event.node.req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  const idToken = authHeader.split('Bearer ')[1]

  try {
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken)
    
    // Check if the user is an admin
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User must be an admin to create invite links'
      })
    }

    // Generate invite code and save to Firestore
    const inviteCode = Math.random().toString(36).substring(2, 15)
    await db.collection('invites').doc(inviteCode).set({
      email,
      created: new Date(),
      used: false
    })

    // Return the invite link
    return { inviteLink: `https://${event.node.req.headers.host}/signup?invite=${inviteCode}` }
  } catch (error) {
    console.error('Error creating invite:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create invite'
    })
  }
})