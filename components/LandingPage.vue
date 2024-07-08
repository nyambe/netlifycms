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

const domain = 'https://moaba.netlify.app'

const seoDescription = ref(`"MAMADI" is a powerful documentary by director Rubén Monsuy, produced by Moaba Cinema Studio. This film explores the journey of a man rebuilding his life amidst past turmoil, cultural disconnection, and family struggles. Through Mamadi's story, Monsuy captures the resilience of the human spirit and the quest for purpose in the face of adversity.`)

// SEO Metadata
useHead({
  title: `${title.value} - A Documentary by Rubén Monsuy | Moaba Cinema Studio`,
  link: [
    {
      rel: 'canonical',
      href: domain
    }
  ]
})

useSeoMeta({
  title: `${title.value} - A Documentary by Rubén Monsuy | Moaba Cinema Studio`,
  ogTitle: `${title.value} - ${tagline.value} | Moaba Cinema Studio`,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: `${domain}/mamadi.jpg`,
  ogUrl: domain,
  twitterCard: 'summary_large_image',
  twitterTitle: `${title.value} - A Documentary by Rubén Monsuy`,
  twitterDescription: seoDescription.value,
  twitterImage: `${domain}/mamadi.jpg`,
})


const showContent = ref(false)

onMounted(() => {
  showContent.value = true
})

</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center p-0 animate-background" 
       :style="{ backgroundImage: `url('/fondomamadi.jpg')` }">
    <div class="w-full bg-white bg-opacity-65 min-h-screen">
      <div class="relative z-10 w-full max-w-5xl mx-auto py-10">
        <transition name="card-fade-up" mode="out-in">
          <UCard v-if="showContent" class="bg-black bg-opacity-85 text-white">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Poster Column -->
              <transition name="slide-fade">
                <div v-show="showContent">
                  <img src="/mamadi.jpg" alt="MAMADI Poster" class="w-full h-auto rounded-lg shadow-xl animate-poster" />
                </div>
              </transition>
              
              <!-- Details Column -->
              <div class="flex flex-col justify-center">
                <transition name="fade-right" appear>
                  <h3 v-show="showContent" class="text-2xl uppercase font-heading mb-1 animate-text-1">{{ producer }}</h3>
                </transition>
                <transition name="fade-right" appear>
                  <p v-show="showContent" class="uppercase text-sm mb-4 animate-text-2">{{ producertagline }}</p>
                </transition>
                <transition name="fade-right" appear>
                  <h1 v-show="showContent" class="text-7xl font-heading mb-4 animate-text-3">{{ title }}</h1>
                </transition>
                <transition name="fade-right" appear>
                  <p v-show="showContent" class="text-xl mb-6 italic animate-text-4">{{ tagline }}</p>
                </transition>
                <transition name="fade" appear>
                  <div v-show="showContent" class="animate-rest">
                    <p class="text-2xl font-bold mb-6">{{ releaseDate }}</p>
                    <p class="mb-6 font-thin text-xl">{{ description }}</p>
                    <form @submit.prevent="submitForm" class="mb-8 pr-5">
                      <UInput v-model="email" placeholder="Enter your email" type="email" class="mb-2" />
                      <UButton type="submit" color="primary" class="w-full animate-button">Subscribe for Updates</UButton>
                    </form>
                    <h2 class="text-2xl mb-4">Follow his Journey</h2>
                    <div class="flex space-x-4">
                      <UButton v-for="link in socialLinks" :key="link.name" :to="link.url" color="primary" variant="ghost" class="animate-social-icon">
                        {{ link.name }}
                      </UButton>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </UCard>        
        </transition>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.animate-background {
  animation: subtleMove 90s ease-in-out infinite alternate;
}

@keyframes subtleMove {
  from { background-position: 0% 0%; }
  to { background-position: 100% 100%; }
}

.animate-poster {
  animation: scaleUp 1s ease-out;
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-title {
  animation: glowText 2s ease-in-out infinite alternate;
}

@keyframes glowText {
  from { text-shadow: 0 0 5px rgba(255,255,255,0.1); }
  to { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
}

.animate-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.animate-social-icon {
  transition: transform 0.3s ease;
}

.animate-social-icon:hover {
  transform: scale(1.1);
}

.card-fade-up-enter-active,
.card-fade-up-leave-active {
  transition: all 0.5s ease;
}
.card-fade-up-enter-from,
.card-fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s ease;
}
.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.animate-text-1 {
  animation: fadeInRight 0.5s ease-out 0.5s both;
}
.animate-text-2 {
  animation: fadeInRight 0.5s ease-out 0.7s both;
}
.animate-text-3 {
  animation: fadeInRight 0.5s ease-out 0.9s both;
}
.animate-text-4 {
  animation: fadeInRight 0.5s ease-out 1.1s both;
}
.animate-rest {
  animation: fadeIn 0.5s ease-out 1.3s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

</style>
