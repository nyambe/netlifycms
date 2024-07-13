<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3  w-full sm:max-w-4xl sm:mx-auto ">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-3xl mx-auto w-full">
          <div>
            <h1 class="text-2xl font-semibold">Welcome to your Dashboard</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <p>Hello, {{ user?.displayName || user?.email || userEmail }}</p>
              <p v-if="isAdmin">You have admin privileges.</p>
              <p v-else>You can access this exclusive content.</p>
              <div v-if="user">
                <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/871972518?h=fc0948666f" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
                <p><a href="https://vimeo.com/871972518">BTS Plaza Espa&ntilde;a</a> from <a href="https://vimeo.com/user3909945">samiebuka</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
                <p></p> 
              </div>
            </div>
            <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <p>What would you like to do?</p>
              <ul class="list-disc space-y-2 mt-4">
                <li v-if="isAdmin" class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p class="ml-2">
                    <UButton @click="navigateTo('/admin/create-invite')">Create Invite</UButton>
                  </p>
                </li>
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p class="ml-2">
                    <UButton @click="handleLogout">Logout</UButton>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pre>{{ userDocData }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, type User } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

interface UserDocData {
  email: string
  isAdmin?: boolean
  created: Date
  used: boolean
  visitCount: number
}

const router = useRouter()
const user = ref<User | null>(null)
const isAdmin = ref(false)
const userDocData = ref<UserDocData | undefined>()
const userEmail = ref('')

const { $auth, $db } = useNuxtApp()



onMounted(async () => {
  console.log('onMounted', user.value)
  $auth.onAuthStateChanged(async (firebaseUser) => {
    console.log('onAuthStateChanged', firebaseUser)
    if (firebaseUser) {
      user.value = firebaseUser
      
      
      // Check if user is admin
      const userDoc = await getDoc(doc($db, 'users', firebaseUser.uid))
      console.log('userDoc', userDoc.exists(), userDoc.data())
      isAdmin.value = userDoc.exists() && userDoc.data()?.isAdmin === true
      if (!userDoc.exists()) {
        userEmail.value = firebaseUser.uid
      }

    } else {
      router.push('/')
    }
  })
  console.log('onMounted2', user.value)
})


console.log('user', user.value)

const handleLogout = async () => {
  try {
    await signOut($auth)
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>