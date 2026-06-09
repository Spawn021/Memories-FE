<template>
  <main
    class="h-screen w-screen flex flex-col md:flex-row bg-canvas-linen text-obsidian-ink font-body-md selection:bg-sunlit-clementine/30 overflow-hidden"
    @mousemove="onMouseMove"
  >
    <!-- LEFT PANEL (Form) -->
    <section
      class="w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:py-10 md:px-16 bg-pure-surface z-10 overflow-y-auto"
    >
      <!-- Top Branding -->
      <div class="reveal-item" style="animation-delay: 50ms">
        <NuxtLink to="/">
          <img :src="LogoText" alt="Logo" class="h-7 w-auto mb-6" />
        </NuxtLink>
      </div>

      <!-- Form Content -->
      <div class="max-w-md w-full mx-auto my-auto">
        <header class="mb-6">
          <h1
            class="font-headline-lg text-[32px] md:text-[36px] leading-tight mb-2 reveal-item"
            style="animation-delay: 100ms"
          >
            Welcome back
          </h1>
          <p class="text-muted-leaf font-body-md reveal-item" style="animation-delay: 150ms">
            Enter your details to access your intimate spaces.
          </p>
        </header>
        <!-- Verification Success Message Banner -->
        <div
          v-if="verifiedSuccess"
          class="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-md text-[13px] border border-secondary/10 reveal-item flex items-center gap-2"
        >
          <span class="material-symbols-outlined !text-[18px]">check_circle</span>
          <span class="font-medium">Email verified successfully! Please sign in to continue.</span>
        </div>

        <!-- Global Error Message Banner -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-error-container text-error rounded-md text-[14px] border border-error/10 reveal-item"
        >
          {{ error }}
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <BaseInput
            id="email"
            v-model="email"
            label="Email Address"
            type="email"
            placeholder="e.g. hoang.nam@domain.com"
            required
            :error="validationErrors.email"
            class="reveal-item"
            style="animation-delay: 200ms"
          />

          <!-- Password Field -->
          <BaseInput
            id="password"
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            :error="validationErrors.password"
            class="reveal-item"
            style="animation-delay: 250ms"
          >
            <template #label-right>
              <NuxtLink
                to="/forgot-password"
                class="text-[13px] text-muted-leaf hover:text-sunlit-clementine transition-colors underline underline-offset-4"
                >Forgot password?</NuxtLink
              >
            </template>
          </BaseInput>

          <!-- Remember Me -->
          <BaseCheckbox
            id="remember"
            v-model="rememberMe"
            label="Remember this device"
            class="reveal-item"
            style="animation-delay: 300ms"
          />

          <!-- CTA Actions -->
          <div class="space-y-4 pt-2">
            <BaseButton
              type="submit"
              variant="primary"
              full-width
              size="lg"
              :loading="loading"
              class="reveal-item"
              style="animation-delay: 350ms"
            >
              Sign In
            </BaseButton>

            <div class="flex items-center gap-4 py-1.5 reveal-item" style="animation-delay: 400ms">
              <div class="flex-grow h-[1px] bg-obsidian-ink/5"></div>
              <span class="text-[13px] text-muted-leaf/50 font-label-sm italic lowercase">or</span>
              <div class="flex-grow h-[1px] bg-obsidian-ink/5"></div>
            </div>

            <BaseButton
              type="button"
              variant="secondary"
              full-width
              size="lg"
              class="reveal-item"
              style="animation-delay: 450ms"
              @click="handleGoogleLogin"
            >
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              Continue with Google
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Footer Link -->
      <div class="mt-8 reveal-item" style="animation-delay: 500ms">
        <p class="text-muted-leaf font-label-md text-[14px]">
          New here?
          <NuxtLink
            class="text-obsidian-ink font-bold underline underline-offset-4 hover:text-sunlit-clementine transition-colors"
            to="/register"
            >Create your space</NuxtLink
          >
        </p>
      </div>
    </section>

    <!-- RIGHT PANEL (Art Collage) -->
    <section
      ref="artPanel"
      class="hidden md:flex flex-1 h-full bg-canvas-linen relative items-center justify-center overflow-hidden"
    >
      <!-- Scrapbook Style Layout Overlay -->
      <div class="absolute inset-0 collage-tint pointer-events-none z-10"></div>

      <!-- Main Collage Image Container -->
      <div class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-md">
        <div class="reveal-item" style="animation-delay: 600ms">
          <div class="shadow-2xl bg-pure-surface p-5" :style="imageStyle">
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
          <div
            class="bg-pure-surface p-4 shadow-sm border border-whisper-border"
            :style="floatingLabelStyle"
          >
            <div class="italic font-headline-md text-sunlit-clementine text-xl">Lumina</div>
          </div>
        </div>
      </div>

      <!-- Central Quote Overlay -->
      <div
        class="relative z-20 max-w-sm px-8 text-center reveal-item"
        style="animation-delay: 1000ms"
      >
        <blockquote
          class="font-poetic-accent text-[26px] italic leading-relaxed text-obsidian-ink mb-4"
        >
          "We write to taste life twice, in the moment and in retrospect."
        </blockquote>
        <cite
          class="font-label-sm text-[12px] uppercase tracking-[0.4em] text-muted-leaf not-italic block"
        >
          — Anaïs Nin
        </cite>
      </div>

      <!-- Architectural Decoration -->
      <div
        class="absolute bottom-10 right-10 flex gap-10 font-label-sm text-[11px] tracking-widest text-muted-leaf/40 reveal-item"
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
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { navigateTo, useRoute } from '#app'
import { z } from 'zod'
import { LogoText } from '~/assets/icons'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Auth composable hooks
const { login, loginWithGoogle, loading } = useAuth()
const { validationErrors, error, validate, handleApiError } = useForm(loginSchema)
const route = useRoute()

// Local Reactive State
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
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
