import { initializeApp } from 'firebase/app'
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

	console.log('config', config)

	const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId,
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