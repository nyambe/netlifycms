import { getAuth, type User } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // const nuxtApp = useNuxtApp()
  // const auth = getAuth()
  // const db = getFirestore()

  const { $auth, $db } = useNuxtApp()
    
  if (!$auth || !$db) {
    console.error('Firebase is not initialized')
    return navigateTo('/login')
  }

  return new Promise((resolve) => {
    const unsubscribe = $auth.onAuthStateChanged(async (user: User | null) => {
      unsubscribe() // Unsubscribe immediately after the first call

      if (!user) {
        console.log('User is not authenticated')
        resolve(navigateTo('/login'))
        return
      }

      try {
        const userDocRef = doc($db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists() || !userDoc.data()?.isAdmin) {
          console.log('User is not an admin')
          resolve(navigateTo('/'))
          return
        }

        // User is authenticated and is an admin
        resolve()
      } catch (error) {
        console.error('Error checking admin status:', error)
        resolve(navigateTo('/'))
      }
    })
  })
})