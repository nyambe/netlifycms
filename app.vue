<script setup>
onMounted(() => {
  if (process.client) {
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    document.head.appendChild(script)
  }
})
</script>

<template>
  <div>
    <LandingPage />
  </div>

</template>
