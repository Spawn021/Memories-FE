<template>
  <div class="max-w-md w-full mx-auto my-auto flex flex-col">
    <ForgotPasswordForm />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'auth',
  authVisual: 'forgotPassword',
})

useHead({
  title: t('auth.forgotPassword'),
})
</script>
