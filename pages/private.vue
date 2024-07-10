<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <UCard class="w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <UButton @click="signInWithGoogle" color="primary" class="w-full">
        Sign in with Google
      </UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const { $auth } = useNuxtApp()

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup($auth, provider)
    // Handle successful login
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>