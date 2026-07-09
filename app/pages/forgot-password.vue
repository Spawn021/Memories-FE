<template>
  <div class="max-w-md w-full mx-auto my-auto flex flex-col">
    <ForgotPasswordForm />
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordForm from '~/features/auth/components/ForgotPasswordForm.vue'

const { t } = useI18n()

definePageMeta({
  layout: 'auth',
  authVisual: 'forgotPassword',
})

useHead({
  title: t('auth.forgotPassword'),
})
</script>
