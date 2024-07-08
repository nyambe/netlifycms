<script setup lang="ts">
import { ref } from 'vue'

const title = ref('MAMADI')
const producertagline = ref('presents')
const producer = ref('MOABA CINEMA STUDIO ')
const tagline = ref('Así no se puede')
const releaseDate = ref('Coming Fall 2024')
const description = ref('MAMADI is trying to re-organise his life after a very turbulent past, the disconnection with his mother in Africa and the bad relationship with his father. He has no regrets about his pose and is not afraid to face the near future, he knows he still has a mission to accomplish.')

const email = ref('')
const submitForm = () => {
  // Here you would typically handle the form submission
  console.log('Form submitted with email:', email.value),
  // Reset the email input after submission
  email.value = ''
}

const socialLinks = [
  { name: 'Twitter', url: '#' },
  { name: 'Facebook', url: '#' },
  { name: 'Instagram', url: '#' }
]
</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center p-0" 
       :style="{ backgroundImage: `url('/fondomamadi.jpg')` }">
    <div class="w-full bg-white bg-opacity-65 min-h-screen">
    
      <div class="relative z-10 w-full max-w-5xl mx-auto py-10">
        <UCard class="bg-black bg-opacity-85 text-white">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Poster Column -->
            <div>
              <img src="/mamadi.jpg" alt="Ocean Depths Unveiled Poster" class="w-full h-auto rounded-lg shadow-xl" />
            </div>
            
            <!-- Details Column -->
            <div class="flex flex-col justify-center">
              <h3 class="text-2xl uppercase font-heading mb-1">{{ producer }}</h3>
              <p class="uppercase text-sm mb-4">{{ producertagline }}</p>
              <h1 class="text-7xl font-heading mb-4">{{ title }}</h1>
              <p class="text-xl mb-6 italic">{{ tagline }}</p>
              <p class="text-2xl font-bold mb-6">{{ releaseDate }}</p>
              <p class="mb-6 font-thin text-xl">{{ description }}</p>
              
              <form @submit.prevent="submitForm" class="mb-8">
                <UInput v-model="email" placeholder="Enter your email" type="email" class="mb-2" />
                <UButton type="submit" color="primary" class="w-full">Subscribe for Updates</UButton>
              </form>
              
              <div>
                <h2 class="text-2xl mb-4">Follow his Journey</h2>
                <div class="flex space-x-4">
                  <UButton v-for="link in socialLinks" :key="link.name" :to="link.url" color="gray" variant="ghost">
                    {{ link.name }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style>

.font-heading {
  font-family: 'Anton SC', sans-serif;
}

body {
  font-family: 'Roboto Condensed', sans-serif;
}
</style>