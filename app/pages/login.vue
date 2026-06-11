<template>
  <main
    class="h-screen w-screen flex flex-col md:flex-row bg-background text-on-background font-body selection:bg-primary/30 overflow-hidden"
    @mousemove="onMouseMove"
  >
    <!-- LEFT PANEL (Form) -->
    <section
      class="w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:py-10 md:px-16 bg-surface z-10 overflow-y-auto"
    >
      <!-- Top Branding -->
      <div class="reveal-item flex justify-between items-center" style="animation-delay: 50ms">
        <NuxtLink to="/">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto mb-6"
            alt="Memories Logo"
          />
        </NuxtLink>

        <button
          class="spring-btn p-2 -mt-6 rounded-full border border-border text-secondary hover:text-primary hover:border-primary/20 bg-surface flex items-center justify-center cursor-pointer select-none"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="toggleTheme"
          type="button"
        >
          <span class="material-symbols-outlined !text-[20px]">
            {{ isDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>
      </div>

      <!-- Form Content -->
      <div class="max-w-md w-full mx-auto my-auto">
        <header class="mb-6">
          <h1
            class="font-title text-[32px] md:text-[36px] leading-tight mb-2 reveal-item"
            style="animation-delay: 100ms"
          >
            Welcome back
          </h1>
          <p class="text-secondary font-body reveal-item" style="animation-delay: 150ms">
            Enter your details to access your intimate spaces.
          </p>
        </header>
        <!-- Verification Success Message Banner -->
        <div
          v-if="verifiedSuccess"
          class="mb-6 p-4 bg-secondary/10 text-secondary rounded-md text-[13px] border border-secondary/10 reveal-item flex items-center gap-2"
        >
          <span class="material-symbols-outlined !text-[18px]">check_circle</span>
          <span class="font-medium">Email verified successfully! Please sign in to continue.</span>
        </div>

        <!-- Global Error Message Banner -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-danger-container text-on-danger-container rounded-md text-[14px] border border-border reveal-item"
        >
          {{ error }}
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div class="space-y-1.5 reveal-item" style="animation-delay: 200ms">
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary"
              >EMAIL ADDRESS</label
            >
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
          <div class="space-y-1.5 reveal-item" style="animation-delay: 250ms">
            <div class="flex justify-between items-end">
              <label
                class="block font-body text-[12px] uppercase tracking-widest text-secondary"
                >PASSWORD</label
              >
              <NuxtLink
                to="/forgot-password"
                class="text-[13px] text-secondary hover:text-primary transition-colors underline underline-offset-4"
                >Forgot password?</NuxtLink
              >
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
              :rules="['required', 'min:8']"
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
              class="reveal-item spring-btn font-body tracking-wider uppercase"
              style="
                animation-delay: 350ms;
                font-weight: 600;
                border-radius: var(--radius-lg);
                height: 50px;
              "
            >
              Sign In
            </v-btn>

            <div class="flex items-center gap-4 py-1.5 reveal-item" style="animation-delay: 400ms">
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
              style="
                animation-delay: 450ms;
                font-weight: 600;
                border-radius: var(--radius-lg);
                height: 50px;
              "
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
      </div>

      <!-- Footer Link -->
      <div class="mt-8 reveal-item" style="animation-delay: 500ms">
        <p class="text-secondary font-body text-[14px]">
          New here?
          <NuxtLink
            class="text-on-background font-bold underline underline-offset-4 hover:text-primary transition-colors"
            to="/register"
            >Create your space</NuxtLink
          >
        </p>
      </div>
    </section>

    <!-- RIGHT PANEL (Art Collage) -->
    <section
      ref="artPanel"
      class="hidden md:flex flex-1 h-full bg-background relative items-center justify-center overflow-hidden"
    >
      <!-- Scrapbook Style Layout Overlay -->
      <div class="absolute inset-0 collage-tint pointer-events-none z-10"></div>

      <!-- Main Collage Image Container -->
      <div class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-md">
        <div class="reveal-item" style="animation-delay: 600ms">
          <div class="shadow-2xl bg-surface p-5" :style="imageStyle">
            <div class="aspect-[3/4] overflow-hidden grayscale-[20%] sepia-[10%]">
              <img
                alt="Atmospheric Gallery Collage"
                class="w-full h-full object-cover"
                src="../assets/images/collage_login.png"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Label Element -->
      <div class="absolute bottom-[20%] right-[15%] z-20">
        <div class="reveal-item" style="animation-delay: 800ms">
          <div class="bg-surface p-4 shadow-sm border border-border" :style="floatingLabelStyle">
            <div class="italic font-title text-primary text-xl">Lumina</div>
          </div>
        </div>
      </div>

      <!-- Central Quote Overlay -->
      <div
        class="relative z-20 max-w-sm px-8 text-center reveal-item"
        style="animation-delay: 1000ms"
      >
        <blockquote
          class="font-poetic text-[26px] italic leading-relaxed text-on-background mb-4"
        >
          "We write to taste life twice, in the moment and in retrospect."
        </blockquote>
        <cite
          class="font-body text-[12px] uppercase tracking-[0.4em] text-secondary not-italic block"
        >
          — Anaïs Nin
        </cite>
      </div>

      <!-- Architectural Decoration -->
      <div
        class="absolute bottom-10 right-10 flex gap-10 font-body text-[11px] tracking-widest text-secondary/40 reveal-item"
        style="animation-delay: 1200ms"
      >
        <span>01 // ARCHIVE</span>
        <span>VOL. 2024</span>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { navigateTo, useRoute } from '#app'
import { z } from 'zod'
import { useTheme } from '~/composables/useTheme'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Theme composable
const { isDark, toggleTheme } = useTheme()

// Auth composable hooks
const { login, loginWithGoogle, loading } = useAuth()
const { validationErrors, error, validate, handleApiError } = useForm(loginSchema)
const route = useRoute()

// Local Reactive State
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const verifiedSuccess = computed(() => route.query.verified === 'true')

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

// Dynamic Parallax Styles
const imageStyle = computed(() => {
  if (!isAnimated.value) {
    return {
      transform: 'rotate(-2deg)',
    }
  }
  const x = moveX.value * 1.5
  const y = moveY.value * 1.5
  return {
    transform: `translate(${x}px, ${y}px) rotate(-2deg)`,
    transition: 'transform 0.15s ease-out',
  }
})

const floatingLabelStyle = computed(() => {
  if (!isAnimated.value) {
    return {
      transform: 'rotate(6deg)',
    }
  }
  const x = moveX.value * 3.0
  const y = moveY.value * 3.0
  return {
    transform: `translate(${x}px, ${y}px) rotate(6deg)`,
    transition: 'transform 0.15s ease-out',
  }
})

// Submission Handler
const handleLogin = async () => {
  const isValid = validate({
    email: email.value,
    password: password.value,
  })

  if (!isValid) return

  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (err: any) {
    handleApiError(err)
  }
}

const handleGoogleLogin = () => {
  loginWithGoogle()
}
</script>
