<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Top Bar -->
    <header
      class="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4"
    >
      <button
        class="spring-btn flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer"
        @click="navigateTo(routes.home())"
      >
        <span class="material-symbols-outlined text-base!">arrow_back</span>
        <span class="text-[12px] uppercase tracking-widest font-semibold">Back</span>
      </button>

      <div class="h-4 w-px bg-border" />

      <h1 class="font-title text-base font-bold text-on-surface">Account Settings</h1>
    </header>

    <div class="flex pt-[65px] min-h-screen">
      <!-- Sidebar -->
      <aside
        class="w-60 shrink-0 border-r border-border bg-surface min-h-screen px-3 py-6 sticky top-[65px] self-start h-[calc(100vh-65px)] overflow-y-auto"
      >
        <nav class="space-y-1">
          <p class="px-3 mb-3 text-[10px] uppercase tracking-widest text-secondary/50 font-bold">Account</p>

          <NuxtLink
            v-for="item in sidebarItems"
            :key="item.tab"
            :to="{ query: { tab: item.tab } }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-secondary hover:bg-background hover:text-on-surface transition-colors cursor-pointer"
            :class="{ 'bg-background text-primary font-semibold': activeTab === item.tab }"
          >
            <span class="material-symbols-outlined text-base!">{{ item.icon }}</span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="border-t border-border mt-4 pt-4 space-y-1">
          <p class="px-3 mb-3 text-[10px] uppercase tracking-widest text-secondary/50 font-bold">Danger Zone</p>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-error hover:bg-error/5 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-base!">delete_forever</span>
            Delete Account
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 px-8 py-8 max-w-2xl">
        <!-- Profile Tab -->
        <template v-if="activeTab === 'profile'">
          <div class="mb-8">
            <h2 class="font-title text-xl font-bold text-on-surface">Profile</h2>
            <p class="text-[13px] text-secondary mt-1">Update your personal information</p>
          </div>

          <div class="space-y-6">
            <!-- Avatar -->
            <div class="flex items-center gap-5">
              <div
                class="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl uppercase shadow-md"
              >
                {{ userInitial }}
              </div>
              <div>
                <button
                  class="spring-btn px-4 py-2 border border-border rounded-md text-[13px] font-medium text-on-surface hover:border-primary transition-colors"
                >
                  Change Avatar
                </button>
                <p class="text-[11px] text-secondary mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div class="border-t border-border" />

            <!-- Display Name -->
            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">Display Name</label>
              <input
                v-model="form.displayName"
                type="text"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface"
                placeholder="e.g. John Doe"
              />
            </div>

            <!-- Username -->
            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface"
                placeholder="e.g. johndoe"
              />
              <p class="text-[11px] text-secondary">memories.app/@{{ form.username || 'username' }}</p>
            </div>

            <!-- Bio -->
            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">Bio</label>
              <textarea
                rows="3"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface resize-none"
                placeholder="Tell a little about yourself..."
              />
            </div>

            <div class="pt-2 flex gap-3">
              <v-btn
                color="primary"
                size="large"
                class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
              >
                Save Changes
              </v-btn>
            </div>
          </div>
        </template>

        <!-- Password Tab -->
        <template v-else-if="activeTab === 'password'">
          <div class="mb-8">
            <h2 class="font-title text-xl font-bold text-on-surface">Password</h2>
            <p class="text-[13px] text-secondary mt-1">Change your account password</p>
          </div>

          <div class="space-y-6">
            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">Current Password</label>
              <input
                type="password"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface"
                placeholder="••••••••"
              />
            </div>

            <div class="border-t border-border" />

            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">New Password</label>
              <input
                type="password"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface"
                placeholder="••••••••"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-[12px] uppercase tracking-widest text-secondary font-semibold">Confirm New Password</label>
              <input
                type="password"
                class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px] text-on-surface"
                placeholder="••••••••"
              />
            </div>

            <div class="pt-2">
              <v-btn
                color="primary"
                size="large"
                class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
              >
                Update Password
              </v-btn>
            </div>
          </div>
        </template>

        <!-- 2FA Tab -->
        <template v-else-if="activeTab === '2fa'">
          <div class="mb-8">
            <h2 class="font-title text-xl font-bold text-on-surface">Two-Factor Authentication</h2>
            <p class="text-[13px] text-secondary mt-1">Add an extra layer of security to your account</p>
          </div>

          <div class="p-5 border border-border rounded-md bg-surface flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-secondary">lock</span>
            </div>
            <div>
              <p class="text-[14px] font-semibold text-on-surface">2FA is not enabled</p>
              <p class="text-[12px] text-secondary mt-0.5">
                Enable two-factor authentication to protect your account from unauthorized access.
              </p>
              <v-btn
                color="primary"
                size="small"
                class="spring-btn font-body text-xs font-semibold tracking-wider uppercase rounded-md! mt-3"
              >
                Enable 2FA
              </v-btn>
            </div>
          </div>
        </template>

        <!-- Notifications Tab -->
        <template v-else-if="activeTab === 'notifications'">
          <div class="mb-8">
            <h2 class="font-title text-xl font-bold text-on-surface">Notifications</h2>
            <p class="text-[13px] text-secondary mt-1">Choose what notifications you receive</p>
          </div>

          <div class="space-y-4">
            <div
              v-for="notif in notificationSettings"
              :key="notif.key"
              class="flex items-center justify-between py-4 border-b border-border last:border-0"
            >
              <div>
                <p class="text-[14px] font-medium text-on-surface">{{ notif.label }}</p>
                <p class="text-[12px] text-secondary mt-0.5">{{ notif.description }}</p>
              </div>
              <input
                v-model="notif.enabled"
                type="checkbox"
                class="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div class="pt-6">
            <v-btn
              color="primary"
              size="large"
              class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
            >
              Save Preferences
            </v-btn>
          </div>
        </template>

        <!-- Sessions Tab -->
        <template v-else-if="activeTab === 'sessions'">
          <div class="mb-8">
            <h2 class="font-title text-xl font-bold text-on-surface">Active Sessions</h2>
            <p class="text-[13px] text-secondary mt-1">Manage devices that are logged in to your account</p>
          </div>

          <div class="space-y-3">
            <div
              v-for="session in mockSessions"
              :key="session.id"
              class="p-4 border border-border rounded-md bg-surface flex items-start justify-between gap-4"
            >
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-secondary mt-0.5">{{ session.icon }}</span>
                <div>
                  <p class="text-[13px] font-semibold text-on-surface">{{ session.device }}</p>
                  <p class="text-[11px] text-secondary mt-0.5">{{ session.location }} · {{ session.lastActive }}</p>
                </div>
              </div>
              <span
                v-if="session.current"
                class="text-[10px] uppercase tracking-widest text-primary font-bold px-2 py-1 bg-primary/10 rounded"
              >
                Current
              </span>
              <button
                v-else
                class="text-[12px] text-error hover:underline cursor-pointer"
              >
                Revoke
              </button>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// definePageMeta({ layout: 'marketing' })

