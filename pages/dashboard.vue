<!-- pages/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <UCard class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Welcome, {{ user?.name }}</h1>
      <p class="mb-4">Email: {{ user?.email }}</p>
      <UButton @click="handleLogout" color="red">Logout</UButton>
      <!-- Add your Vimeo content here -->
      <pre>
      {{ user }} 
      </pre>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '#imports'

const { user, signOut } = useAuth()

const handleLogout = async () => {
  await signOut({ callbackUrl: '/' })
}

// You can add your Vimeo content fetching logic here
</script>