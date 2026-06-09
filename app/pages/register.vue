<template>
  <main class="h-screen w-screen flex" @mousemove="onMouseMove">

    <section class="w-full md:w-1/2 flex flex-col justify-between px-8 md:px-16 py-8">
      <div class="reveal-item" style="animation-delay: 50ms">
        <NuxtLink to="/">
          <img :src="LogoText" alt="Logo" class="h-7 w-auto mb-6" />
        </NuxtLink>
      </div>

      <div class="max-w-form-max-width w-full mx-auto my-auto">
        <div v-if="registrationSuccess" class="animate-waterfall text-center py-6 max-w-sm mx-auto">
          <div
            class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-container text-secondary mb-4"
          >
            <span class="material-symbols-outlined text-2xl">mail</span>
          </div>
          <h2 class="font-headline-md text-xl mb-3">Enter Verification Code</h2>
          <p class="text-muted-leaf mb-6 font-body-md text-[15px] leading-relaxed">
            We have sent a 6-digit verification code to<br />
            <strong class="text-obsidian-ink">{{ email }}</strong
            >.
          </p>

          <div
            v-if="otpError"
            class="mb-4 p-3.5 bg-error-container text-error rounded-md text-[13px] border border-error/10 text-left animate-waterfall"
          >
            {{ otpError }}
          </div>

          <form class="space-y-6" @submit.prevent="handleVerifyOtp">
            <div class="flex justify-center mb-6 v-otp-container">
              <v-otp-input
                v-model="otp"
                length="6"
                type="number"
                :disabled="loading"
                @finish="handleVerifyOtp"
              />
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              full-width
              size="lg"
              :loading="loading"
              :disabled="otp.length !== 6"
            >
              Verify Account
            </BaseButton>
          </form>

          <div class="mt-6 text-center">
            <p class="text-muted-leaf font-body-md text-[14px]">
              Didn't receive the code?
              <button
                type="button"
                class="text-sunlit-clementine font-medium hover:underline focus:outline-none cursor-pointer disabled:opacity-50 disabled:no-underline font-body-md"
                :disabled="resendCooldown > 0 || loading"
                @click="handleResendOtp"
              >
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
              </button>
            </p>
          </div>
        </div>

        <!-- Form State -->
        <div v-else>
          <header class="mb-6 animate-waterfall" style="animation-delay: 50ms">
            <h1 class="font-headline-lg text-2xl md:text-3xl mb-1.5">Create your space</h1>
            <p class="font-body-md text-muted-leaf text-[15px]">
              Start preserving your moments with friends and family.
            </p>
          </header>

          <div
            v-if="error"
            class="mb-4 p-3.5 bg-error-container text-error rounded-md text-[13px] border border-error/10 animate-waterfall"
          >
            {{ error }}
          </div>

          <form class="space-y-4" @submit.prevent="handleRegister">
            <!-- Email Field -->
            <div class="space-y-1.5 animate-waterfall" style="animation-delay: 100ms">
              <label
                class="block font-label-sm text-[12px] uppercase tracking-widest text-muted-leaf"
                >EMAIL ADDRESS</label
              >
              <v-text-field
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
            <div class="space-y-1.5 animate-waterfall" style="animation-delay: 150ms">
              <label
                class="block font-label-sm text-[12px] uppercase tracking-widest text-muted-leaf"
                >PASSWORD</label
              >
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="validationErrors.password"
                class="custom-v-input"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-muted-leaf/40 hover:text-sunlit-clementine transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
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

            <!-- Confirm Password Field -->
            <div class="space-y-1.5 animate-waterfall" style="animation-delay: 200ms">
              <label
                class="block font-label-sm text-[12px] uppercase tracking-widest text-muted-leaf"
                >CONFIRM PASSWORD</label
              >
              <v-text-field
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="validationErrors.confirmPassword"
                class="custom-v-input"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-muted-leaf/40 hover:text-sunlit-clementine transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
                    :title="showConfirmPassword ? 'Hide password' : 'Show password'"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <span class="material-symbols-outlined !text-[20px]">
                      {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </template>
              </v-text-field>
            </div>

            <!-- Terms Checkbox -->
            <v-checkbox
              v-model="terms"
              hide-details="auto"
              color="primary"
              class="animate-waterfall"
              style="animation-delay: 250ms"
            >
              <template #label>
                <span class="text-[13px] font-body-md text-muted-leaf">
                  I agree to the
                  <NuxtLink class="text-sunlit-clementine hover:underline" to="/terms" @click.stop
                    >Terms</NuxtLink
                  >
                  &amp;
                  <NuxtLink class="text-sunlit-clementine hover:underline" to="/privacy" @click.stop
                    >Privacy Policy</NuxtLink
                  >
                </span>
              </template>
            </v-checkbox>

            <!-- CTA Actions -->
            <div class="space-y-4 pt-3 animate-waterfall" style="animation-delay: 400ms">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="spring-btn font-label-md tracking-wider uppercase"
                style="font-weight: 600; border-radius: var(--radius-lg); height: 50px"
              >
                Create Space
              </v-btn>

              <div class="relative flex items-center py-1">
                <div class="grow border-t border-whisper-border"></div>
                <span class="shrink mx-3 text-surface-dim font-label-sm text-[11px]">OR</span>
                <div class="grow border-t border-whisper-border"></div>
              </div>

              <v-btn
                type="button"
                variant="outlined"
                block
                size="large"
                class="spring-btn font-label-md tracking-wider uppercase text-obsidian-ink border-obsidian-ink/10"
                style="font-weight: 600; border-radius: var(--radius-lg); height: 50px"
                @click="handleGoogleLogin"
              >
                <template #prepend>
                  <svg class="h-4 w-4 shrink-0 mr-1" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                </template>
                Continue with Google
              </v-btn>
            </div>
          </form>

          <footer class="mt-8 text-center animate-waterfall" style="animation-delay: 450ms">
            <p class="font-body-md text-muted-leaf text-[14px]">
              Already have a space?
              <NuxtLink class="text-sunlit-clementine font-medium hover:underline" to="/login"
                >Sign In</NuxtLink
              >
            </p>
          </footer>
        </div>
      </div>
    </section>

    <section
      class="hidden md:flex md:w-1/2 bg-canvas-linen flex-col justify-center items-center px-16 relative overflow-hidden"
    >
      <!-- Asymmetric Collage Container -->
      <div class="grid grid-cols-2 gap-8 max-w-lg relative z-10 p-4">
        <!-- Polaroid 1 -->
        <div class="animate-waterfall self-start" style="animation-delay: 600ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('-4deg', 0.5)">
            <img
              alt="Memory fragment 1"
              class="w-full aspect-3/4 object-cover"
              src="../assets/images/polaroid_1.png"
            />
          </div>
        </div>
        <!-- Polaroid 2 -->
        <div class="animate-waterfall mt-12" style="animation-delay: 700ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('2deg', 1.0)">
            <img
              alt="Memory fragment 2"
              class="w-full aspect-4/3 object-cover"
              src="../assets/images/polaroid_2.png"
            />
          </div>
        </div>
        <!-- Polaroid 3 -->
        <div class="animate-waterfall -mt-6" style="animation-delay: 800ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('-2deg', 1.5)">
            <img
              alt="Memory fragment 3"
              class="w-full aspect-square object-cover"
              src="../assets/images/polaroid_3.png"
            />
          </div>
        </div>
        <div class="animate-waterfall self-end" style="animation-delay: 900ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('5deg', 2.0)">
            <img
              alt="Memory fragment 4"
              class="w-full aspect-3/4 object-cover"
              src="../assets/images/polaroid_4.png"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-16 text-center max-w-sm z-10 animate-waterfall"
        style="animation-delay: 1100ms"
      >
        <p
          class="font-poetic-accent text-poetic-accent italic text-on-surface-variant mb-4 text-xl"
        >
          “We write to taste life twice, in the moment and in retrospect.”
        </p>
        <cite
          class="font-label-sm text-label-sm tracking-widest text-muted-leaf uppercase not-italic"
        >
          — Anaïs Nin
        </cite>
      </div>

      <!-- Atmospheric Pulse Background Details -->
      <div
        class="absolute top-1/4 right-0 w-96 h-96 bg-sunlit-clementine/5 rounded-full blur-[100px] -mr-48"
      ></div>
      <div
        class="absolute bottom-1/4 left-0 w-96 h-96 bg-muted-leaf/5 rounded-full blur-[100px] -ml-48"
      ></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { LogoText } from '~/assets/icons'
import { registerSchema } from '~/schema/register.schema'
import { navigateTo } from '#app'
import { ApiError, type ApiErrorResponse } from '~/types'
import { useToast } from '~/composables/useToast'

const { register, verifyEmail, loginWithGoogle, loading } = useAuth()
const { validationErrors, error, validate, handleApiError } = useForm(registerSchema)
const toast = useToast()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const terms = ref(false)
const registrationSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const otp = ref('')
const otpError = ref('')
const resendCooldown = ref(0)
let cooldownInterval: any = null

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

// Parallax effect reactive variables
const moveX = ref(0)
const moveY = ref(0)
const isAnimated = ref(false)

const onMouseMove = (e: MouseEvent) => {
  if (process.client && window.innerWidth >= 768) {
    moveX.value = (e.clientX - window.innerWidth / 2) * 0.005
    moveY.value = (e.clientY - window.innerHeight / 2) * 0.005
  }
}

onMounted(() => {
  setTimeout(() => {
    isAnimated.value = true
  }, 1200)
})

// Dynamic Parallax style generator for polaroids
const getPolaroidStyle = (baseRotation: string, depth: number) => {
  const rotationVar = { '--rotation': baseRotation } as any
  if (!isAnimated.value) {
    return rotationVar
  }
  const x = moveX.value * depth * 3.0
  const y = moveY.value * depth * 3.0
  return {
    ...rotationVar,
    transform: `rotate(${baseRotation}) translate(${x}px, ${y}px)`,
    transition: 'transform 0.15s ease-out',
  }
}

// Submission Handler
const handleRegister = async () => {
  const isValid = validate({
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    terms: terms.value,
  })

  if (!isValid) return

  try {
    const result = await register(email.value, password.value)
    console.log(result)
    registrationSuccess.value = true
    toast.success('Registration successful! Please check your email for the verification code.')
  } catch (err) {
    handleApiError(err)
  }
}

const handleVerifyOtp = async () => {
  if (otp.value.length !== 6) return
  otpError.value = ''
  try {
    const result = await verifyEmail(email.value, otp.value)
    await navigateTo('/login?verified=true')
  } catch (err) {
    const error = err as ApiErrorResponse
    otpError.value = error.message
  }
}

const handleResendOtp = async () => {
  if (resendCooldown.value > 0) return
  otpError.value = ''
  try {
    await register(email.value, password.value)
    resendCooldown.value = 60
    startCooldownTimer()
  } catch {
    otpError.value = 'Failed to resend verification code.'
  }
}

const handleGoogleLogin = () => {
  loginWithGoogle()
}
</script>

<style scoped>
.v-otp-container :deep(.v-otp-input) {
  padding: 0;
  justify-content: center;
}
.v-otp-container :deep(.v-otp-input__content) {
  gap: 8px;
  max-width: 100%;
}
.v-otp-container :deep(.v-otp-input__field) {
  background-color: var(--color-pure-surface) !important;
  border: 1px solid rgba(24, 26, 26, 0.1) !important;
  border-radius: var(--radius-lg) !important;
  color: var(--color-obsidian-ink) !important;
  height: 52px !important;
  width: 44px !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  text-align: center !important;
  transition: all 0.2s ease !important;
  box-shadow: none !important;
}
.v-otp-container :deep(.v-otp-input__field:focus) {
  border-color: var(--color-sunlit-clementine) !important;
  box-shadow: 0 0 0 3px rgba(226, 106, 74, 0.18) !important;
  outline: none !important;
}

/* Custom Vuetify input styles to match design system */
:deep(.v-text-field .v-field) {
  background-color: var(--color-pure-surface) !important;
  border-radius: var(--radius-lg) !important;
}
:deep(.v-text-field .v-field__outline) {
  --v-field-border-opacity: 0.15 !important;
  color: var(--color-obsidian-ink) !important;
}
:deep(.v-text-field .v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1 !important;
  color: var(--color-sunlit-clementine) !important;
}
:deep(.v-text-field .v-field__input) {
  font-family: var(--font-body-md) !important;
  font-size: 15px !important;
  min-height: 48px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  color: var(--color-obsidian-ink) !important;
}
:deep(.v-text-field .v-input__details) {
  padding-inline: 4px !important;
  padding-top: 4px !important;
  font-size: 11px !important;
  color: var(--color-error) !important;
}

/* Custom Vuetify checkbox styles */
:deep(.v-checkbox .v-selection-control) {
  min-height: 32px !important;
}
:deep(.v-checkbox .v-label) {
  opacity: 1 !important;
}
:deep(.v-checkbox .v-selection-control__input) {
  color: var(--color-sunlit-clementine) !important;
}
</style>