const routes = useRoutes()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = computed(() => (route.query.tab as string) || 'profile')

const sidebarItems = [
  { tab: 'profile', label: 'Profile', icon: 'manage_accounts' },
  { tab: 'password', label: 'Password', icon: 'lock' },
  { tab: '2fa', label: 'Two-Factor Auth', icon: 'security' },
  { tab: 'notifications', label: 'Notifications', icon: 'notifications' },
  { tab: 'sessions', label: 'Sessions', icon: 'devices' },
]

const userInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'A'
  return name.charAt(0).toUpperCase()
})

const form = ref({
  displayName: authStore.user?.displayName || '',
  username: authStore.user?.username || '',
})

const notificationSettings = ref([
  { key: 'new_story', label: 'New Stories', description: 'Get notified when someone you follow posts a new story', enabled: true },
  { key: 'comments', label: 'Comments', description: 'Get notified when someone comments on your story', enabled: true },
  { key: 'mentions', label: 'Mentions', description: 'Get notified when someone mentions you', enabled: false },
  { key: 'weekly_digest', label: 'Weekly Digest', description: 'Receive a weekly summary of activity in your spaces', enabled: true },
  { key: 'security', label: 'Security Alerts', description: 'Important notifications about your account security', enabled: true },
])

const mockSessions = [
  { id: 1, device: 'Chrome on Windows', location: 'Ho Chi Minh City, VN', lastActive: 'Active now', icon: 'laptop', current: true },
  { id: 2, device: 'Safari on iPhone', location: 'Ho Chi Minh City, VN', lastActive: '2 hours ago', icon: 'smartphone', current: false },
  { id: 3, device: 'Firefox on macOS', location: 'Hanoi, VN', lastActive: '3 days ago', icon: 'laptop_mac', current: false },
]
</script>
