<template>
  <main
    class="h-screen w-screen flex flex-col md:flex-row bg-background text-on-background font-body selection:bg-primary/30 overflow-hidden"
  >
    <!-- LEFT PANEL (Sidebar Controls) -->
    <aside
      class="w-full md:w-[360px] h-full flex flex-col justify-between p-8 bg-surface border-b md:border-b-0 md:border-r border-border z-10 shrink-0 select-none"
    >
      <!-- Top Branding & User profile -->
      <div class="space-y-6">
        <div
          class="reveal-item flex justify-between items-center"
          style="animation-delay: 50ms"
        >
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-7 w-auto"
            alt="Memories Logo"
          />
          <LanguageSwitcher />
        </div>

        <!-- User profile widget -->
        <div
          class="p-4 bg-background border border-border rounded-md flex items-center justify-between reveal-item cursor-pointer hover:border-primary/30 transition-colors group/profile"
          style="animation-delay: 100ms"
          title="Click to edit profile"
          @click="openProfileModal"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm tracking-tighter uppercase shadow-sm group-hover/profile:scale-105 transition-transform"
            >
              {{ userInitial }}
            </div>
            <div class="overflow-hidden">
              <p class="font-bold text-[14px] leading-tight truncate text-on-surface flex items-center gap-1">
                {{ user?.displayName || 'Archive Owner' }}
                <span
                  class="material-symbols-outlined !text-[12px] opacity-0 group-hover/profile:opacity-100 text-primary transition-opacity"
                  >edit</span
                >
              </p>
              <p class="text-[11px] text-secondary truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <button
              class="spring-btn p-1.5 hover:text-primary text-secondary/55 transition-colors cursor-pointer mr-1"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              @click.stop="toggleTheme"
            >
              <span class="material-symbols-outlined !text-[20px]">
                {{ isDark ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>
            <button
              class="spring-btn p-1.5 hover:text-primary text-secondary/55 transition-colors cursor-pointer"
              title="Sign Out"
              @click.stop="handleLogout"
            >
              <span class="material-symbols-outlined !text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Controls & Creation Section -->
      <div class="my-6 md:my-auto space-y-6 flex-grow flex flex-col justify-center">
        <!-- Poetic Date Header -->
        <div
          class="reveal-item space-y-1"
          style="animation-delay: 150ms"
        >
          <div class="font-poetic text-3xl italic text-primary">
            {{ formattedDate }}
          </div>
          <div class="font-body text-sm text-[11px] uppercase tracking-widest text-secondary/50 flex items-center gap-1">
            <span class="material-symbols-outlined !text-[12px]">location_on</span>
            Hanoi, VN // ACTIVE SESSION
          </div>
        </div>

        <!-- Search Bar -->
        <div
          class="reveal-item"
          style="animation-delay: 200ms"
        >
          <div class="relative">
            <input
              v-model="searchQuery"
              class="w-full bg-background border border-border rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[13px] placeholder:text-on-surface-variant/40 text-on-surface"
              placeholder="Search memories or #tags..."
              type="text"
            />
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 !text-[18px]"
              >search</span
            >
          </div>
        </div>

        <!-- Filter Tags -->
        <div
          class="reveal-item space-y-2"
          style="animation-delay: 250ms"
        >
          <p class="font-body text-sm text-[11px] uppercase tracking-widest text-secondary/60">Filter by category</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in availableTags"
              :key="tag"
              class="px-3 py-1 rounded-md text-[12px] font-body text-sm font-semibold tracking-wider tracking-wider transition-all duration-200 cursor-pointer"
              :class="selectedTag === tag ? 'bg-primary text-on-primary font-semibold' : 'bg-background hover:bg-border text-secondary'"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- CTA Capture Button -->
        <div
          class="reveal-item pt-2"
          style="animation-delay: 300ms"
        >
          <button
            class="spring-btn w-full bg-primary text-on-primary py-3.5 rounded-md font-body text-sm font-semibold tracking-wider text-[13px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
            @click="openCreateModal = true"
          >
            <span class="material-symbols-outlined !text-[18px]">add_a_photo</span>
            Capture Memory
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <footer
        class="flex justify-between items-center text-secondary/40 font-body text-sm text-[10px] tracking-widest reveal-item"
        style="animation-delay: 350ms"
      >
        <span>VOL. 2026 // SECURE</span>
        <div class="flex gap-3">
          <NuxtLink
            :to="localePath('/terms')"
            class="hover:text-primary underline transition-colors"
          >
            Terms
          </NuxtLink>
          <NuxtLink
            :to="localePath('/privacy')"
            class="hover:text-primary underline transition-colors"
          >
            Privacy
          </NuxtLink>
        </div>
      </footer>
    </aside>

    <!-- RIGHT PANEL (Gallery stream) -->
    <section class="flex-1 h-full overflow-y-auto p-6 md:p-12 relative bg-background custom-scroll flex flex-col justify-between">
      <!-- Staggered Polaroid Feed -->
      <div
        v-if="filteredMemories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-12"
      >
        <div
          v-for="(item, index) in filteredMemories"
          :key="item.id"
          class="reveal-item"
          :style="{ animationDelay: `${index * 100 + 100}ms` }"
        >
          <!-- Polaroid Item wrapper with dynamic tilted rotation -->
          <div
            class="bg-surface p-4 border border-border shadow-md transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:shadow-xl group cursor-pointer"
            :style="{ transform: `rotate(${item.rotation}deg)` }"
            @click="activeLightbox = item"
          >
            <div class="aspect-[4/3] overflow-hidden bg-background relative">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover grayscale-[15%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
              />
              <span
                class="absolute top-3 right-3 bg-surface/90 text-on-surface px-2 py-0.5 rounded text-[10px] uppercase font-body text-sm font-semibold tracking-wider tracking-wider border border-border"
              >
                {{ item.tag }}
              </span>
            </div>

            <div class="pt-4 pb-2 px-1 text-left space-y-1">
              <p class="font-poetic text-2xl italic leading-none text-on-surface truncate">
                {{ item.title }}
              </p>
              <div class="flex justify-between items-center text-[11px] font-body text-sm text-secondary/50 tracking-wider">
                <span>{{ item.date }}</span>
                <span class="material-symbols-outlined !text-[14px] opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                  >zoom_in</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex-grow flex flex-col items-center justify-center py-20 text-center select-none reveal-item"
      >
        <span class="material-symbols-outlined !text-[48px] text-secondary/30 mb-4 animate-pulse">photo_library</span>
        <h3 class="font-poetic text-3xl italic text-on-background mb-1">Your archive is quiet</h3>
        <p class="text-[13px] text-secondary max-w-xs leading-relaxed">
          No memories match your search query. Try capturing a new memory or clearing filters.
        </p>
        <button
          class="spring-btn mt-6 border border-border bg-surface hover:border-primary/30 text-[12px] uppercase font-body text-sm font-semibold tracking-wider tracking-widest text-secondary hover:text-primary py-2 px-6 rounded-md cursor-pointer"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <!-- Right Footer Info -->
      <footer
        class="shrink-0 pt-6 border-t border-border flex justify-between items-center text-secondary/30 font-body text-sm text-[10px] tracking-widest"
      >
        <span>MEMORIES CAPTURED: {{ memories.length }}</span>
        <span>GALLERY VIEW // ASYMMETRIC GRID</span>
      </footer>
    </section>

    <!-- CREATE MEMORY MODAL -->
    <div
      v-if="openCreateModal"
      class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
      @click.self="closeModal"
    >
      <div
        class="bg-surface border border-border p-6 md:p-8 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full max-h-[90vh] flex flex-col overflow-y-auto custom-scroll"
      >
        <header class="mb-5 flex justify-between items-start">
          <div>
            <h2 class="font-title text-2xl font-bold text-on-surface">Capture Memory</h2>
            <p class="text-[12px] text-secondary">Record a new visual artifact in your archive.</p>
          </div>
          <button
            class="spring-btn text-secondary/50 hover:text-primary cursor-pointer"
            @click="closeModal"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <form
          class="space-y-4"
          @submit.prevent="saveMemory"
        >
          <!-- Memory Title -->
          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">MEMORY TITLE</label>
            <v-text-field
              id="m-title"
              v-model="newMemory.title"
              placeholder="e.g. Rainy sunset over West Lake"
              variant="outlined"
              density="compact"
              hide-details="auto"
              class="custom-v-input"
            />
          </div>

          <!-- Tag Selection -->
          <div>
            <label
              class="block font-body text-sm text-[12px] text-secondary mb-1.5"
              for="m-tag"
              >CATEGORY TAG</label
            >
            <select
              id="m-tag"
              v-model="newMemory.tag"
              class="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] cursor-pointer text-on-surface"
            >
              <option value="#journal">#journal</option>
              <option value="#moments">#moments</option>
              <option value="#light">#light</option>
              <option value="#conversations">#conversations</option>
            </select>
          </div>

          <!-- Visual Artifact Selection (Mock Photo grid) -->
          <div>
            <label class="block font-body text-sm text-[12px] text-secondary mb-2">SELECT VISUAL ARTIFACT</label>
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="img in mockImageArtifacts"
                :key="img.url"
                class="aspect-square border-2 rounded-md overflow-hidden cursor-pointer transition-all relative group"
                :class="newMemory.image === img.url ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-border-strong'"
                @click="newMemory.image = img.url"
              >
                <img
                  :src="img.url"
                  class="w-full h-full object-cover grayscale-[30%]"
                />
                <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">DATE CAPTURED</label>
            <v-text-field
              id="m-date"
              v-model="newMemory.date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              class="custom-v-input"
            />
          </div>

          <!-- CTA Buttons -->
          <div class="pt-4 flex gap-3">
            <v-btn
              type="button"
              variant="outlined"
              size="large"
              class="flex-1 spring-btn font-body text-sm font-semibold tracking-wider tracking-wider uppercase text-on-surface border-border"
              style="font-weight: 600; border-radius: var(--radius-lg); height: 44px"
              @click="closeModal"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              size="large"
              class="flex-1 spring-btn font-body text-sm font-semibold tracking-wider tracking-wider uppercase"
              style="font-weight: 600; border-radius: var(--radius-lg); height: 44px"
            >
              Save Archive
            </v-btn>
          </div>
        </form>
      </div>
    </div>

    <!-- LIGHTBOX MODAL OVERLAY -->
    <div
      v-if="activeLightbox"
      class="fixed inset-0 bg-on-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-fadeIn"
      @click="activeLightbox = null"
    >
      <div class="relative max-w-4xl w-full flex flex-col items-center">
        <!-- Close button -->
        <button
          class="absolute -top-12 right-0 text-on-primary hover:text-primary transition-colors flex items-center gap-2 font-body text-sm text-[11px] tracking-widest cursor-pointer"
          @click="activeLightbox = null"
        >
          CLOSE <span class="material-symbols-outlined !text-[16px]">close</span>
        </button>

        <div class="bg-surface p-4 md:p-6 shadow-2xl max-w-lg md:max-w-xl w-full border border-border">
          <div class="aspect-[4/3] overflow-hidden bg-background">
            <img
              :src="activeLightbox.image"
              :alt="activeLightbox.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="pt-5 pb-1 text-center space-y-2">
            <p class="font-poetic text-3xl italic text-on-surface">"{{ activeLightbox.title }}"</p>
            <div class="flex justify-center items-center gap-3 text-[11px] font-body text-sm text-secondary/50 tracking-wider">
              <span>{{ activeLightbox.date }}</span>
              <span>•</span>
              <span class="text-primary font-bold">{{ activeLightbox.tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROFILE SETUP MODAL OVERLAY -->
    <div
      v-if="showProfileModal"
      class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
      @click.self="closeProfileModal"
    >
      <div
        class="bg-surface border border-border p-8 md:p-10 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full flex flex-col"
      >
        <!-- Close button in upper right corner -->
        <button
          class="absolute top-4 right-4 text-secondary/40 hover:text-primary transition-colors cursor-pointer p-1"
          title="Close Setup"
          @click="closeProfileModal"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <header class="mb-6 text-center">
          <img
            :src="isDark ? LogoTextDark : LogoTextLight"
            class="h-8 w-auto mx-auto mb-4"
            alt="Memories Logo"
          />
          <h2 class="font-title text-2xl font-bold text-on-surface">Set Up Your Profile</h2>
          <p class="text-[12px] text-secondary mt-1">Please provide a display name and username to personalize your vault.</p>
        </header>

        <!-- Global Error Banner -->
        <div
          v-if="setupGlobalError"
          class="mb-4 p-3 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border"
        >
          {{ setupGlobalError }}
        </div>

        <form
          class="space-y-4"
          @submit.prevent="submitProfileSetup"
        >
          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">Full Name / Display Name</label>
            <v-text-field
              id="setup-displayname"
              v-model="setupDisplayName"
              placeholder="e.g. Hoang Nam"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="setupValidationErrors.displayName"
              class="custom-v-input"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">Username</label>
            <v-text-field
              id="setup-username"
              v-model="setupUsername"
              placeholder="e.g. hoangnam"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="setupValidationErrors.username"
              class="custom-v-input"
            />
          </div>

          <div class="pt-4 flex flex-col gap-2.5">
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="setupLoading"
              class="spring-btn font-body text-sm font-semibold tracking-wider tracking-wider uppercase"
              style="font-weight: 600; border-radius: var(--radius-lg); height: 50px"
            >
              Save & Enter Vault
            </v-btn>
            <div class="flex justify-between items-center text-[12px] px-1 pt-1.5">
              <button
                type="button"
                class="text-secondary/60 hover:text-primary hover:underline cursor-pointer"
                @click="closeProfileModal"
              >
                Set up later
              </button>
              <button
                type="button"
                class="text-secondary/60 hover:text-primary hover:underline cursor-pointer"
                @click="handleLogout"
              >
                Sign Out
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead } from '#imports'

const { t } = useI18n()

useHead({
  title: t('nav.dashboard'),
})
import { LogoTextLight, LogoTextDark } from '~/assets/icons'
import { navigateTo } from '#app'
import { z } from 'zod'
import { useTheme } from '~/composables/useTheme'

const localePath = useLocalePath()

const { isDark, toggleTheme } = useTheme()

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name cannot exceed 50 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
})

// Page guard middleware
const { user, isAuthenticated, updateProfile, logout } = useAuth()

// Profile Setup modal state
const setupDisplayName = ref('')
const setupUsername = ref('')
const setupLoading = ref(false)
const setupGlobalError = ref('')
const setupValidationErrors = ref<any>({})

const isSetupSkipped = ref(false)
const showProfileModal = ref(false)

const openProfileModal = () => {
  setupDisplayName.value = user.value?.displayName || ''
  setupUsername.value = user.value?.username || ''
  setupGlobalError.value = ''
  setupValidationErrors.value = {}
  showProfileModal.value = true
}

const closeProfileModal = () => {
  if (!user.value?.displayName || !user.value?.username) {
    isSetupSkipped.value = true
  }
  showProfileModal.value = false
}

// Watch or auto-open when user loads page
const checkProfileSetup = () => {
  const needsSetup = !user.value?.displayName || !user.value?.username
  if (isAuthenticated.value && needsSetup && !isSetupSkipped.value) {
    openProfileModal()
  }
}

// Submission Handler for Profile Setup
const submitProfileSetup = async () => {
  setupGlobalError.value = ''
  setupValidationErrors.value = {}

  const validation = profileSchema.safeParse({
    displayName: setupDisplayName.value,
    username: setupUsername.value,
  })

  if (!validation.success) {
    const errors: Record<string, string[]> = {}
    validation.error.issues.forEach(issue => {
      const field = issue.path[0] as string
      if (!errors[field]) {
        errors[field] = []
      }
      errors[field].push(issue.message)
    })
    setupValidationErrors.value = errors
    setupGlobalError.value = 'Please correct the validation errors.'
    return
  }

  setupLoading.value = true

  try {
    await updateProfile(setupDisplayName.value, setupUsername.value)
    showProfileModal.value = false
  } catch (err: any) {
    if (err.statusCode === 400 && err.errors) {
      setupValidationErrors.value = err.errors
      setupGlobalError.value = 'Please correct the validation errors.'
    } else {
      setupGlobalError.value = err.message || 'Failed to update profile. Please try again.'
    }
  } finally {
    setupLoading.value = false
  }
}

// Check profile setup on page load
onMounted(() => {
  checkProfileSetup()
})

// Current user initials for avatar badge
const userInitial = computed(() => {
  const name = user.value?.displayName || user.value?.email || 'A'
  return name.charAt(0).toUpperCase()
})

// Current formatted date for layout
const formattedDate = computed(() => {
  if (!process.client) return '08 June 2026'
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

// Memories seed data
interface Memory {
  id: string
  title: string
  image: string
  tag: string
  date: string
  rotation: number
}

const memories = ref<Memory[]>([
  {
    id: 'mem-1',
    title: 'Quiet Afternoons in Hanoi',
    image: '/images/polaroid_1.png',
    tag: '#journal',
    date: 'May 12, 2026',
    rotation: -1.5,
  },
  {
    id: 'mem-2',
    title: 'Traces of Summer Heat',
    image: '/images/polaroid_2.png',
    tag: '#moments',
    date: 'May 28, 2026',
    rotation: 2.0,
  },
  {
    id: 'mem-3',
    title: 'Coffee Conversations',
    image: '/images/polaroid_3.png',
    tag: '#conversations',
    date: 'June 02, 2026',
    rotation: -2.5,
  },
  {
    id: 'mem-4',
    title: 'Fragments of Light',
    image: '/images/polaroid_4.png',
    tag: '#light',
    date: 'June 06, 2026',
    rotation: 1.0,
  },
])

// Filter & Search states
const searchQuery = ref('')
const selectedTag = ref<string | null>(null)
const availableTags = ['All', '#journal', '#moments', '#light', '#conversations']

const toggleTag = (tag: string) => {
  if (tag === 'All') {
    selectedTag.value = null
  } else {
    selectedTag.value = tag
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTag.value = null
}

const filteredMemories = computed(() => {
  return memories.value
    .filter(mem => {
      const matchesSearch =
        mem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || mem.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesTag = !selectedTag.value || mem.tag === selectedTag.value
      return matchesSearch && matchesTag
    })
    .reverse() // Reverse to show newly added items first
})

// Create Memory Modal setup
const openCreateModal = ref(false)
const mockImageArtifacts = [
  { url: '/images/polaroid_1.png' },
  { url: '/images/polaroid_2.png' },
  { url: '/images/polaroid_3.png' },
  { url: '/images/polaroid_4.png' },
]

const getTodayString = () => {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`
}

const newMemory = ref({
  title: '',
  tag: '#journal',
  image: '/images/polaroid_1.png',
  date: getTodayString(),
})

const closeModal = () => {
  openCreateModal.value = false
  newMemory.value = {
    title: '',
    tag: '#journal',
    image: '/images/polaroid_1.png',
    date: getTodayString(),
  }
}

const saveMemory = () => {
  // Generate random rotation from -3 to 3 degrees
  const randomRotation = Math.random() * 6 - 3
  const id = `mem-${Date.now()}`

  memories.value.push({
    id,
    title: newMemory.value.title,
    tag: newMemory.value.tag,
    image: newMemory.value.image,
    date: newMemory.value.date,
    rotation: parseFloat(randomRotation.toFixed(1)),
  })

  closeModal()
}

// Lightbox modal active item
const activeLightbox = ref<Memory | null>(null)

// Logout handler
const handleLogout = async () => {
  await logout()
  navigateTo(localePath('/login'))
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: var(--border-strong);
  border-radius: 9px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
