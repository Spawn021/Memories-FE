<template>
  <div class="max-w-md w-full mx-auto my-auto flex flex-col">
    <header class="mb-6">
      <h1
        class="font-title text-[32px] md:text-[36px] leading-tight mb-2 reveal-item"
        style="animation-delay: 100ms"
      >
        {{ t('auth.welcomeBack') }}
      </h1>
      <p
        class="text-secondary font-body reveal-item"
        style="animation-delay: 150ms"
      >
        {{ t('auth.enterDetails') }}
      </p>
    </header>

    <!-- Verification Success Message Banner -->
    <div
      v-if="verifiedSuccess"
      class="mb-6 p-4 bg-secondary/20 text-secondary rounded-md text-[13px] border border-secondary/10 reveal-item flex items-center gap-2 animate-waterfall"
    >
      <span class="material-symbols-outlined text-lg!">check_circle</span>
      <span class="font-medium">{{ t('auth.emailVerifiedSuccess') }}</span>
    </div>

    <LoginForm />

    <!-- Footer Link -->
    <div
      class="mt-8 reveal-item self-center"
      style="animation-delay: 500ms"
    >
      <p class="text-secondary font-body text-[14px]">
        {{ t('auth.newHere') }}
        <NuxtLink
          class="text-primary font-bold hover:underline hover:underline-offset-4 transition-colors"
          :to="routes.register()"
        >
          {{ t('auth.createSpace') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/features/auth/components/LoginForm.vue'

const { t } = useI18n()
const routes = useRoutes()

definePageMeta({
  layout: 'auth',
  authVisual: 'login',
})

useHead({
  title: t('auth.signIn'),
})

const route = useRoute()

const verifiedSuccess = computed(() => route.query.verified === 'true')
</script>
