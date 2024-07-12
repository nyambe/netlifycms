import type { User } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const { $auth, $db } = nuxtApp

  if (!$auth || !$db) {
    console.error('Firebase is not initialized')
    return navigateTo('/login')
  }

  const user = $auth.currentUser as User | null

  if (!user) {
    console.log('User is not authenticated')
    return navigateTo('/login')
  }

  try {
    const userDoc = await $db.collection('users').doc(user.uid).get()
    
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      console.log('User is not an admin')
      return navigateTo('/')
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    return navigateTo('/')
  }
})