// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/fonts",
    "@vueuse/nuxt",
    "@sidebase/nuxt-auth"
  ],
  plugins: ['~/plugins/firebase.ts'],
  // auth: {
  //   provider: {
  //       type: 'authjs'
  //   },
  //   globalAppMiddleware: false
  // },
  runtimeConfig: {
    // Private keys that are exposed to the server
    // Add any server-only keys here
    
    // Public keys that are exposed to the client
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      }
    }
  }

  // fonts: {
  //   families: [
  //     { name: "Anton SC", provider: "google"},
  //     { name: "Roboto", provider: "google"},

  //   ]
  // }
})