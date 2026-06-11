<template>
  <main
    class="h-screen w-screen flex bg-background text-on-background font-body"
    @mousemove="onMouseMove"
  >
    <section class="w-full md:w-1/2 flex flex-col justify-between px-8 md:px-16 py-8 bg-surface z-10 overflow-y-auto">
      <div class="reveal-item flex justify-between items-center delay-50">
        <NuxtLink to="/">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto mb-6"
            alt="Memories Logo"
          />
        </NuxtLink>

        <button
          class="spring-btn p-2 -mt-6 rounded-full border border-border flex items-center justify-center cursor-pointer"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          type="button"
          @click="toggleTheme"
        >
          <span class="material-symbols-outlined text-[20px]! text-primary">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>
      </div>

      <div class="max-w-form-max-width w-full mx-auto my-auto">
        <div
          v-if="registrationSuccess"
          class="animate-waterfall text-center py-6 max-w-sm mx-auto"
        >
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
            <span class="material-symbols-outlined text-2xl text-primary">mail</span>
          </div>
          <h2 class="font-title text-xl mb-3">Enter Verification Code</h2>
          <p class="text-secondary mb-6 font-body text-[15px] leading-relaxed">
            We have sent a 6-digit verification code to<br />
            <strong class="text-on-surface">{{ email }}</strong>
            .
          </p>

          <div
            v-if="otpError"
            class="mb-4 p-3.5 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border text-left animate-waterfall"
          >
            {{ otpError }}
          </div>

          <form
            class="space-y-6"
            @submit.prevent="handleVerifyOtp"
          >
            <div class="flex justify-center mb-6">
              <v-otp-input
                v-model="otp"
                length="6"
                type="number"
                :disabled="loading"
                @finish="handleVerifyOtp"
              />
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              :disabled="otp.length !== 6"
              class="spring-btn font-body! tracking-wider uppercase! font-sembold! h-12.5! rounded-lg!"
            >
              Verify Account
            </v-btn>
          </form>

          <div class="mt-6 text-center">
            <p class="text-secondary font-body text-[14px]">
              Didn't receive the code?
              <button
                type="button"
                class="text-primary font-semibold hover:underline focus:outline-none cursor-pointer disabled:opacity-50 disabled:no-underline"
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
          <header class="mb-6 animate-waterfall delay-50">
            <h1 class="font-title text-2xl md:text-3xl mb-1.5">Create your space</h1>
            <p class="font-body text-secondary text-[15px]">Start preserving your moments with friends and family.</p>
          </header>

          <div
            v-if="error"
            class="mb-4 p-3.5 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border animate-waterfall"
          >
            {{ error }}
          </div>

          <form
            class="space-y-4"
            @submit.prevent="handleRegister"
          >
            <div class="space-y-1.5 animate-waterfall delay-100">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">EMAIL ADDRESS</label>
              <v-text-field
                v-model="email"
                type="email"
                placeholder="e.g. hoang.nam@domain.com"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationErrors.email"
              />
            </div>
            <div class="space-y-1.5 animate-waterfall delay-150">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">PASSWORD</label>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationErrors.password"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined text-[20px]! text-primary">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </template>
              </v-text-field>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1.5 animate-waterfall delay-200">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">CONFIRM PASSWORD</label>
              <v-text-field
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="validationErrors.confirmPassword"
              >
                <template #append-inner>
                  <button
                    type="button"
                    class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
                    :title="showConfirmPassword ? 'Hide password' : 'Show password'"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <span class="material-symbols-outlined text-[20px]! text-primary">
                      {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </template>
              </v-text-field>
            </div>

            <v-checkbox
              v-model="terms"
              hide-details="auto"
              color="primary"
              class="animate-waterfall delay-250"
            >
              <template #label>
                <span class="text-[13px] font-body text-secondary">
                  I agree to the
                  <NuxtLink
                    class="text-primary hover:underline"
                    to="/terms"
                    @click.stop
                  >
                    Terms
                  </NuxtLink>
                  &amp;
                  <NuxtLink
                    class="text-primary hover:underline"
                    to="/privacy"
                    @click.stop
                  >
                    Privacy Policy
                  </NuxtLink>
                </span>
              </template>
            </v-checkbox>

            <!-- CTA Actions -->
            <div class="space-y-4 pt-3 animate-waterfall delay-400">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="spring-btn font-body tracking-wider uppercase font-bold! rounded-lg! h-12.5!"
              >
                Create Space
              </v-btn>

              <div class="relative flex items-center py-1">
                <div class="grow border-t border-border"></div>
                <span class="shrink mx-3 text-secondary/50 font-body text-[11px]">OR</span>
                <div class="grow border-t border-border"></div>
              </div>

              <v-btn
                type="button"
                variant="outlined"
                block
                size="large"
                class="spring-btn font-body tracking-wider uppercase text-on-surface border-border"
                style="font-weight: 600; border-radius: var(--radius-lg); height: 50px"
                @click="handleGoogleLogin"
              >
                <template #prepend>
                  <svg
                    class="h-4 w-4 shrink-0 mr-1"
                    viewBox="0 0 24 24"
                  >
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

          <footer class="mt-8 text-center animate-waterfall delay-450">
            <p class="font-body text-secondary text-[14px]">
              Already have a space?
              <NuxtLink
                class="text-primary font-medium hover:underline"
                to="/login"
                >Sign In</NuxtLink
              >
            </p>
          </footer>
        </div>
      </div>
    </section>

    <section class="hidden md:flex md:w-1/2 bg-background flex-col justify-center items-center px-16 relative overflow-hidden">
      <!-- Asymmetric Collage Container -->
      <div class="grid grid-cols-2 gap-8 max-w-lg relative z-10 p-4">
        <!-- Polaroid 1 -->
        <div class="animate-waterfall self-start delay-600">
          <div
            class="polaroid sienna-overlay"
            :style="getPolaroidStyle('-4deg', 0.5)"
          >
            <img
              alt="Memory fragment 1"
              class="w-full aspect-3/4 object-cover"
              src="../assets/images/polaroid_1.png"
            />
          </div>
        </div>
        <!-- Polaroid 2 -->
        <div class="animate-waterfall mt-12 delay-700">
          <div
            class="polaroid sienna-overlay"
            :style="getPolaroidStyle('2deg', 1.0)"
          >
            <img
              alt="Memory fragment 2"
              class="w-full aspect-4/3 object-cover"
              src="../assets/images/polaroid_2.png"
            />
          </div>
        </div>
        <!-- Polaroid 3 -->
        <div class="animate-waterfall -mt-6 delay-800">
          <div
            class="polaroid sienna-overlay"
            :style="getPolaroidStyle('-2deg', 1.5)"
          >
            <img
              alt="Memory fragment 3"
              class="w-full aspect-square object-cover"
              src="../assets/images/polaroid_3.png"
            />
          </div>
        </div>
        <div class="animate-waterfall self-end delay-900">
          <div
            class="polaroid sienna-overlay"
            :style="getPolaroidStyle('5deg', 2.0)"
          >
            <img
              alt="Memory fragment 4"
              class="w-full aspect-3/4 object-cover"
              src="../assets/images/polaroid_4.png"
            />
          </div>
        </div>
      </div>

      <div class="mt-16 text-center max-w-sm z-10 animate-waterfall delay-1100">
        <p class="font-poetic italic text-on-surface-variant mb-4 text-xl">
          “We write to taste life twice, in the moment and in retrospect.”
        </p>
        <cite class="font-body tracking-widest text-secondary uppercase not-italic"> — Anaïs Nin </cite>
      </div>

      <!-- Atmospheric Pulse Background Details -->
      <div class="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48"></div>
      <div class="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -ml-48"></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { registerSchema } from '~/schema/register.schema'
import { navigateTo } from '#app'
import { type ApiErrorResponse } from '~/types'
import { useToast } from '~/composables/useToast'
import { useTheme } from '~/composables/useTheme'

// Theme composable
const { isDark, toggleTheme } = useTheme()

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
