<template>
  <main class="min-h-screen bg-canvas-linen text-obsidian-ink font-body-md selection:bg-sunlit-clementine/30 overflow-x-hidden relative" @mousemove="onMouseMove">
    
    <!-- STICKY HEADER -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-canvas-linen/80 backdrop-blur-md border-b border-whisper-border px-6 py-4 flex justify-between items-center transition-all select-none">
      <NuxtLink to="/" class="spring-btn">
        <svg class="h-6 w-auto" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0, 2)">
            <rect x="2" y="2" width="32" height="32" rx="4" fill="#FFFFFF" stroke="#181A1A" stroke-width="2"/>
            <line x1="2" y1="26" x2="34" y2="26" stroke="#181A1A" stroke-width="1.5"/>
            <circle cx="18" cy="14" r="5" fill="#E26A4A"/>
            <path d="M6 26L13 16L18 21L24 13L30 26H6Z" fill="#181A1A" opacity="0.95"/>
            <path d="M12 26L18 18L23 23L27 18L30 26H12Z" fill="#5C6E60" opacity="0.8"/>
          </g>
          <text x="44" y="26" fill="#181A1A" font-family="Outfit, sans-serif" font-size="20" font-weight="700" letter-spacing="-0.03em">memories</text>
        </svg>
      </NuxtLink>

      <!-- Center Nav Links -->
      <nav class="hidden md:flex items-center gap-8 text-[12px] uppercase font-label-md tracking-widest text-muted-leaf/80">
        <a href="#philosophy" class="hover:text-sunlit-clementine transition-colors">Philosophy</a>
        <a href="#features" class="hover:text-sunlit-clementine transition-colors">Features</a>
        <NuxtLink to="/terms" class="hover:text-sunlit-clementine transition-colors">Terms</NuxtLink>
        <NuxtLink to="/privacy" class="hover:text-sunlit-clementine transition-colors">Privacy</NuxtLink>
      </nav>

      <!-- Right CTAs -->
      <div class="flex items-center gap-4">
        <template v-if="isAuthenticated">
          <NuxtLink 
            to="/dashboard"
            class="spring-btn bg-sunlit-clementine text-pure-surface text-[12px] uppercase font-label-md font-semibold tracking-wider px-5 py-2.5 rounded-md shadow-md shadow-sunlit-clementine/10"
          >
            Dashboard
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink 
            to="/login"
            class="text-[12px] uppercase font-label-md font-semibold tracking-wider text-muted-leaf hover:text-sunlit-clementine transition-colors px-3"
          >
            Sign In
          </NuxtLink>
          <NuxtLink 
            to="/register"
            class="spring-btn bg-sunlit-clementine text-pure-surface text-[12px] uppercase font-label-md font-semibold tracking-wider px-5 py-2.5 rounded-md shadow-md shadow-sunlit-clementine/10"
          >
            Create Space
          </NuxtLink>
        </template>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="min-h-screen relative flex flex-col justify-center items-center py-32 px-6 md:px-12 overflow-hidden select-none">
      
      <!-- Ambient Lights background -->
      <div class="absolute top-1/3 left-1/4 w-80 h-80 bg-sunlit-clementine/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-muted-leaf/5 rounded-full blur-[120px] pointer-events-none"></div>

      <!-- Floating Polaroid 1 (Top Right) -->
      <div 
        class="hidden md:block absolute top-[22%] right-[15%] w-48 bg-pure-surface p-3 shadow-lg border border-whisper-border transition-transform duration-300 pointer-events-none z-10"
        :style="polaroid1Style"
      >
        <div class="aspect-[4/3] bg-canvas-linen overflow-hidden">
          <img src="/images/polaroid_2.png" class="w-full h-full object-cover grayscale-[10%]" />
        </div>
        <p class="font-poetic-accent text-lg italic text-center text-obsidian-ink pt-3 pb-1">Traces of Summer</p>
      </div>

      <!-- Floating Polaroid 2 (Bottom Left) -->
      <div 
        class="hidden md:block absolute bottom-[20%] left-[12%] w-52 bg-pure-surface p-3.5 shadow-xl border border-whisper-border transition-transform duration-300 pointer-events-none z-10"
        :style="polaroid2Style"
      >
        <div class="aspect-[4/3] bg-canvas-linen overflow-hidden">
          <img src="/images/polaroid_1.png" class="w-full h-full object-cover grayscale-[10%]" />
        </div>
        <p class="font-poetic-accent text-lg italic text-center text-obsidian-ink pt-3 pb-1">Quiet Afternoons</p>
      </div>

      <!-- Floating Polaroid 3 (Bottom Right) -->
      <div 
        class="hidden md:block absolute bottom-[18%] right-[10%] w-44 bg-pure-surface p-3 shadow-md border border-whisper-border transition-transform duration-300 pointer-events-none z-10"
        :style="polaroid3Style"
      >
        <div class="aspect-[4/3] bg-canvas-linen overflow-hidden">
          <img src="/images/polaroid_4.png" class="w-full h-full object-cover grayscale-[10%]" />
        </div>
        <p class="font-poetic-accent text-md italic text-center text-obsidian-ink pt-2 pb-0.5">Fragments of Light</p>
      </div>

      <!-- Main Typographic Hero Header -->
      <div class="relative text-center max-w-4xl z-20 space-y-6">
        <div class="reveal-item" style="animation-delay: 100ms;">
          <span class="font-label-sm text-[11px] uppercase tracking-[0.4em] text-muted-leaf">Introducing Memories</span>
        </div>
        
        <h1 class="font-poetic-accent text-[80px] sm:text-[120px] md:text-[160px] leading-none italic font-normal tracking-tighter text-obsidian-ink select-none reveal-item" style="animation-delay: 200ms;">
          memories
        </h1>
        
        <p class="font-body-lg text-lg md:text-xl text-muted-leaf max-w-lg mx-auto leading-relaxed reveal-item" style="animation-delay: 300ms;">
          An intimate, completely private digital vault for your journals, photographs, and personal reflections. Free from feeds and noise.
        </p>

        <div class="pt-6 reveal-item" style="animation-delay: 400ms;">
          <NuxtLink 
            :to="isAuthenticated ? '/dashboard' : '/register'"
            class="spring-btn inline-block bg-sunlit-clementine text-pure-surface font-label-md text-[13px] uppercase tracking-[0.2em] font-semibold py-4 px-10 rounded-md shadow-lg shadow-sunlit-clementine/10 cursor-pointer"
          >
            {{ isAuthenticated ? 'Go to Dashboard' : 'Open Your Vault' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-leaf/40 font-label-sm text-[10px] tracking-widest reveal-item animate-pulse" style="animation-delay: 600ms;">
        <span>SCROLL TO REFLECT</span>
        <span class="material-symbols-outlined !text-[16px]">arrow_downward</span>
      </div>

    </section>

    <!-- PHILOSOPHY SECTION -->
    <section id="philosophy" class="bg-pure-surface py-28 px-6 border-t border-b border-whisper-border scroll-mt-20">
      <div class="max-w-3xl mx-auto text-center space-y-12">
        <div class="space-y-4">
          <span class="font-label-sm text-[11px] uppercase tracking-[0.4em] text-sunlit-clementine">Our Philosophy</span>
          <h2 class="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-obsidian-ink">
            A quiet sanctuary for your thoughts
          </h2>
        </div>

        <blockquote class="font-poetic-accent text-3xl md:text-4xl italic leading-relaxed text-obsidian-ink/90 max-w-2xl mx-auto py-4">
          "We write to taste life twice, in the moment and in retrospect."
        </blockquote>
        <cite class="font-label-sm text-[11px] uppercase tracking-widest text-muted-leaf not-italic block -mt-6">
          — Anaïs Nin
        </cite>

        <p class="font-body-lg text-[16px] md:text-lg text-muted-leaf leading-relaxed max-w-xl mx-auto">
          Social networks demand your attention, monetize your attention, and broadcast your life. Memories is built on a different logic: **silence, reflection, and ownership**. Your archive belongs solely to you—secure, local, and completely unmonitored.
        </p>
      </div>
    </section>

    <!-- FEATURES BENTO (Asymmetrical) -->
    <section id="features" class="py-28 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div class="text-center mb-16 space-y-4">
        <span class="font-label-sm text-[11px] uppercase tracking-[0.4em] text-muted-leaf">Core Features</span>
        <h2 class="font-headline-lg text-3xl md:text-4xl font-bold text-obsidian-ink">Designed for reflection</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <!-- Feature 1: Privacy (Wide) -->
        <div class="col-span-1 md:col-span-8 bg-pure-surface p-8 md:p-10 border border-whisper-border shadow-sm flex flex-col justify-between space-y-8 hover:shadow-md transition-shadow">
          <div class="space-y-4">
            <span class="material-symbols-outlined !text-[36px] text-sunlit-clementine">shield_lock</span>
            <h3 class="font-headline-lg text-2xl font-bold text-obsidian-ink">Absolute Security Vault</h3>
            <p class="font-body-md text-[14px] text-muted-leaf leading-relaxed">
              We employ strict encryption protocols and database isolation methods on our NestJS backend. Your credentials are fully secure and your personal archive remains accessible only from authenticated sessions.
            </p>
          </div>
          <div class="text-[11px] font-label-sm text-muted-leaf/40 tracking-wider">
            END-TO-END JWT AUTHENTICATION // HASHPASS
          </div>
        </div>

        <!-- Feature 2: Physical Layout (Tall) -->
        <div class="col-span-1 md:col-span-4 bg-pure-surface p-8 border border-whisper-border shadow-sm flex flex-col justify-between space-y-8 hover:shadow-md transition-shadow">
          <div class="space-y-4">
            <span class="material-symbols-outlined !text-[36px] text-sunlit-clementine">photo_album</span>
            <h3 class="font-headline-lg text-xl font-bold text-obsidian-ink">Scrapbook Aesthetic</h3>
            <p class="font-body-md text-[13px] text-muted-leaf leading-relaxed">
              A dashboard styled like a physical photo album. Tilted polaroid frames, elegant serif typography, linen-like colors, and subtle micro-motions mimic the texture of paper and ink.
            </p>
          </div>
          <div class="text-[11px] font-label-sm text-muted-leaf/40 tracking-wider">
            POLAROID LAYOUTS // ROTATION OFFSETS
          </div>
        </div>

        <!-- Feature 3: Performance (Tall) -->
        <div class="col-span-1 md:col-span-4 bg-pure-surface p-8 border border-whisper-border shadow-sm flex flex-col justify-between space-y-8 hover:shadow-md transition-shadow">
          <div class="space-y-4">
            <span class="material-symbols-outlined !text-[36px] text-sunlit-clementine">history_toggle_off</span>
            <h3 class="font-headline-lg text-xl font-bold text-obsidian-ink">Zero Noise Filters</h3>
            <p class="font-body-md text-[13px] text-muted-leaf leading-relaxed">
              No notifications, no comment sections, and no metrics. Filter your archive by text search or tags. Look back at quiet afternoons, summer days, or specific dates with total clarity.
            </p>
          </div>
          <div class="text-[11px] font-label-sm text-muted-leaf/40 tracking-wider">
            FILTER BY #JOURNAL, #MOMENTS, #LIGHT
          </div>
        </div>

        <!-- Feature 4: Custom additions (Wide) -->
        <div class="col-span-1 md:col-span-8 bg-pure-surface p-8 md:p-10 border border-whisper-border shadow-sm flex flex-col justify-between space-y-8 hover:shadow-md transition-shadow">
          <div class="space-y-4">
            <span class="material-symbols-outlined !text-[36px] text-sunlit-clementine">add_to_photos</span>
            <h3 class="font-headline-lg text-2xl font-bold text-obsidian-ink">Capture Instantly</h3>
            <p class="font-body-md text-[14px] text-muted-leaf leading-relaxed">
              Add new records, thoughts, or snapshots in seconds. The custom creation workflow uses responsive input elements and renders added polaroids instantly in your scrapbook with gorgeous spring entrance states.
            </p>
          </div>
          <div class="text-[11px] font-label-sm text-muted-leaf/40 tracking-wider">
            RESPONSIVE MODALS // DYNAMIC REACTIVE ARRAY
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION (CTA) -->
    <section class="bg-pure-surface py-28 px-6 text-center border-t border-whisper-border relative overflow-hidden select-none">
      
      <!-- Small background elements -->
      <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sunlit-clementine/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-2xl mx-auto space-y-8 relative z-10">
        <span class="font-label-sm text-[11px] uppercase tracking-[0.4em] text-sunlit-clementine">Start Your Gallery</span>
        <h2 class="font-poetic-accent text-5xl md:text-6xl italic text-obsidian-ink font-normal leading-tight">
          Begin your personal history today.
        </h2>
        <p class="font-body-md text-[15px] text-muted-leaf max-w-sm mx-auto leading-relaxed">
          Create your space in less than a minute. Your memories are waiting to be preserved.
        </p>
        <div class="pt-4">
          <NuxtLink 
            :to="isAuthenticated ? '/dashboard' : '/register'"
            class="spring-btn inline-block bg-sunlit-clementine text-pure-surface font-label-md text-[13px] uppercase tracking-[0.2em] font-semibold py-4 px-10 rounded-md shadow-lg shadow-sunlit-clementine/10 cursor-pointer"
          >
            {{ isAuthenticated ? 'Go to Dashboard' : 'Create Space Vault' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-canvas-linen border-t border-whisper-border py-12 px-8 text-center md:text-left">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-3">
          <svg class="h-6 w-auto" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 2)">
              <rect x="2" y="2" width="32" height="32" rx="4" fill="#FFFFFF" stroke="#181A1A" stroke-width="2"/>
              <line x1="2" y1="26" x2="34" y2="26" stroke="#181A1A" stroke-width="1.5"/>
              <circle cx="18" cy="14" r="5" fill="#E26A4A"/>
              <path d="M6 26L13 16L18 21L24 13L30 26H6Z" fill="#181A1A" opacity="0.95"/>
              <path d="M12 26L18 18L23 23L27 18L30 26H12Z" fill="#5C6E60" opacity="0.8"/>
            </g>
            <text x="44" y="26" fill="#181A1A" font-family="Outfit, sans-serif" font-size="20" font-weight="700" letter-spacing="-0.03em">memories</text>
          </svg>
        </div>
        
        <div class="flex flex-wrap justify-center gap-6 text-[12px] font-label-md tracking-wider text-muted-leaf/60">
          <NuxtLink to="/terms" class="hover:text-sunlit-clementine transition-colors">Terms of Service</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-sunlit-clementine transition-colors">Privacy Policy</NuxtLink>
          <span>© 2026 MEMORIES ARCHIVE</span>
        </div>
      </div>
    </footer>

  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useHead } from '#imports'

// Setup SEO headers
useHead({
  title: 'memories — your intimate digital archive',
  meta: [
    { name: 'description', content: 'A secure, beautiful, completely private vault for your memories, journals, and reflections. Zero noise, zero algorithms.' }
  ]
})

const { isAuthenticated } = useAuth()

// Interactive mouse parallax state
const moveX = ref(0)
const moveY = ref(0)

const onMouseMove = (e: MouseEvent) => {
  if (process.client && window.innerWidth >= 768) {
    moveX.value = (e.clientX - window.innerWidth / 2) * 0.015
    moveY.value = (e.clientY - window.innerHeight / 2) * 0.015
  }
}

// Compute dynamic CSS transforms for parallax effect
const polaroid1Style = computed(() => {
  const x = moveX.value * 1.2
  const y = moveY.value * 1.2
  return {
    transform: `translate(${x}px, ${y}px) rotate(3deg)`
  }
})

const polaroid2Style = computed(() => {
  const x = moveX.value * -1.5
  const y = moveY.value * -1.5
  return {
    transform: `translate(${x}px, ${y}px) rotate(-4deg)`
  }
})

const polaroid3Style = computed(() => {
  const x = moveX.value * -0.8
  const y = moveY.value * 0.8
  return {
    transform: `translate(${x}px, ${y}px) rotate(1deg)`
  }
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
