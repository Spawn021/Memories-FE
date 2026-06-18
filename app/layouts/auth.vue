<template>
  <main
    class="h-screen w-screen flex bg-background text-on-background font-body selection:bg-primary/30 overflow-hidden"
    @mousemove="onMouseMove"
  >
    <!-- LEFT PANEL (Forms & Auth Header/Footer) -->
    <section class="w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:py-10 md:px-16 bg-surface z-10 overflow-y-auto">
      <!-- Top Branding & Navigation -->
      <div
        class="reveal-item flex justify-between items-center"
        style="animation-delay: 50ms"
      >
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

      <!-- Main Slot for the Form -->
      <div class="flex-grow flex items-center justify-center">
        <slot />
      </div>

      <!-- Empty spacer or placeholder for footer consistency -->
      <div class="h-8"></div>
    </section>

    <!-- RIGHT PANEL (Atmospheric visual collage & quotes) -->
    <section class="hidden md:flex md:w-1/2 bg-background flex-col justify-center items-center px-16 relative overflow-hidden">
      <!-- Scrapbook Style Layout Overlay -->
      <div class="absolute inset-0 collage-tint pointer-events-none z-10"></div>

      <!-- Render corresponding visual component based on route metadata -->
      <AuthLoginVisual
        v-if="visualType === 'login'"
        :move-x="moveX"
        :move-y="moveY"
        :is-animated="isAnimated"
      />
      <AuthRegisterVisual
        v-else-if="visualType === 'register'"
        :move-x="moveX"
        :move-y="moveY"
        :is-animated="isAnimated"
      />

      <!-- Central Quote Overlay -->
      <div class="mt-16 text-center max-w-sm z-10 poetic-ink-reveal delay-1100">
        <p class="font-poetic italic text-on-surface-variant mb-4 text-xl">
          “We write to taste life twice, in the moment and in retrospect.”
        </p>
        <cite class="font-body tracking-widest text-secondary uppercase not-italic"> — Anaïs Nin </cite>
      </div>

      <!-- Atmospheric Pulse Background Details -->
      <div class="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48"></div>
      <div class="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -ml-48"></div>

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
import { ref, onMounted, computed } from 'vue'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useTheme } from '~/composables/useTheme'
import { useRoute } from '#app'

const localePath = useLocalePath()
const { isDark, toggleTheme } = useTheme()
const route = useRoute()

// Resolve visual type based on page meta or route name fallback
const visualType = computed(() => {
  return route.meta.authVisual || (route.name?.toString().includes('register') ? 'register' : 'login')
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
</script>
