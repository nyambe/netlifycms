<template>
  <div>
    <p v-if="loading">Signing in...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Sign-in successful!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $signInWithLink, $isSignInWithEmailLink } = useNuxtApp()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  if ($isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    try {
      await $signInWithLink(email, window.location.href)
      loading.value = false
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    } catch (err) {
      loading.value = false
      error.value = 'Error signing in with email link'
      console.error(err)
    }
  } else {
    loading.value = false
    error.value = 'Invalid sign-in link'
  }
})
</script>