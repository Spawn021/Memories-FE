<template>
  <div class="stitch-marketing-layout min-h-screen flex flex-col">
    <MarketingHeader />
    <main class="grow pt-16">
      <slot />
    </main>
    <MarketingFooter />
  </div>
</template>

<script setup>
import MarketingHeader from '~/components/marketing/Header.vue'
import MarketingFooter from '~/components/marketing/Footer.vue'

useHead({
  bodyAttrs: {
    class: 'bg-background text-on-background font-body selection:bg-primary/20',
  },
})
</script>
