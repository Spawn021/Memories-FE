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
import { ref } from 'vue'
import { useHead } from '#imports'

definePageMeta({
  layout: 'auth',
  authVisual: 'register',
})

useHead({
  title: 'Create Space',
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
