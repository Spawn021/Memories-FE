<template>
  <NuxtLayout name="space">
    <template #sidebar>
      <SidebarSpace />
    </template>

    <div>
      <!-- Loading Space details -->
      <div
        v-if="loading && !activeSpace"
        class="flex-grow flex flex-col items-center justify-center py-20 animate-fadeIn"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <p class="font-poetic text-xl italic text-secondary mt-4">Restoring sanctuary timeline...</p>
      </div>

      <!-- Staggered Polaroid Feed -->
      <div
        v-else-if="filteredMemories.length > 0"
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
                class="absolute top-3 right-3 bg-surface/90 text-on-surface px-2 py-0.5 rounded text-[10px] uppercase font-body text-sm font-semibold tracking-wider border border-border"
              >
                {{ item.tag }}
              </span>
            </div>

            <div class="pt-4 pb-2 px-1 text-left space-y-1">
              <p class="font-poetic text-2xl italic leading-none text-on-surface truncate">
                {{ item.title }}
              </p>
              <div class="flex justify-between items-center text-[11px] font-body text-secondary/50 tracking-wider">
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
          class="spring-btn mt-6 border border-border bg-surface hover:border-primary/30 text-[12px] uppercase font-body text-sm font-semibold tracking-widest text-secondary hover:text-primary py-2 px-6 rounded-md cursor-pointer"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <!-- Right Footer Info -->
      <footer
        class="shrink-0 pt-6 border-t border-border flex justify-between items-center text-secondary/30 font-body text-[10px] tracking-widest mt-8"
      >
        <span>MEMORIES CAPTURED: {{ memories.length }}</span>
        <span>GALLERY VIEW // ASYMMETRIC GRID</span>
      </footer>

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
                  :class="
                    newMemory.image === img.url ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-border-strong'
                  "
                  @click="newMemory.image = img.url"
                >
                  <img
                    :src="img.url"
                    class="w-full h-full object-cover grayscale-[30%]"
                    alt="Mock Artifact"
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
                class="spring-btn flex-1 font-body text-sm font-semibold tracking-wider uppercase text-on-surface border-border"
                style="font-weight: 600; border-radius: var(--radius-lg); height: 44px"
                @click="closeModal"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="spring-btn flex-1 font-body text-sm font-semibold tracking-wider uppercase"
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
              <div class="flex justify-center items-center gap-3 text-[11px] font-body text-secondary/50 tracking-wider">
                <span>{{ activeLightbox.date }}</span>
                <span>•</span>
                <span class="text-primary font-bold">{{ activeLightbox.tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead, useRoute, useLocalePath, navigateTo, useState } from '#imports'
import { useSpaces } from '~/features/spaces/spaces.queries'
import SidebarSpace from '~/features/spaces/components/SidebarSpace.vue'

definePageMeta({
  layout: false, // Turn off automatic layout mapping to use NuxtLayout manually with named slots
  paddingClass: 'p-6 md:p-12',
})

const localePath = useLocalePath()
const route = useRoute()

const slug = ref(route.params.slug as string)

watch(
  () => route.params.slug,
  newSlug => {
    if (newSlug) {
      slug.value = newSlug as string
    }
  },
)

const { useDetails } = useSpaces()

// Load space details via query (sharing details fetch with layout)
const { data: spaceDetails, isPending: detailsLoading, error: detailsError } = useDetails(slug)
const activeSpace = computed(() => spaceDetails.value)
const loading = computed(() => detailsLoading.value)

// Redirect to selection portal if space details fetch fails
watch(detailsError, err => {
  if (err) {
    navigateTo(localePath('/spaces'))
  }
})
watch(spaceDetails, val => {
  if (val === null && !detailsLoading.value) {
    navigateTo(localePath('/spaces'))
  }
})

useHead({
  title: computed(() => `${activeSpace.value?.name || 'Sanctuary'} - Memories`),
})

// Shared Filter & Search states with Layout/SidebarSpace
const searchQuery = useState('searchQuery', () => '')
const selectedTag = useState('selectedTag', () => null as string | null)
const openCreateModal = useState('openCreateModal', () => false)

const clearFilters = () => {
  searchQuery.value = ''
  selectedTag.value = null
}

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

const filteredMemories = computed(() => {
  return memories.value
    .filter(mem => {
      const matchesSearch =
        mem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || mem.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesTag = !selectedTag.value || mem.tag === selectedTag.value
      return matchesSearch && matchesTag
    })
    .reverse() // Show newly added items first
})

// Create Memory Modal setup
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
