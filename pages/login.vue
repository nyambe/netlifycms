<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <UCard class="w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form @submit.prevent="handleSubmit">
        <UFormGroup label="Username">
          <UInput v-model="username" placeholder="Enter your username" />
        </UFormGroup>
        <UFormGroup label="Password" class="mt-4">
          <UInput v-model="password" type="password" placeholder="Enter your password" />
        </UFormGroup>
        <UButton type="submit" color="primary" class="mt-4 w-full">
          Login
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '#imports'

const username = ref('')
const password = ref('')
const { signIn } = useAuth()

const handleSubmit = async () => {
  try {
    await signIn('credentials', {
      username: username.value,
      password: password.value,
      callbackUrl: '/dashboard'
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>