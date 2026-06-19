<template>
  <main
    class="h-screen w-screen flex bg-background text-on-background font-body selection:bg-primary/30 overflow-hidden"
    @mousemove="onMouseMove"
  >
    <section class="w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:py-10 md:px-16 bg-surface z-10 overflow-y-auto">
      <div
        class="reveal-item flex justify-between items-center"
        style="animation-delay: 50ms"
      >
        <NuxtLink :to="routes.home()">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto mb-6"
            alt="Memories Logo"
          />
        </NuxtLink>

        <div class="flex items-center gap-3">
          <LanguageSwitcher class="-mt-6" />
          <button
            class="spring-btn p-2 -mt-6 rounded-full border border-border-strong text-primary hover:text-primary hover:border-primary/20 bg-surface flex items-center justify-center cursor-pointer select-none"
            :title="isDark ? t('common.switchLight') : t('common.switchDark')"
            type="button"
            @click="toggleTheme"
          >
            <span class="material-symbols-outlined text-[20px]!">
              {{ isDark ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </div>
      </div>

      <div class="grow flex items-center justify-center">
        <slot />
      </div>
      <div class="h-8"></div>
    </section>

    <section class="hidden md:flex md:w-1/2 bg-background flex-col justify-center items-center px-16 relative overflow-hidden">
      <div class="absolute inset-0 collage-tint pointer-events-none z-10"></div>
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

      <div class="mt-16 text-center max-w-sm z-10 poetic-ink-reveal delay-1100">
        <p class="font-poetic italic text-on-surface-variant mb-4 text-xl">
          {{ t('auth.quote') }}
        </p>
        <cite class="font-body tracking-widest text-secondary uppercase not-italic"> {{ t('auth.quoteAuthor') }} </cite>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useTheme } from '~/composables/useTheme'
import { useRoute } from '#app'

const routes = useRoutes()
const { isDark, toggleTheme } = useTheme()
const route = useRoute()
const { t } = useI18n()

const visualType = computed(() => {
  return route.meta.authVisual || (route.name?.toString().includes('register') ? 'register' : 'login')
})

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
