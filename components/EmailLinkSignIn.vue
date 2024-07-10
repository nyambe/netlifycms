<template>
  <div>
    <form @submit.prevent="sendLink">
      <UInput v-model="email" type="email" placeholder="Enter your email" />
      <UButton type="submit">Send Sign-In Link</UButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { $sendSignInLink } = useNuxtApp()
const email = ref('')

const sendLink = async () => {
  try {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://your-netlify-domain.netlify.app/finishSignIn',
      // This must be true.
      handleCodeInApp: true,
    }
    await $sendSignInLink(email.value, actionCodeSettings)
    alert('Check your email for the sign-in link!')
  } catch (error) {
    console.error('Error sending sign-in link', error)
    alert('Error sending sign-in link. Please try again.')
  }
}
</script>