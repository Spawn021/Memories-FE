<template>
  <main class="h-screen w-screen flex flex-col md:flex-row bg-background text-on-background font-body selection:bg-primary/30">
    <aside
      class="w-full h-full flex flex-col justify-between p-8 bg-surface border-b md:border-b-0 md:border-r border-border z-10 shrink-0 select-none transition-all duration-300 ease-in-out relative group"
      :class="isSidebarCollapsed ? 'md:w-0 md:p-0 md:border-r-0 md:opacity-0 md:pointer-events-none md:overflow-hidden' : 'md:w-90 z-20'"
    >
      <button
        class="absolute -right-3 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-6 h-12 bg-surface border border-border rounded-full hover:border-primary/30 text-secondary hover:text-primary shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        title="Collapse Sidebar"
        @click="toggleSidebar"
      >
        <span class="material-symbols-outlined text-base!">chevron_left</span>
      </button>

      <div class="space-y-6 shrink-0">
        <div class="reveal-item flex justify-between items-center delay-50">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto cursor-pointer"
            alt="Memories Logo"
            @click="navigateTo(routes.home())"
          />
          <LanguageSwitcher />
        </div>
      </div>

      <div class="my-6 md:my-auto space-y-6 grow flex flex-col justify-center">
        <slot name="sidebar" />
      </div>
      <div class="space-y-8 shrink-0">
        <div
          class="reveal-item p-4 bg-background border border-border rounded-md flex items-center justify-between delay-200 cursor-pointer"
          title="Profile Settings"
          @click="navigateTo(routes.settings())"
        >
          <div class="flex items-center gap-3 overflow-hidden cursor-pointer grow pr-2 hover:opacity-80 transition-opacity">
            <div
              class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm tracking-tighter uppercase shrink-0 shadow-sm group-hover/user:scale-105 transition-transform"
            >
              {{ userInitial }}
            </div>
            <div class="overflow-hidden">
              <p
                class="font-bold text-[13px] leading-tight truncate text-on-surface group-hover/user:text-primary transition-colors flex items-center gap-1"
              >
                {{ authStore.user?.displayName || 'Archive Owner' }}
                <span class="material-symbols-outlined text-xs! opacity-0 group-hover/user:opacity-100 transition-opacity text-primary">
                  settings
                </span>
              </p>
              <p class="text-[11px] text-secondary truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              class="spring-btn p-1.5 transition-colors cursor-pointer"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              @click="
                e => {
                  e.stopPropagation()
                  toggleTheme()
                }
              "
            >
              <span class="material-symbols-outlined text-xl! text-primary!">
                {{ isDark ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>
            <button
              class="spring-btn p-1.5 transition-colors cursor-pointer"
              title="Sign Out"
              @click="handleLogout"
            >
              <span class="material-symbols-outlined text-xl! text-error!">logout</span>
            </button>
          </div>
        </div>

        <!-- Footer Info -->
        <footer class="text-secondary/60 font-body text-[10px] tracking-widest reveal-item delay-250">
          <div class="flex gap-4 justify-center w-full">
            <NuxtLink
              :to="routes.terms()"
              class="font-body text-xs hover:text-primary! underline underline-offset-4 transition-all duration-300"
            >
              {{ t('nav.terms') }}
            </NuxtLink>
            <NuxtLink
              :to="routes.privacy()"
              class="font-body text-xs hover:text-primary! underline underline-offset-4 transition-all duration-300"
            >
              {{ t('nav.privacy') }}
            </NuxtLink>
            <NuxtLink
              :to="routes.about()"
              class="font-body text-xs hover:text-primary! underline underline-offset-4 transition-all duration-300"
            >
              {{ t('nav.archiveEthics') }}
            </NuxtLink>
            <a
              href="mailto:hello@memories.io"
              class="font-body text-xs hover:text-primary! underline underline-offset-4 transition-all duration-300"
            >
              {{ t('nav.contact') }}
            </a>
          </div>
        </footer>
      </div>
    </aside>

    <section
      class="flex-1 h-full overflow-y-auto relative bg-background custom-scroll flex flex-col justify-between transition-all duration-300"
    >
      <!-- Floating Sidebar Toggle (Only visible when sidebar is collapsed on desktop) -->
      <button
        v-if="isSidebarCollapsed"
        class="spring-btn fixed left-3 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-6 h-12 bg-surface/85 hover:bg-surface border border-border rounded-full hover:border-primary/30 text-secondary hover:text-primary shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer animate-fadeIn"
        title="Expand Sidebar"
        @click="toggleSidebar"
      >
        <span class="material-symbols-outlined text-base!">chevron_right</span>
      </button>

      <slot />
    </section>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { useAuth } from '~/features/auth/auth.queries'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()
const routes = useRoutes()
const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  if (process.client) {
    localStorage.setItem('sidebar_collapsed', String(isSidebarCollapsed.value))
  }
}

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved !== null) {
      isSidebarCollapsed.value = saved === 'true'
    }
  }
})

// User initial computed
const userInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'A'
  return name.charAt(0).toUpperCase()
})

const handleLogout = async (e: MouseEvent) => {
  e.stopPropagation()
  const { useLogout } = useAuth()
  const { mutateAsync: logout } = useLogout()
  await logout()
  await navigateTo(routes.login())
}
</script>
