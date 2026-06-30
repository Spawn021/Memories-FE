<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex justify-between items-center transition-all select-none"
  >
    <NuxtLink
      :to="routes.home()"
      class="spring-btn"
    >
      <img
        :src="isDark ? LogoTextDark : LogoTextLight"
        class="h-7 w-auto"
        alt="Memories Logo"
      />
    </NuxtLink>

    <nav
      class="relative hidden md:flex items-center gap-8 text-[12px] uppercase font-body text-sm font-semibold tracking-wider text-secondary/80"
    >
      <NuxtLink
        v-for="(menu, index) in menus"
        :key="menu.path"
        :ref="
          el => {
            if (el) navLinks[index] = el
          }
        "
        :to="menu.path"
        active-class="text-primary scale-110"
        class="hover:text-primary transition-colors spring-btn py-1"
      >
        {{ menu.label }}
      </NuxtLink>

      <!-- Sliding under bar -->
      <div
        class="absolute -bottom-1 h-0.5 bg-primary transition-all duration-300 ease-out rounded-full pointer-events-none"
        :style="sliderStyle"
      ></div>
    </nav>

    <div class="flex items-center gap-4">
      <LanguageSwitcher />
      <button
        class="spring-btn p-2 rounded-full border border-border text-primary hover:border-primary/20 bg-surface flex items-center justify-center cursor-pointer select-none"
        :title="isDark ? t('common.switchLight') : t('common.switchDark')"
        @click="toggleTheme"
      >
        <span class="material-symbols-outlined text-[20px]!">
          {{ isDark ? 'light_mode' : 'dark_mode' }}
        </span>
      </button>

      <template v-if="isAuthenticated">
        <NuxtLink
          :to="routes.dashboard()"
          class="spring-btn bg-primary text-white text-[12px] uppercase font-body text-sm font-semibold tracking-wider px-5 py-2.5 rounded-md shadow-md shadow-primary/10"
        >
          {{ t('nav.dashboard') }}
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          :to="routes.login()"
          class="text-[12px] uppercase font-body text-sm font-semibold tracking-wider text-secondary hover:text-primary transition-colors px-3"
        >
          {{ t('auth.signIn') }}
        </NuxtLink>
        <NuxtLink
          :to="routes.register()"
          class="spring-btn bg-primary text-white text-[12px] uppercase font-body text-sm font-semibold tracking-wider px-5 py-2.5 rounded-md shadow-md shadow-primary/10"
        >
          {{ t('auth.createSpace') }}
        </NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()

const { isAuthenticated } = useAuth()
const routes = useRoutes()

const menus = computed(() => [
  {
    label: t('nav.home'),
    path: routes.home(),
  },
  {
    label: t('nav.stories'),
    path: routes.stories(),
  },
  {
    label: t('nav.curation'),
    path: routes.curation(),
  },
  {
    label: t('nav.about'),
    path: routes.about(),
  },
  {
    label: t('nav.terms'),
    path: routes.terms(),
  },
  {
    label: t('nav.privacy'),
    path: routes.privacy(),
  },
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navLinks = ref<any[]>([])
const sliderStyle = ref({ left: '0px', width: '0px', opacity: 0 })
const route = useRoute()
const updateSlider = () => {
  const homePath = routes.home()
  const activeIndex = menus.value.findIndex(m => {
    if (m.path === homePath) return route.path === homePath || route.path === `${homePath}/`
    return route.path.startsWith(m.path)
  })

  if (activeIndex !== -1 && navLinks.value[activeIndex]) {
    const el = navLinks.value[activeIndex]?.$el || navLinks.value[activeIndex]
    if (el) {
      sliderStyle.value = {
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
        opacity: 1,
      }
    }
  } else {
    sliderStyle.value.opacity = 0
  }
}

watch(
  () => route.path,
  () => {
    nextTick(() => {
      updateSlider()
    })
  },
  { immediate: true },
)

onMounted(() => {
  setTimeout(updateSlider, 100)
  window.addEventListener('resize', updateSlider)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlider)
})
</script>
