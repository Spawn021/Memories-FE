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
        <OtpForm
          v-if="registrationSuccess"
          :email="registeredEmail"
        />
        <RegisterForm
          v-else
          @success="onRegisterSuccess"
        />
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
import { ref, onMounted } from 'vue'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useTheme } from '~/composables/useTheme'
import RegisterForm from '~/components/auth/RegisterForm.vue'
import OtpForm from '~/components/auth/OtpForm.vue'

const { isDark, toggleTheme } = useTheme()

// State
const registrationSuccess = ref(false)
const registeredEmail = ref('')

// Registration Success Handler
const onRegisterSuccess = (data: { email: string; password?: string }) => {
  registeredEmail.value = data.email
  registrationSuccess.value = true
}

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
  const rotationVar = { '--rotation': baseRotation } as Record<string, string | number>
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
</script>
