<template>
  <div class="max-w-md w-full mx-auto my-auto">
    <header class="mb-6">
      <h1
        class="font-title text-[32px] md:text-[36px] leading-tight mb-2 reveal-item"
        style="animation-delay: 100ms"
      >
        {{ t('auth.welcomeBack') }}
      </h1>
      <p class="text-secondary font-body reveal-item" style="animation-delay: 150ms">
        {{ t('auth.enterDetails') }}
      </p>
    </header>

    <!-- Verification Success Message Banner -->
    <div
      v-if="verifiedSuccess"
      class="mb-6 p-4 bg-secondary/10 text-secondary rounded-md text-[13px] border border-secondary/10 reveal-item flex items-center gap-2 animate-waterfall"
    >
      <span class="material-symbols-outlined !text-[18px]">check_circle</span>
      <span class="font-medium">{{ t('auth.emailVerifiedSuccess') }}</span>
    </div>

    <LoginForm />

    <!-- Footer Link -->
    <div class="mt-8 reveal-item" style="animation-delay: 500ms">
      <p class="text-secondary font-body text-[14px]">
        {{ t('auth.newHere') }}
        <NuxtLink
          class="text-on-background font-bold underline underline-offset-4 hover:text-primary transition-colors"
          :to="localePath('/register')"
        >
          {{ t('auth.createSpace') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import { useRoute } from '#app'

const { t } = useI18n()

definePageMeta({
  layout: 'auth',
  authVisual: 'login',
})

useHead({
  title: t('auth.signIn'),
})

const localePath = useLocalePath()
const route = useRoute()

const verifiedSuccess = computed(() => route.query.verified === 'true')
</script>
