<script setup lang="ts">


useHead({
  script: [
    {
      src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
      body: true
    }
  ]
})

// Optional: Log when the component is mounted
onMounted(() => {
  console.log('Component mounted, Netlify Identity script should be loaded')
  
  // Initialize Netlify Identity
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  } else {
    console.warn('Netlify Identity widget not loaded');
  }
})
</script>
<template>
  <div>
    <slot />
  </div>
</template>

<style>

</style>