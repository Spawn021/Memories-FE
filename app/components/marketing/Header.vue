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
        <v-menu
          v-model="isOpenUserDropdown"
          :close-on-content-click="false"
          transition="slide-y-transition"
        >
          <template #activator="{ props }">
            <button
              v-bind="props"
              class="spring-btn flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-background border border-transparent hover:border-border transition-colors cursor-pointer select-none"
            >
              <div
                class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm uppercase shadow-sm"
              >
                {{ userInitial }}
              </div>
              <span class="hidden lg:inline text-[13px] font-bold text-on-surface truncate max-w-30">
                {{ authStore.user?.displayName || 'Archive Owner' }}
              </span>
              <span
                class="material-symbols-outlined text-base! text-secondary transition-transform duration-300"
                :class="{ 'rotate-180': isOpenUserDropdown }"
              >
                keyboard_arrow_down
              </span>
            </button>
          </template>

          <div class="w-64 bg-surface border border-border rounded-md shadow-xl py-2 text-left mt-1">
            <div class="px-4 py-2 border-b border-border mb-1.5">
              <p class="font-bold text-[13px] text-on-surface truncate">{{ authStore.user?.displayName || 'Archive Owner' }}</p>
              <p class="text-[11px] text-secondary truncate">{{ authStore.user?.email }}</p>
            </div>

            <!-- Spaces List Sub-panel -->
            <div class="flex justify-between">
              <div class="px-4 py-1.5 text-[10px] uppercase tracking-widest text-secondary/50 font-bold">My Spaces</div>
              <div
                v-if="totalJoinedSpaces > 3"
                class="px-4 py-1.5 hover:text-primary! spring-btn text-xs font-medium text-secondary rounded flex items-center justify-between transition-colors cursor-pointer"
                @click="goToPortal"
              >
                <span class="flex items-center gap-2">
                  <span>View all ({{ totalJoinedSpaces }})</span>
                  <span class="material-symbols-outlined text-sm! -mr-1">arrow_forward</span>
                </span>
              </div>
            </div>
            <div class="px-1">
              <button
                v-for="space in ownedSpaces"
                :key="space.uuid"
                class="w-full text-left px-3 py-1.5 hover:bg-background text-on-surface rounded truncate flex items-center gap-2 transition-colors cursor-pointer"
                @click="enterSpace(space)"
              >
                <span class="material-symbols-outlined text-sm! text-secondary">photo_album</span>
                <span class="text-sm truncate">{{ space.name }}</span>
              </button>

              <p
                v-if="ownedSpaces.length === 0"
                class="text-[11px] text-secondary/40 text-center py-2 italic"
              >
                No spaces owned yet
              </p>
            </div>

            <div class="border-t border-border mt-2 pt-1.5 px-2 space-y-1">
              <button
                class="w-full text-left px-2.5 py-1.5 hover:bg-background hover:text-primary text-[12px]! uppercase tracking-widest text-secondary flex items-center gap-2 rounded transition-colors cursor-pointer"
                @click="openProfileModal"
              >
                <span class="material-symbols-outlined text-base! text-secondary">manage_accounts</span>
                Profile Settings
              </button>
              <button
                class="w-full text-left px-2.5 py-1.5 hover:bg-background hover:text-primary text-[12px]! uppercase tracking-widest text-secondary flex items-center gap-2 rounded transition-colors cursor-pointer"
                @click="goToPortal"
              >
                <span class="material-symbols-outlined text-base! text-secondary">apps</span>
                Sanctuary Portal
              </button>
              <button
                class="w-full text-left px-2.5 py-1.5 hover:bg-background hover:text-primary text-[12px]! uppercase tracking-widest text-error! flex items-center gap-2 rounded transition-colors cursor-pointer"
                @click="handleLogout"
              >
                <span class="material-symbols-outlined text-base!">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </v-menu>
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
import { useAuth } from '~/features/auth/auth.queries'
import { useSpaces } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import type { Space, GetSpacesQuery } from '~/types/space'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()

const { isAuthenticated } = useAuth()
const route = useRoute()
const routes = useRoutes()

const { useList } = useSpaces()
const spacesQuery = ref<GetSpacesQuery>({ limit: 3, role: 'OWNER' })
const { data: spacesData } = useList(spacesQuery)
const ownedSpaces = computed(() => spacesData.value?.items || [])
const totalJoinedSpaces = computed(() => spacesData.value?.meta?.total || 0)

const authStore = useAuthStore()
const isOpenUserDropdown = ref(false)

const userInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'A'
  return name.charAt(0).toUpperCase()
})

const enterSpace = async (space: Space) => {
  isOpenUserDropdown.value = false
  navigateTo(routes.spaceDetail(space.slug))
}

const goToPortal = async () => {
  isOpenUserDropdown.value = false
  navigateTo(routes.spaces())
}

const openProfileModal = () => {
  isOpenUserDropdown.value = false
  navigateTo(routes.settings())
}

const handleLogout = async () => {
  isOpenUserDropdown.value = false
  const { useLogout } = useAuth()
  const { execute: logout } = useLogout()
  await logout()
  navigateTo(routes.login())
}

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
