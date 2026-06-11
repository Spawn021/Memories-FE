<template>
  <div>
    <!-- Global Error Message Banner -->
    <div
      v-if="error"
      class="mb-6 p-4 bg-danger-container text-on-danger-container rounded-md text-[14px] border border-border reveal-item animate-waterfall"
    >
      {{ error }}
    </div>

    <form
      class="space-y-5"
      @submit.prevent="handleLogin"
    >
      <!-- Email Field -->
      <div
        class="space-y-1.5 reveal-item"
        style="animation-delay: 200ms"
      >
        <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">EMAIL ADDRESS</label>
        <v-text-field
          id="email"
          v-model="email"
          type="email"
          placeholder="e.g. hoang.nam@domain.com"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :error-messages="validationErrors.email"
          class="custom-v-input"
        />
      </div>

      <!-- Password Field -->
      <div
        class="space-y-1.5 reveal-item"
        style="animation-delay: 250ms"
      >
        <div class="flex justify-between items-end">
          <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">PASSWORD</label>
          <NuxtLink
            to="/forgot-password"
            class="text-[13px] text-secondary hover:text-primary transition-colors underline underline-offset-4"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <v-text-field
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          color="primary"
          size="large"
          variant="outlined"
          density="compact"
          hide-details="auto"
          class="custom-v-input"
        >
          <template #append-inner>
            <button
              type="button"
              class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
              :title="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined !text-[20px]">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </template>
        </v-text-field>
      </div>

      <!-- Remember Me -->
      <v-checkbox
        id="remember"
        v-model="rememberMe"
        hide-details="auto"
        color="primary"
        class="custom-v-checkbox reveal-item"
        style="animation-delay: 300ms"
      >
        <template #label>
          <span class="text-[13px] font-body text-secondary">Remember this device</span>
        </template>
      </v-checkbox>

      <!-- CTA Actions -->
      <div class="space-y-4 pt-2">
        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          class="reveal-item spring-btn font-body tracking-wider uppercase font-semibold! rounded-lg! h-12.5!"
          style="animation-delay: 350ms"
        >
          Sign In
        </v-btn>

        <div
          class="flex items-center gap-4 py-1.5 reveal-item"
          style="animation-delay: 400ms"
        >
          <div class="flex-grow h-[1px] bg-border"></div>
          <span class="text-[13px] text-secondary/50 font-body italic lowercase">or</span>
          <div class="flex-grow h-[1px] bg-border"></div>
        </div>

        <v-btn
          type="button"
          variant="outlined"
          block
          size="large"
          class="reveal-item spring-btn font-body tracking-wider uppercase text-on-surface border-border"
          style="animation-delay: 450ms; font-weight: 600; border-radius: var(--radius-lg); height: 50px"
          @click="handleGoogleLogin"
        >
          <template #prepend>
            <img
              :src="GoogleIcon"
              alt="Google"
              class="h-4 w-4 shrink-0 mr-1"
            />
          </template>
          Continue with Google
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GoogleIcon } from '~/assets/icons'
import { useForm } from '~/composables/useForm'
import { navigateTo } from '#app'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const { login, loginWithGoogle, loading } = useAuth()
const { validationErrors, error, validate, handleApiError } = useForm(loginSchema)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  const isValid = validate({
    email: email.value,
    password: password.value,
  })

  if (!isValid) return

  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (err) {
    handleApiError(err)
  }
}

const handleGoogleLogin = () => {
  loginWithGoogle()
}
</script>
