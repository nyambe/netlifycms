<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ message }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'

const router = useRouter()
const { $auth } = useNuxtApp()

const message = ref('Confirming sign-in...')

onMounted(async () => {
  if (isSignInWithEmailLink($auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      email = window.prompt('Please provide your email for confirmation')
    }
    try {
      await signInWithEmailLink($auth, email, window.location.href)
      window.localStorage.removeItem('emailForSignIn')
      message.value = 'Sign-in successful!'
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      console.error('Error signing in with email link', error)
      message.value = 'Error signing in. Please try again.'
    }
  } else {
    message.value = 'Invalid sign-in link'
  }
})
</script>