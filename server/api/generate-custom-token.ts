import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

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
} else {
  console.log('Firebase Admin SDK already initialized', getApps().length)
}


const db = getFirestore()
const auth = getAuth()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { inviteCode, email } = body



  try {
    // Verify invite
    const inviteRef = db.collection('invites').doc(inviteCode)
    const invite = await inviteRef.get()

    if (!invite.exists || invite.data().email !== email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invite or email',
      })
    }

    // Generate custom token
    const customToken = await auth.createCustomToken(email)

    return { customToken }
  } catch (error) {
    console.error('Error generating custom token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate custom token',
    })
  }
})