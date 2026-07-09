<template>
  <div class="max-w-form-max-width w-full mx-auto my-auto">
    <OtpForm
      v-if="registrationSuccess"
      :email="registeredEmail"
    />
    <RegisterForm
      v-else
      @success="onRegisterSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import OtpForm from '~/features/auth/components/OtpForm.vue'
import RegisterForm from '~/features/auth/components/RegisterForm.vue'

definePageMeta({
  layout: 'auth',
  authVisual: 'register',
})

const { t } = useI18n()

useHead({
  title: t('auth.createSpace'),
})

// State
const registrationSuccess = ref(false)
const registeredEmail = ref('')

// Registration Success Handler
const onRegisterSuccess = (data: { email: string; password?: string }) => {
  registeredEmail.value = data.email
  registrationSuccess.value = true
}
</script>
