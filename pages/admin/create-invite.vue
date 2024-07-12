<template>
  <div>
    <h1>Create Invite Link</h1>
    <form @submit.prevent="createInvite">
      <UInput v-model="email" type="email" placeholder="Enter invitee's email" required />
      <UButton type="submit" :loading="loading">Generate Invite Link</UButton>
    </form>
    <div v-if="inviteLink">
      <p>Invite Link:</p>
      <UInput v-model="inviteLink" readonly />
      <UButton @click="copyToClipboard">Copy to Clipboard</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'

definePageMeta({
  middleware: ['admin']
})

const email = ref('')
const loading = ref(false)
const inviteLink = ref('')

const createInvite = async () => {
  loading.value = true
  try {
    const auth = getAuth()
    const idToken = await auth.currentUser?.getIdToken()
    
    const { data } = await useFetch('/api/create-invite', {
      method: 'POST',
      body: { email: email.value },
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    })
    
    inviteLink.value = data.value?.inviteLink
  } catch (error) {
    console.error('Error creating invite link:', error)
    alert('Failed to create invite link. Please try again.')
  } finally {
    loading.value = false
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(inviteLink.value)
    .then(() => alert('Invite link copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err))
}
</script>