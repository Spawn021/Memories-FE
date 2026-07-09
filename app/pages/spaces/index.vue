<template>
  <NuxtLayout name="space">
    <template #sidebar>
      <!-- Greeting & Emotion Quote -->
      <div class="my-6 md:my-auto space-y-6 grow flex flex-col justify-center">
        <div class="space-y-6">
          <h1 class="reveal-item font-title text-3xl font-bold tracking-tight text-on-surface delay-100">
            Welcome back,<br />
            <span class="text-primary">{{ authStore.user?.displayName || 'Archive Owner' }}</span>
          </h1>

          <div class="reveal-item space-y-4 delay-150">
            <p class="font-poetic text-2xl italic text-secondary leading-relaxed">
              "Your memories are the architecture of your soul. Choose a sanctuary to begin."
            </p>
            <div class="h-px w-12 bg-border-strong"></div>
            <p class="text-[12px] uppercase tracking-widest text-secondary/50">Sanctuary Portal // Access Vaults</p>
          </div>
        </div>
      </div>
    </template>

    <SpacesList />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import SpacesList from '~/features/spaces/components/SpacesList.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  paddingClass: 'p-8 lg:p-16',
})

useHead({
  title: 'Sanctuary Portal - Memories',
})

const authStore = useAuthStore()
</script>
