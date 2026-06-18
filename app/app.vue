<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastMessage />
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/main.css'
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
