<template>
  <div>
    <header class="mb-6 animate-waterfall delay-50">
      <h1 class="font-title text-2xl md:text-3xl mb-1.5">{{ t('auth.forgotPassword') }}</h1>
      <p class="font-body text-secondary text-[15px]">{{ t('auth.forgotPasswordSubtitle') }}</p>
    </header>

    <div
      v-if="emailError || passwordError"
      class="mb-4 p-3.5 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border animate-waterfall"
    >
      {{ emailError || passwordError }}
    </div>

    <v-stepper
      v-model="step"
      hide-actions
      class="bg-transparent! shadow-none! animate-waterfall delay-100 px-0"
    >
      <v-stepper-header class="shadow-none!">
        <v-stepper-item
          title="Email"
          :value="1"
          :complete="step > 1"
          color="primary"
        ></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          title="OTP"
          :value="2"
          :complete="step > 2"
          color="primary"
        ></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          title="Password"
          :value="3"
          color="primary"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window class="mt-4 mx-0 px-0">
        <!-- Step 1: Email -->
        <v-stepper-window-item
          :value="1"
          class="px-0"
        >
          <form
            class="space-y-4 pt-2"
            @submit.prevent="handleEmailSubmit"
          >
            <div class="space-y-1.5">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.email') }}</label>
              <v-text-field
                v-model="emailForm.email"
                type="email"
                :placeholder="t('form.placeholders.email')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationEmailErrors.email"
                @focus="clearEmailError('email')"
                @blur="validateEmailField('email')"
              />
            </div>
            <div class="pt-2">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="spring-btn font-body tracking-wider uppercase font-bold! rounded-lg! h-12.5!"
              >
                {{ t('auth.sendResetCode') }}
              </v-btn>
            </div>
          </form>
        </v-stepper-window-item>

        <!-- Step 2: OTP -->
        <v-stepper-window-item
          :value="2"
          class="px-0"
        >
          <form
            class="space-y-4 pt-2"
            @submit.prevent="handleOtpSubmit"
          >
            <div class="space-y-1.5 text-center mb-6">
              <p class="font-body text-[14px] text-secondary">
                {{ t('auth.otpSentTo') }} <span class="font-medium text-on-surface">{{ emailForm.email }}</span>
              </p>
            </div>

            <div class="space-y-1.5">
              <v-otp-input
                v-model="otp"
                type="number"
                :length="6"
                variant="outlined"
                class="mx-auto max-w-[320px]"
                :disabled="loading"
                @finish="handleOtpSubmit"
              />
            </div>

            <div class="pt-4">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="otp.length !== 6"
                class="spring-btn font-body! tracking-wider uppercase! font-sembold! h-12.5! rounded-lg!"
              >
                {{ t('auth.verifyOtp') }}
              </v-btn>

              <div class="text-center mt-4">
                <button
                  type="button"
                  class="text-[13px] font-body text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:no-underline"
                  :disabled="resendCooldown > 0 || loading || resending"
                  @click="handleResendOtp"
                >
                  {{
                    resendCooldown > 0
                      ? t('auth.resendIn', { seconds: resendCooldown })
                      : resending
                        ? t('auth.resending')
                        : t('auth.resendCode')
                  }}
                </button>
              </div>
            </div>
          </form>
        </v-stepper-window-item>

        <!-- Step 3: New Password -->
        <v-stepper-window-item
          :value="3"
          class="px-0"
        >
          <form
            class="space-y-4 pt-2"
            @submit.prevent="handlePasswordSubmit"
          >
            <div class="space-y-1.5">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.newPassword') }}</label>
              <v-text-field
                v-model="passwordForm.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t('form.placeholders.password')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationPasswordErrors.password"
                @focus="clearPasswordError('password')"
                @blur="validatePasswordField('password')"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined text-[20px]! text-primary">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </template>
              </v-text-field>
            </div>

            <div class="space-y-1.5">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{
                t('form.labels.confirmPassword')
              }}</label>
              <v-text-field
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="t('form.placeholders.password')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationPasswordErrors.confirmPassword"
                @focus="clearPasswordError('confirmPassword')"
                @blur="validatePasswordField('confirmPassword')"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <span class="material-symbols-outlined text-[20px]! text-primary">
                      {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </template>
              </v-text-field>
            </div>

            <div class="pt-2">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="spring-btn font-body tracking-wider uppercase font-bold! rounded-lg! h-12.5!"
              >
                {{ t('auth.resetPassword') }}
              </v-btn>
            </div>
          </form>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>

    <footer class="mt-8 text-center animate-waterfall delay-450">
      <p class="font-body text-secondary text-[14px]">
        {{ t('auth.rememberPassword') }}
        <NuxtLink
          class="text-primary font-medium hover:underline"
          :to="routes.login()"
        >
          {{ t('auth.signIn') }}
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { emailSchema, newPasswordSchema } from '~/features/auth/schemas/forgot-password.schema'
import { TIME_RESEND_OTP } from '~/constants'
import { useAuth } from '../auth.queries'

const { t } = useI18n()
const routes = useRoutes()

const { handleError } = useErrorHandler()
const { useForgotPassword, useVerifyResetOtp, useResetPassword } = useAuth()
const { execute: forgotPassword, loading: forgotLoading, error: forgotError, data: forgotResult } = useForgotPassword()
const { execute: verifyResetOtp, loading: verifyLoading, error: verifyError } = useVerifyResetOtp()
const { execute: resetPassword, loading: resetLoading, error: resetError, data: resetResult } = useResetPassword()

const loading = computed(() => forgotLoading.value || verifyLoading.value || resetLoading.value)
const toast = useToast()

const step = ref(1)

// Step 1: Email
const emailForm = reactive({ email: '' })
const {
  error: emailError,
  validationErrors: validationEmailErrors,
  validate: validateEmail,
  clearFieldError: clearEmailError,
  validateFieldOnBlur: validateEmailField,
  handleApiError: handleApiErrorEmail,
} = useForm(emailSchema, emailForm)

// Step 2: OTP
const otp = ref('')
const resending = ref(false)
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const startCooldownTimer = () => {
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

// Step 3: Password
const passwordForm = reactive({ password: '', confirmPassword: '' })
const {
  error: passwordError,
  validationErrors: validationPasswordErrors,
  validate: validatePassword,
  clearFieldError: clearPasswordError,
  validateFieldOnBlur: validatePasswordField,
  handleApiError: handleApiErrorPassword,
} = useForm(newPasswordSchema, passwordForm)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleEmailSubmit = async () => {
  emailError.value = ''
  if (!validateEmail()) return

  await forgotPassword(emailForm.email)
  if (forgotError.value) {
    handleApiErrorEmail(forgotError.value)
    return
  }

  if (forgotResult.value) {
    toast.success(t(forgotResult.value.message))
  }
  step.value = 2
  resendCooldown.value = TIME_RESEND_OTP
  startCooldownTimer()
}

const handleResendOtp = async () => {
  if (resendCooldown.value > 0 || resending.value) return
  resending.value = true
  await forgotPassword(emailForm.email)
  resending.value = false
  if (forgotError.value) {
    handleError(forgotError.value)
    return
  }

  if (forgotResult.value) {
    toast.success(t(forgotResult.value.message))
  }
  resendCooldown.value = TIME_RESEND_OTP
  startCooldownTimer()
}

const handleOtpSubmit = async () => {
  if (otp.value.length !== 6) return

  await verifyResetOtp(emailForm.email, otp.value)
  if (verifyError.value) {
    handleError(verifyError.value)
    return
  }
  step.value = 3
}

const handlePasswordSubmit = async () => {
  passwordError.value = ''
  if (!validatePassword()) return

  await resetPassword(passwordForm.password)
  if (resetError.value) {
    handleApiErrorPassword(resetError.value)
    return
  }

  if (resetResult.value) {
    toast.success(t(resetResult.value.message))
  }
  await navigateTo(routes.login())
}
</script>

<style scoped>
:deep(.v-stepper-header) {
  background: transparent !important;
}
:deep(.v-stepper) {
  background: transparent !important;
}
</style>
