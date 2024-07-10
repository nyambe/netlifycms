import { initializeApp } from 'firebase/app'
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  const sendSignInLink = async (email: string, actionCodeSettings: any) => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email)
    } catch (error) {
      console.error('Error sending sign-in link to email', error)
      throw error
    }
  }

  const signInWithLink = async (email: string, href: string) => {
    try {
      const result = await signInWithEmailLink(auth, email, href)
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn')
      return result
    } catch (error) {
      console.error('Error signing in with email link', error)
      throw error
    }
  }

  return {
    provide: {
      auth,
      sendSignInLink,
      signInWithLink,
      isSignInWithEmailLink: (href: string) => isSignInWithEmailLink(auth, href)
    }
  }
})