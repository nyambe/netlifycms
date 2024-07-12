import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { inviteCode, email } = body

  const db = getFirestore()
  const auth = getAuth()

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