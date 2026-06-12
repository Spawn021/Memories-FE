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
        <NuxtLink :to="localePath('/')">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto mb-6"
            alt="Memories Logo"
          />
        </NuxtLink>

        <div class="flex items-center gap-3">
          <LanguageSwitcher class="-mt-6" />
          <button
            class="spring-btn p-2 -mt-6 rounded-full border border-border text-secondary hover:text-primary hover:border-primary/20 bg-surface flex items-center justify-center cursor-pointer select-none"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            type="button"
            @click="toggleTheme"
          >
            <span class="material-symbols-outlined !text-[20px]">
              {{ isDark ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </div>
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
          class="mb-6 p-4 bg-secondary/10 text-secondary rounded-md text-[13px] border border-secondary/10 reveal-item flex items-center gap-2 animate-waterfall"
        >
          <span class="material-symbols-outlined !text-[18px]">check_circle</span>
          <span class="font-medium">Email verified successfully! Please sign in to continue.</span>
        </div>

        <LoginForm />
      </div>

      <!-- Footer Link -->
      <div class="mt-8 reveal-item" style="animation-delay: 500ms">
        <p class="text-secondary font-body text-[14px]">
          New here?
          <NuxtLink
            class="text-on-background font-bold underline underline-offset-4 hover:text-primary transition-colors"
            :to="localePath('/register')"
          >
            Create your space
          </NuxtLink>
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
import { useHead } from '#imports'

useHead({
  title: 'Sign In',
})
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useRoute } from '#app'

const localePath = useLocalePath()
import { useTheme } from '~/composables/useTheme'

// Theme composable
const { isDark, toggleTheme } = useTheme()
const route = useRoute()

// Local Reactive State
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
</script>
