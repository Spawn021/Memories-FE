<template>
  <main
    class="h-screen w-screen flex flex-col md:flex-row bg-canvas-linen text-obsidian-ink font-body-md selection:bg-sunlit-clementine/30 overflow-hidden"
  >
    <!-- LEFT PANEL (Sidebar Controls) -->
    <aside
      class="w-full md:w-[360px] h-full flex flex-col justify-between p-8 bg-pure-surface border-b md:border-b-0 md:border-r border-whisper-border z-10 shrink-0 select-none"
    >
      <!-- Top Branding & User profile -->
      <div class="space-y-6">
        <div class="reveal-item" style="animation-delay: 50ms">
          <svg
            class="h-7 w-auto"
            viewBox="0 0 160 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0, 2)">
              <rect
                x="2"
                y="2"
                width="32"
                height="32"
                rx="4"
                fill="#FFFFFF"
                stroke="#181A1A"
                stroke-width="2"
              />
              <line x1="2" y1="26" x2="34" y2="26" stroke="#181A1A" stroke-width="1.5" />
              <circle cx="18" cy="14" r="5" fill="#E26A4A" />
              <path d="M6 26L13 16L18 21L24 13L30 26H6Z" fill="#181A1A" opacity="0.95" />
              <path d="M12 26L18 18L23 23L27 18L30 26H12Z" fill="#5C6E60" opacity="0.8" />
            </g>
            <text
              x="44"
              y="26"
              fill="#181A1A"
              font-family="Outfit, sans-serif"
              font-size="20"
              font-weight="700"
              letter-spacing="-0.03em"
            >
              memories
            </text>
          </svg>
        </div>

        <!-- User profile widget -->
        <div
          class="p-4 bg-canvas-linen border border-whisper-border rounded-md flex items-center justify-between reveal-item cursor-pointer hover:border-sunlit-clementine/30 transition-colors group/profile"
          style="animation-delay: 100ms"
          title="Click to edit profile"
          @click="openProfileModal"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-sunlit-clementine text-pure-surface flex items-center justify-center font-bold text-sm tracking-tighter uppercase shadow-sm group-hover/profile:scale-105 transition-transform"
            >
              {{ userInitial }}
            </div>
            <div class="overflow-hidden">
              <p class="font-bold text-[14px] leading-tight truncate text-obsidian-ink flex items-center gap-1">
                {{ user?.displayName || 'Archive Owner' }}
                <span class="material-symbols-outlined !text-[12px] opacity-0 group-hover/profile:opacity-100 text-sunlit-clementine transition-opacity">edit</span>
              </p>
              <p class="text-[11px] text-muted-leaf truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <button
            class="spring-btn p-1.5 hover:text-sunlit-clementine text-muted-leaf/50 transition-colors cursor-pointer"
            title="Sign Out"
            @click.stop="handleLogout"
          >
            <span class="material-symbols-outlined !text-[20px]">logout</span>
          </button>
        </div>
      </div>

      <!-- Controls & Creation Section -->
      <div class="my-6 md:my-auto space-y-6 flex-grow flex flex-col justify-center">
        <!-- Poetic Date Header -->
        <div class="reveal-item space-y-1" style="animation-delay: 150ms">
          <div class="font-poetic-accent text-3xl italic text-sunlit-clementine">
            {{ formattedDate }}
          </div>
          <div
            class="font-label-sm text-[11px] uppercase tracking-widest text-muted-leaf/50 flex items-center gap-1"
          >
            <span class="material-symbols-outlined !text-[12px]">location_on</span>
            Hanoi, VN // ACTIVE SESSION
          </div>
        </div>

        <!-- Search Bar -->
        <div class="reveal-item" style="animation-delay: 200ms">
          <div class="relative">
            <input
              v-model="searchQuery"
              class="w-full bg-canvas-linen border border-obsidian-ink/10 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sunlit-clementine/20 focus:border-sunlit-clementine transition-all font-body-md text-[13px] placeholder:text-muted-leaf/40"
              placeholder="Search memories or #tags..."
              type="text"
            />
            <span
              class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-leaf/40 !text-[18px]"
              >search</span
            >
          </div>
        </div>

        <!-- Filter Tags -->
        <div class="reveal-item space-y-2" style="animation-delay: 250ms">
          <p class="font-label-sm text-[11px] uppercase tracking-widest text-muted-leaf/60">
            Filter by category
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in availableTags"
              :key="tag"
              class="px-3 py-1 rounded-md text-[12px] font-label-md tracking-wider transition-all duration-200 cursor-pointer"
              :class="
                selectedTag === tag
                  ? 'bg-sunlit-clementine text-pure-surface font-semibold'
                  : 'bg-canvas-linen hover:bg-obsidian-ink/5 text-muted-leaf'
              "
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- CTA Capture Button -->
        <div class="reveal-item pt-2" style="animation-delay: 300ms">
          <button
            class="spring-btn w-full bg-sunlit-clementine text-pure-surface py-3.5 rounded-md font-label-md text-[13px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sunlit-clementine/10"
            @click="openCreateModal = true"
          >
            <span class="material-symbols-outlined !text-[18px]">add_a_photo</span>
            Capture Memory
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <footer
        class="flex justify-between items-center text-muted-leaf/40 font-label-sm text-[10px] tracking-widest reveal-item"
        style="animation-delay: 350ms"
      >
        <span>VOL. 2026 // SECURE</span>
        <div class="flex gap-3">
          <NuxtLink to="/terms" class="hover:text-sunlit-clementine underline transition-colors"
            >Terms</NuxtLink
          >
          <NuxtLink to="/privacy" class="hover:text-sunlit-clementine underline transition-colors"
            >Privacy</NuxtLink
          >
        </div>
      </footer>
    </aside>

    <!-- RIGHT PANEL (Gallery stream) -->
    <section
      class="flex-1 h-full overflow-y-auto p-6 md:p-12 relative bg-canvas-linen custom-scroll flex flex-col justify-between"
    >
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
            class="bg-pure-surface p-4 border border-whisper-border shadow-md transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:shadow-xl group cursor-pointer"
            :style="{ transform: `rotate(${item.rotation}deg)` }"
            @click="activeLightbox = item"
          >
            <div class="aspect-[4/3] overflow-hidden bg-canvas-linen relative">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover grayscale-[15%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
              />
              <span
                class="absolute top-3 right-3 bg-pure-surface/90 text-obsidian-ink px-2 py-0.5 rounded text-[10px] uppercase font-label-md tracking-wider border border-whisper-border"
              >
                {{ item.tag }}
              </span>
            </div>

            <div class="pt-4 pb-2 px-1 text-left space-y-1">
              <p class="font-poetic-accent text-2xl italic leading-none text-obsidian-ink truncate">
                {{ item.title }}
              </p>
              <div
                class="flex justify-between items-center text-[11px] font-label-sm text-muted-leaf/50 tracking-wider"
              >
                <span>{{ item.date }}</span>
                <span
                  class="material-symbols-outlined !text-[14px] opacity-0 group-hover:opacity-100 transition-opacity text-sunlit-clementine"
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
        <span class="material-symbols-outlined !text-[48px] text-muted-leaf/30 mb-4 animate-pulse"
          >photo_library</span
        >
        <h3 class="font-poetic-accent text-3xl italic text-obsidian-ink mb-1">
          Your archive is quiet
        </h3>
        <p class="text-[13px] text-muted-leaf max-w-xs leading-relaxed">
          No memories match your search query. Try capturing a new memory or clearing filters.
        </p>
        <button
          class="spring-btn mt-6 border border-obsidian-ink/10 bg-pure-surface hover:border-sunlit-clementine/30 text-[12px] uppercase font-label-md tracking-widest text-muted-leaf hover:text-sunlit-clementine py-2 px-6 rounded-md cursor-pointer"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <!-- Right Footer Info -->
      <footer
        class="shrink-0 pt-6 border-t border-obsidian-ink/5 flex justify-between items-center text-muted-leaf/30 font-label-sm text-[10px] tracking-widest"
      >
        <span>MEMORIES CAPTURED: {{ memories.length }}</span>
        <span>GALLERY VIEW // ASYMMETRIC GRID</span>
      </footer>
    </section>

    <!-- CREATE MEMORY MODAL -->
    <div
      v-if="openCreateModal"
      class="fixed inset-0 bg-obsidian-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
      @click.self="closeModal"
    >
      <div
        class="bg-pure-surface border border-whisper-border p-6 md:p-8 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full max-h-[90vh] flex flex-col overflow-y-auto custom-scroll"
      >
        <header class="mb-5 flex justify-between items-start">
          <div>
            <h2 class="font-headline-lg text-2xl font-bold text-obsidian-ink">Capture Memory</h2>
            <p class="text-[12px] text-muted-leaf">Record a new visual artifact in your archive.</p>
          </div>
          <button
            class="spring-btn text-muted-leaf/50 hover:text-sunlit-clementine cursor-pointer"
            @click="closeModal"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <form class="space-y-4" @submit.prevent="saveMemory">
          <!-- Memory Title -->
          <BaseInput
            id="m-title"
            v-model="newMemory.title"
            label="MEMORY TITLE"
            required
            placeholder="e.g. Rainy sunset over West Lake"
          />

          <!-- Tag Selection -->
          <div>
            <label class="block font-label-sm text-[12px] text-muted-leaf mb-1.5" for="m-tag"
              >CATEGORY TAG</label
            >
            <select
              id="m-tag"
              v-model="newMemory.tag"
              class="w-full px-4 py-2 bg-pure-surface border border-obsidian-ink/10 rounded-md focus:outline-none focus:ring-2 focus:ring-sunlit-clementine/20 focus:border-sunlit-clementine transition-all font-body-md text-[14px] cursor-pointer"
            >
              <option value="#journal">#journal</option>
              <option value="#moments">#moments</option>
              <option value="#light">#light</option>
              <option value="#conversations">#conversations</option>
            </select>
          </div>

          <!-- Visual Artifact Selection (Mock Photo grid) -->
          <div>
            <label class="block font-label-sm text-[12px] text-muted-leaf mb-2"
              >SELECT VISUAL ARTIFACT</label
            >
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="img in mockImageArtifacts"
                :key="img.url"
                class="aspect-square border-2 rounded-md overflow-hidden cursor-pointer transition-all relative group"
                :class="
                  newMemory.image === img.url
                    ? 'border-sunlit-clementine ring-2 ring-sunlit-clementine/10'
                    : 'border-obsidian-ink/5 hover:border-obsidian-ink/20'
                "
                @click="newMemory.image = img.url"
              >
                <img :src="img.url" class="w-full h-full object-cover grayscale-[30%]" />
                <div
                  class="absolute inset-0 bg-sunlit-clementine/10 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <BaseInput id="m-date" v-model="newMemory.date" label="DATE CAPTURED" required />

          <!-- CTA Buttons -->
          <div class="pt-4 flex gap-3">
            <BaseButton
              type="button"
              variant="secondary"
              full-width
              size="sm"
              class="flex-1"
              @click="closeModal"
            >
              Cancel
            </BaseButton>
            <BaseButton type="submit" variant="primary" full-width size="sm" class="flex-1">
              Save Archive
            </BaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- LIGHTBOX MODAL OVERLAY -->
    <div
      v-if="activeLightbox"
      class="fixed inset-0 bg-obsidian-ink/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-fadeIn"
      @click="activeLightbox = null"
    >
      <div class="relative max-w-4xl w-full flex flex-col items-center">
        <!-- Close button -->
        <button
          class="absolute -top-12 right-0 text-pure-surface hover:text-sunlit-clementine transition-colors flex items-center gap-2 font-label-sm text-[11px] tracking-widest cursor-pointer"
          @click="activeLightbox = null"
        >
          CLOSE <span class="material-symbols-outlined !text-[16px]">close</span>
        </button>

        <div
          class="bg-pure-surface p-4 md:p-6 shadow-2xl max-w-lg md:max-w-xl w-full border border-whisper-border"
        >
          <div class="aspect-[4/3] overflow-hidden bg-canvas-linen">
            <img
              :src="activeLightbox.image"
              :alt="activeLightbox.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="pt-5 pb-1 text-center space-y-2">
            <p class="font-poetic-accent text-3xl italic text-obsidian-ink">
              "{{ activeLightbox.title }}"
            </p>
            <div
              class="flex justify-center items-center gap-3 text-[11px] font-label-sm text-muted-leaf/50 tracking-wider"
            >
              <span>{{ activeLightbox.date }}</span>
              <span>•</span>
              <span class="text-sunlit-clementine font-bold">{{ activeLightbox.tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROFILE SETUP MODAL OVERLAY -->
    <div
      v-if="showProfileModal"
      class="fixed inset-0 bg-obsidian-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
      @click.self="closeProfileModal"
    >
      <div
        class="bg-pure-surface border border-whisper-border p-8 md:p-10 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full flex flex-col"
      >
        <!-- Close button in upper right corner -->
        <button
          class="absolute top-4 right-4 text-muted-leaf/40 hover:text-sunlit-clementine transition-colors cursor-pointer p-1"
          title="Close Setup"
          @click="closeProfileModal"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <header class="mb-6 text-center">
          <svg
            class="h-8 w-auto mx-auto mb-4"
            viewBox="0 0 160 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0, 2)">
              <rect
                x="2"
                y="2"
                width="32"
                height="32"
                rx="4"
                fill="#FFFFFF"
                stroke="#181A1A"
                stroke-width="2"
              />
              <line x1="2" y1="26" x2="34" y2="26" stroke="#181A1A" stroke-width="1.5" />
              <circle cx="18" cy="14" r="5" fill="#E26A4A" />
              <path d="M6 26L13 16L18 21L24 13L30 26H6Z" fill="#181A1A" opacity="0.95" />
              <path d="M12 26L18 18L23 23L27 18L30 26H12Z" fill="#5C6E60" opacity="0.8" />
            </g>
            <text
              x="44"
              y="26"
              fill="#181A1A"
              font-family="Outfit, sans-serif"
              font-size="20"
              font-weight="700"
              letter-spacing="-0.03em"
            >
              memories
            </text>
          </svg>
          <h2 class="font-headline-lg text-2xl font-bold text-obsidian-ink">Set Up Your Profile</h2>
          <p class="text-[12px] text-muted-leaf mt-1">
            Please provide a display name and username to personalize your vault.
          </p>
        </header>

        <!-- Global Error Banner -->
        <div
          v-if="setupGlobalError"
          class="mb-4 p-3 bg-error-container text-error rounded-md text-[13px] border border-error/10"
        >
          {{ setupGlobalError }}
        </div>

        <form class="space-y-4" @submit.prevent="submitProfileSetup">
          <BaseInput
            id="setup-displayname"
            v-model="setupDisplayName"
            label="Full Name / Display Name"
            placeholder="e.g. Hoang Nam"
            required
            :error="setupValidationErrors.displayName"
          />

          <BaseInput
            id="setup-username"
            v-model="setupUsername"
            label="Username"
            placeholder="e.g. hoangnam"
            required
            :error="setupValidationErrors.username"
          />

          <div class="pt-4 flex flex-col gap-2.5">
            <BaseButton
              type="submit"
              variant="primary"
              full-width
              :loading="setupLoading"
            >
              Save & Enter Vault
            </BaseButton>
            <div class="flex justify-between items-center text-[12px] px-1 pt-1.5">
              <button
                type="button"
                class="text-muted-leaf/60 hover:text-sunlit-clementine hover:underline cursor-pointer"
                @click="closeProfileModal"
              >
                Set up later
              </button>
              <button
                type="button"
                class="text-muted-leaf/60 hover:text-sunlit-clementine hover:underline cursor-pointer"
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
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from '#app'
import { z } from 'zod'

const profileSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name cannot exceed 50 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores')
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
    username: setupUsername.value
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

// Redirect to login if user logs out or state clears
onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
  } else {
    checkProfileSetup()
  }
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
        mem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        mem.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
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
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
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
  navigateTo('/login')
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
  background-color: rgba(24, 26, 26, 0.08);
  border-radius: 9px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-sunlit-clementine);
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
