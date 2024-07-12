<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup" v-if="isValidInvite">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address" v-model="email">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password" v-model="password">
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign up
          </button>
        </div>
      </form>
      <p v-else class="mt-2 text-center text-sm text-gray-600">
        Invalid or expired invite link.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const { $auth, $db } = useNuxtApp()

const email = ref('')
const password = ref('')
const isValidInvite = ref(false)
const inviteCode = route.query.invite as string

onMounted(async () => {
  if (inviteCode) {
    const inviteRef = doc($db, 'invites', inviteCode)
    const inviteSnap = await getDoc(inviteRef)

    if (inviteSnap.exists() && !inviteSnap.data().used) {
      isValidInvite.value = true
      email.value = inviteSnap.data().email || ''
    }
  }
})

const handleSignup = async () => {
  if (!isValidInvite.value) {
    alert('Invalid invite')
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value)
    
    // Create user document
    await setDoc(doc($db, 'users', userCredential.user.uid), {
      email: email.value,
      createdAt: new Date()
    })

    // Mark invite as used
    await updateDoc(doc($db, 'invites', inviteCode), { used: true })

    alert('Account created successfully')
    router.push('/dashboard')
  } catch (error) {
    console.error('Signup error:', error)
    alert('Failed to create account. Please try again.')
  }
}
</script>