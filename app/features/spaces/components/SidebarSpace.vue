<template>
  <div class="space-y-6 flex-grow flex flex-col justify-center w-full">
    <!-- Space Selector Dropdown -->
    <div
      class="reveal-item relative p-4 bg-background border border-border rounded-md hover:border-primary/30 transition-colors"
      style="animation-delay: 100ms"
    >
      <div
        class="flex items-center justify-between cursor-pointer group/space"
        @click="isOpenSpaceDropdown = !isOpenSpaceDropdown"
      >
        <div class="overflow-hidden">
          <p class="text-[10px] uppercase tracking-widest text-secondary/50 font-bold">Active Space</p>
          <h2 class="font-title text-lg font-bold text-on-surface truncate flex items-center gap-1.5 mt-0.5">
            <span>{{ activeSpace?.name || 'Loading Space...' }}</span>
            <span
              class="material-symbols-outlined !text-[16px] text-secondary group-hover/space:text-primary transition-transform duration-200"
              :class="{ 'rotate-180': isOpenSpaceDropdown }"
            >
              keyboard_arrow_down
            </span>
          </h2>
        </div>
        <!-- Type badge -->
        <span class="bg-surface border border-border text-secondary/80 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
          {{ activeSpace?.type || '...' }}
        </span>
      </div>

      <!-- Dropdown flyout menu -->
      <div
        v-if="isOpenSpaceDropdown"
        class="absolute left-0 right-0 mt-3 bg-surface border border-border rounded-md shadow-xl z-20 py-1.5 animate-fadeIn"
      >
        <div class="max-h-40 overflow-y-auto custom-scroll">
          <button
            v-for="s in otherSpaces"
            :key="s.uuid"
            class="w-full text-left px-4 py-2 hover:bg-background text-[13px] text-on-surface transition-colors truncate flex items-center gap-2"
            @click="switchSpace(s)"
          >
            <span class="material-symbols-outlined !text-[16px] text-secondary">photo_album</span>
            {{ s.name }}
          </button>
          <p
            v-if="otherSpaces.length === 0"
            class="text-[11px] text-secondary/40 text-center py-2 italic"
          >
            No other spaces available
          </p>
        </div>

        <div class="border-t border-border mt-1.5 pt-1.5 px-2 space-y-1">
          <button
            class="w-full text-left px-2 py-1.5 hover:bg-background hover:text-primary text-[11px] uppercase tracking-widest text-secondary flex items-center gap-2 rounded transition-colors"
            @click="goToPortal"
          >
            <span class="material-symbols-outlined !text-[16px]">apps</span>
            Sanctuary Portal
          </button>

          <!-- Manage Members & settings (Owner / Admin only) -->
          <button
            v-if="isOwnerOrAdmin"
            class="w-full text-left px-2 py-1.5 hover:bg-background hover:text-primary text-[11px] uppercase tracking-widest text-secondary flex items-center gap-2 rounded transition-colors"
            @click="openSettings"
          >
            <span class="material-symbols-outlined !text-[16px]">settings</span>
            Space Settings
          </button>
        </div>
      </div>
    </div>

    <!-- Space Members Avatars -->
    <div
      v-if="activeSpace?.members"
      class="reveal-item space-y-2 px-1"
      style="animation-delay: 120ms"
    >
      <p class="font-body text-[11px] uppercase tracking-widest text-secondary/50">Sanctuary Members</p>
      <div class="flex items-center justify-between">
        <div class="flex -space-x-1.5 overflow-hidden">
          <div
            v-for="member in activeSpace.members.slice(0, 5)"
            :key="member.id"
            class="inline-block h-6 w-6 rounded-full ring-2 ring-surface bg-secondary text-on-secondary flex items-center justify-center font-bold text-[9px] uppercase cursor-help"
            :title="`${member.user.displayName || 'Member'} (${member.role})`"
          >
            {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
          </div>
          <div
            v-if="activeSpace.members.length > 5"
            class="inline-block h-6 w-6 rounded-full ring-2 ring-surface bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-[9px]"
          >
            +{{ activeSpace.members.length - 5 }}
          </div>
        </div>
        <span class="text-[11px] text-secondary/60"> {{ activeSpace.members.length }} Active </span>
      </div>
    </div>

    <!-- Filtering & Date Section -->
    <div class="space-y-6 flex-grow flex flex-col justify-center">
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
            class="px-3 py-1 rounded-md text-[12px] font-body text-sm font-semibold tracking-wider transition-all duration-200 cursor-pointer"
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
          class="spring-btn w-full bg-primary text-on-primary py-3.5 rounded-md font-body text-sm font-semibold tracking-wider text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          @click="openCreateModal = true"
        >
          <span class="material-symbols-outlined !text-[18px]">add_a_photo</span>
          Capture Memory
        </button>
      </div>
    </div>

    <!-- Space Settings Modal (Task 2.12) -->
    <MemberSettingsModal
      v-if="showSettingsModal && activeSpace"
      :space="activeSpace"
      @close="showSettingsModal = false"
      @refresh="fetchSpaceDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, navigateTo, useState } from '#imports'
import { useSpaces } from '~/queries/spaces'
import { useAuthStore } from '~/stores/auth'
import { useLocalePath } from '#imports'
import type { SpaceRole, Space } from '~/types/space'
import MemberSettingsModal from '~/components/spaces/MemberSettingsModal.vue'

const localePath = useLocalePath()
const route = useRoute()
const authStore = useAuthStore()

const slug = computed(() => route.params.slug as string)

// Space Selector Dropdown state
const isOpenSpaceDropdown = ref(false)
const showSettingsModal = ref(false)

const { useDetails, useList } = useSpaces()
const { data: spaceDetails, refresh: refreshSpaceDetails } = useDetails(slug)
const activeSpace = computed(() => spaceDetails.value)

// Load other spaces list for dropdown switching
const spacesQuery = ref({ limit: 100 })
const { data: spacesData } = useList(spacesQuery)
const spaces = computed(() => spacesData.value?.items || [])

const otherSpaces = computed(() => {
  return spaces.value.filter(s => s.uuid !== activeSpace.value?.uuid)
})

const activeRole = computed<SpaceRole | null>(() => {
  if (!activeSpace.value || !authStore.user) return null
  const member = activeSpace.value.members.find(m => String(m.userId) === String(authStore.user?.id))
  return member ? member.role : null
})

const isOwnerOrAdmin = computed(() => {
  return activeRole.value === 'OWNER' || activeRole.value === 'ADMIN'
})

const switchSpace = async (space: Space) => {
  isOpenSpaceDropdown.value = false
  await navigateTo(localePath(`/spaces/${space.slug}`))
}

const openSettings = () => {
  isOpenSpaceDropdown.value = false
  showSettingsModal.value = true
}

const fetchSpaceDetails = async () => {
  await refreshSpaceDetails()
}

// Shared filter and creation trigger states with main content view
const searchQuery = useState('searchQuery', () => '')
const selectedTag = useState('selectedTag', () => null as string | null)
const openCreateModal = useState('openCreateModal', () => false)

const availableTags = ['All', '#journal', '#moments', '#light', '#conversations']

const toggleTag = (tag: string) => {
  if (tag === 'All') {
    selectedTag.value = null
  } else {
    selectedTag.value = tag
  }
}

// Reset filter state when route slug changes
watch(slug, () => {
  searchQuery.value = ''
  selectedTag.value = null
  openCreateModal.value = false
})

const formattedDate = computed(() => {
  if (!process.client) return '08 June 2026'
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

const goToPortal = async () => {
  isOpenSpaceDropdown.value = false
  await navigateTo(localePath('/spaces'))
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
