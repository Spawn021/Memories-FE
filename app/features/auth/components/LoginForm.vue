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
      <div class="space-y-1.5 reveal-item delay-200">
        <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.email') }}</label>
        <v-text-field
          id="email"
          v-model="email"
          type="email"
          :placeholder="t('form.placeholders.email')"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :error-messages="validationErrors.email"
          @focus="clearFieldError('email')"
          @blur="validateFieldOnBlur('email')"
        />
      </div>

      <!-- Password Field -->
      <div class="space-y-1.5 reveal-item delay-250">
        <div class="flex justify-between items-end">
          <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.password') }}</label>
          <NuxtLink :to="routes.forgotPassword()">
            <span class="text-[13px] font-body hover:text-primary! text-secondary hover:underline hover:underline-offset-4">
              {{ t('form.forgotPassword') }}
            </span>
          </NuxtLink>
        </div>
        <v-text-field
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('form.placeholders.password')"
          color="primary"
          size="large"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :error-messages="validationErrors.password"
          @focus="clearFieldError('password')"
          @blur="validateFieldOnBlur('password')"
        >
          <template #append-inner>
            <button
              type="button"
              class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
              :title="showPassword ? t('form.hidePassword') : t('form.showPassword')"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined text-xl! text-primary">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </template>
        </v-text-field>
      </div>

      <v-checkbox
        id="remember"
        v-model="rememberMe"
        hide-details="auto"
        color="primary"
        class="custom-v-checkbox reveal-item delay-300"
      >
        <template #label>
          <span class="text-[13px] font-body text-secondary">{{ t('auth.rememberDevice') }}</span>
        </template>
      </v-checkbox>

      <div class="space-y-4 pt-2 animate-waterfall delay-400">
        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          class="spring-btn font-body tracking-wider uppercase font-semibold! rounded-lg! h-12.5!"
        >
          {{ t('auth.signIn') }}
        </v-btn>

        <div class="flex items-center gap-4 py-1.5">
          <div class="grow h-px bg-border"></div>
          <span class="text-[13px] text-secondary/50 font-body italic lowercase">{{ t('auth.or') }}</span>
          <div class="grow h-px bg-border"></div>
        </div>

        <v-btn
          type="button"
          variant="outlined"
          block
          size="large"
          class="spring-btn font-body tracking-wider uppercase text-on-surface border-border delay-450 font-semibold h-12.5! rounded-lg!"
          @click="handleGoogleLogin"
        >
          <template #prepend>
            <img
              :src="GoogleIcon"
              alt="Google"
              class="h-4 w-4 shrink-0 mr-1"
            />
          </template>
          {{ t('auth.continueGoogle') }}
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { GoogleIcon } from '~/assets/icons'
import { loginSchema } from '~/features/auth/schemas/login.schema'
import { useAuth } from '../auth.queries'

const route = useRoute()
const routes = useRoutes()
const { t } = useI18n()

const { useLogin, loginWithGoogle } = useAuth()
const { mutateAsync: login, isPending: loading } = useLogin()
const { validationErrors, error, validate, handleApiError, clearFieldError, validateFieldOnBlur } = useForm(loginSchema)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  const isValid = validate({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })

  if (!isValid) return

  try {
    await login({ email: email.value, password: password.value, rememberMe: rememberMe.value })
    const redirectPath = route.query.redirect as string | undefined
    if (redirectPath && redirectPath.startsWith('/')) {
      await navigateTo(redirectPath)
    } else {
      await navigateTo(routes.home())
    }
  } catch (err) {
    handleApiError(err)
  }
}

const handleGoogleLogin = () => {
  const redirectPath = route.query.redirect as string | undefined
  loginWithGoogle(redirectPath)
}
</script>
