<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access Exclusive Content
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin" v-if="isValidInvite">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address" v-model="email" :disabled="emailMatches">
          </div>
        </div>
        <div v-if="emailMatches">
          <button @click.prevent="handleDirectSignIn" type="button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Sign In Directly
          </button>
        </div>
        <div v-else>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Send Sign-In Link
          </button>
        </div>
      </form>
      <p v-else-if="inviteError" class="mt-2 text-center text-sm text-red-600">
        {{ inviteError }}
      </p>
      <p v-else class="mt-2 text-center text-sm text-gray-600">
        Checking invite validity...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sendSignInLinkToEmail, signInWithCustomToken } from 'firebase/auth'
import { doc, getDoc, updateDoc, Timestamp, increment } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const { $auth, $db } = useNuxtApp()

const email = ref('')
const isValidInvite = ref(false)
const inviteError = ref('')
const inviteCode = route.query.invite as string
const inviteEmail = ref('')

const emailMatches = computed(() => email.value === inviteEmail.value && email.value !== '')

onMounted(async () => {
  if (inviteCode) {
    await checkInviteValidity()
  } else {
    inviteError.value = 'No invite code provided'
  }
})

const checkInviteValidity = async () => {
  const inviteRef = doc($db, 'invites', inviteCode)
  const inviteSnap = await getDoc(inviteRef)

  if (!inviteSnap.exists()) {
    inviteError.value = 'Invalid invite code'
    return
  }

  const inviteData = inviteSnap.data()
  const now = Timestamp.now()
  const tenDaysAgo = Timestamp.fromMillis(now.toMillis() - 10 * 24 * 60 * 60 * 1000)

  if (inviteData.created.toMillis() < tenDaysAgo.toMillis()) {
    inviteError.value = 'Invite has expired'
    return
  }

  if (inviteData.visitCount >= 5) {
    inviteError.value = 'Maximum visits reached'
    return
  }

  isValidInvite.value = true
  inviteEmail.value = inviteData.email || ''
  email.value = inviteEmail.value
}

const handleLogin = async () => {
  if (!isValidInvite.value) {
    alert('Invalid invite')
    return
  }

  try {
    const inviteRef = doc($db, 'invites', inviteCode)
    const inviteSnap = await getDoc(inviteRef)
    const inviteData = inviteSnap.data()

    if (email.value !== inviteData.email) {
      alert('Email does not match the invite')
      return
    }

    // Update visit count
    await updateDoc(inviteRef, { 
      visitCount: increment(1)
    })

    // Send sign-in link
    const actionCodeSettings = {
      url: `${window.location.origin}/confirm-signin?invite=${inviteCode}`,
      handleCodeInApp: true,
    }

    await sendSignInLinkToEmail($auth, email.value, actionCodeSettings)
    
    // Save the email locally so you don't need to ask the user for it again
    window.localStorage.setItem('emailForSignIn', email.value)

    alert('Check your email for the sign-in link!')
  } catch (error) {
    console.error('Login error:', error)
    alert('Failed to send login link. Please try again.')
  }
}

const handleDirectSignIn = async () => {
  try {
    // Here we need to call a server function to generate a custom token
    // For security reasons, this should not be done client-side
    const response = await fetch('/api/generate-custom-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inviteCode, email: email.value }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate custom token')
    }

    const { customToken } = await response.json()

    // Sign in with the custom token
    await signInWithCustomToken($auth, customToken)

    // Update visit count
    const inviteRef = doc($db, 'invites', inviteCode)
    await updateDoc(inviteRef, { 
      visitCount: increment(1)
    })

    // Redirect to dashboard or content page
    router.push('/dashboard')
  } catch (error) {
    console.error('Direct sign-in error:', error)
    alert('Failed to sign in directly. Please try again.')
  }
}
</script>