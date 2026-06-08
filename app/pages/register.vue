<template>
  <main class="h-screen w-screen flex" @mousemove="onMouseMove">
    <section class="w-full md:w-1/2 flex flex-col justify-between px-8 md:px-16 py-8">
      <div class="reveal-item" style="animation-delay: 50ms">
        <NuxtLink to="/">
          <img :src="LogoText" alt="Logo" class="h-7 w-auto mb-6" />
        </NuxtLink>
      </div>

      <div class="max-w-form-max-width w-full mx-auto my-auto">
        <div v-if="registrationSuccess" class="animate-waterfall text-center py-6">
          <div
            class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-container text-secondary mb-4"
          >
            <span class="material-symbols-outlined text-2xl">mail</span>
          </div>
          <h2 class="font-headline-md text-xl mb-3">Space Reserved!</h2>
          <p class="text-muted-leaf mb-6 font-body-md text-[15px] leading-relaxed">
            We have sent a verification code to
            <strong class="text-obsidian-ink">{{ email }}</strong
            >.<br />
            Please check your inbox to activate your space.
          </p>
          <NuxtLink
            to="/login"
            class="inline-block px-6 py-2.5 bg-sunlit-clementine text-pure-surface font-semibold rounded-md spring-hover spring-active uppercase tracking-wider text-[12px]"
          >
            Go to Sign In
          </NuxtLink>
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

          <form class="space-y-3" @submit.prevent="handleRegister">
            <!-- Email Field -->
            <BaseInput
              id="email"
              v-model="email"
              label="EMAIL ADDRESS"
              type="email"
              placeholder="e.g. hoang.nam@domain.com"
              required
              :error="validationErrors.email"
              class="animate-waterfall"
              style="animation-delay: 100ms"
            />

            <!-- Password Field -->
            <BaseInput
              id="password"
              v-model="password"
              label="PASSWORD"
              type="password"
              placeholder="••••••••"
              required
              :error="validationErrors.password"
              class="animate-waterfall"
              style="animation-delay: 150ms"
            />

            <!-- Confirm Password Field -->
            <BaseInput
              id="confirmPassword"
              v-model="confirmPassword"
              label="CONFIRM PASSWORD"
              type="password"
              placeholder="••••••••"
              required
              :error="validationErrors.confirmPassword"
              class="animate-waterfall"
              style="animation-delay: 200ms"
            />

            <!-- Terms Checkbox -->
            <BaseCheckbox
              id="terms"
              v-model="terms"
              required
              class="animate-waterfall pt-1"
              style="animation-delay: 250ms"
            >
              I agree to the
              <NuxtLink class="text-primary hover:underline" to="/terms">Terms</NuxtLink> &amp;
              <NuxtLink class="text-primary hover:underline" to="/privacy">Privacy Policy</NuxtLink>
            </BaseCheckbox>

            <!-- CTA Actions -->
            <div class="space-y-3 pt-3 animate-waterfall" style="animation-delay: 400ms">
              <BaseButton type="submit" variant="primary" full-width size="lg" :loading="loading">
                Create Space
              </BaseButton>

              <div class="relative flex items-center py-1">
                <div class="grow border-t border-whisper-border"></div>
                <span class="shrink mx-3 text-surface-dim font-label-sm text-[11px]">OR</span>
                <div class="grow border-t border-whisper-border"></div>
              </div>

              <BaseButton
                type="button"
                variant="secondary"
                full-width
                size="lg"
                @click="handleGoogleLogin"
              >
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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

      <!-- Footer Link Info -->
      <div class="mt-4 text-center md:text-left reveal-item" style="animation-delay: 500ms">
        <span class="text-[11px] tracking-wider text-muted-leaf/40"
          >MEMORIES // SECURITY VALIDATED</span
        >
      </div>
    </section>

    <!-- Right Panel: Nostalgia Art Panel (Desktop Only) -->
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
              src="/images/polaroid_1.png"
            />
          </div>
        </div>
        <!-- Polaroid 2 -->
        <div class="animate-waterfall mt-12" style="animation-delay: 700ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('2deg', 1.0)">
            <img
              alt="Memory fragment 2"
              class="w-full aspect-4/3 object-cover"
              src="/images/polaroid_2.png"
            />
          </div>
        </div>
        <!-- Polaroid 3 -->
        <div class="animate-waterfall -mt-6" style="animation-delay: 800ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('-2deg', 1.5)">
            <img
              alt="Memory fragment 3"
              class="w-full aspect-square object-cover"
              src="/images/polaroid_3.png"
            />
          </div>
        </div>
        <div class="animate-waterfall self-end" style="animation-delay: 900ms">
          <div class="polaroid sienna-overlay" :style="getPolaroidStyle('5deg', 2.0)">
            <img
              alt="Memory fragment 4"
              class="w-full aspect-3/4 object-cover"
              src="/images/polaroid_4.png"
            />
          </div>
        </div>
      </div>

      <!-- Quote Container -->
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
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { LogoText } from '~/assets/icons'
import { registerSchema } from '~/schema/register.schema'

const { register, loginWithGoogle, loading } = useAuth()
const { validationErrors, error, validate, handleApiError } = useForm(registerSchema)

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const terms = ref(false)
const registrationSuccess = ref(false)

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
    await register(email.value, password.value)
    registrationSuccess.value = true
  } catch (err) {
    console.log(err, '1')
    handleApiError(err)
  }
}

const handleGoogleLogin = () => {
  loginWithGoogle()
}
</script>
