<template>
  <div class="space-y-8 grow flex flex-col justify-between p-6 md:p-12">
    <div class="space-y-8">
      <header class="reveal-item delay-100">
        <h2 class="font-title text-sm uppercase tracking-[0.2em] text-secondary/60">Select Sanctuary</h2>
        <p class="font-poetic text-4xl italic text-on-background mt-1">Available Spaces</p>
      </header>

      <div
        class="sticky top-0 bg-background/95 backdrop-blur-md z-10 py-3 -mx-8 lg:-mx-16 px-8 lg:px-16 border-b border-border/40 reveal-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <v-tabs
          v-model="activeTab"
          color="primary"
          density="comfortable"
        >
          <v-tab
            value="owned"
            class="text-[13px] font-title font-bold tracking-widest uppercase cursor-pointer"
          >
            My Sanctuaries ({{ ownedCount }})
          </v-tab>
          <v-tab
            value="joined"
            class="text-[13px] font-title font-bold tracking-widest uppercase cursor-pointer"
          >
            Joined Archives ({{ joinedCount }})
          </v-tab>
        </v-tabs>

        <!-- View Mode Switcher + Create space CTA -->
        <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <!-- View Switcher Toggle -->
          <div class="flex border border-border rounded bg-background overflow-hidden">
            <button
              class="p-2 flex items-center justify-center transition-colors cursor-pointer w-9 h-9"
              :class="viewMode === 'grid' ? 'bg-primary/10 text-primary font-bold' : 'text-secondary/60 hover:text-primary'"
              title="Grid View"
              @click="viewMode = 'grid'"
            >
              <span class="material-symbols-outlined !text-[18px]">grid_view</span>
            </button>
            <button
              class="p-2 flex items-center justify-center border-l border-border transition-colors cursor-pointer w-9 h-9"
              :class="viewMode === 'table' ? 'bg-primary/10 text-primary font-bold' : 'text-secondary/60 hover:text-primary'"
              title="Table View"
              @click="viewMode = 'table'"
            >
              <span class="material-symbols-outlined !text-[18px]">table_rows</span>
            </button>
          </div>

          <!-- Create Button -->
          <button
            class="spring-btn flex items-center gap-1.5 px-4 py-2 border border-primary/20 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 rounded-md text-[12px] uppercase font-bold tracking-widest cursor-pointer"
            @click="openCreateSpace"
          >
            <span class="material-symbols-outlined !text-[16px]">add</span>
            New Space
          </button>
        </div>
      </div>

      <!-- Loading State (Initial page load only) -->
      <div
        v-if="loading && currentSpaces.length === 0"
        class="py-20 flex flex-col items-center justify-center space-y-4"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <p class="font-poetic text-xl italic text-secondary">Opening vaults...</p>
      </div>

      <!-- Polaroid Grid (Grid View) -->
      <SpacesGrid
        v-else-if="currentSpaces.length > 0 && viewMode === 'grid'"
        :spaces="currentSpaces"
        :loading="loading"
        :has-more="hasMore"
        @create="openCreateSpace"
        @enter="enterSpace"
        @load-more="loadMore"
      />

      <!-- Table View (Table View) -->
      <SpacesTable
        v-else-if="currentSpaces.length > 0 && viewMode === 'table'"
        :spaces="currentSpaces"
        :meta="currentMeta"
        :loading="loading"
        @create="openCreateSpace"
        @enter="enterSpace"
        @change-page="goToPage"
      />

      <!-- Empty State -->
      <div
        v-else-if="!loading"
        class="py-20 flex flex-col items-center justify-center space-y-4"
      >
        <span class="material-symbols-outlined !text-[48px] text-secondary/30">photo_library</span>
        <h3 class="font-poetic text-2xl italic text-on-background">No sanctuaries found</h3>
        <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
          You don't have any sanctuaries in this vault yet. Create a new one to start capturing your journey.
        </p>
      </div>
    </div>

    <!-- Create Space Modal -->
    <CreateSpaceModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @success="handleCreateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { spacesRepository as createSpacesRepo } from '~/features/spaces/spaces.repository'
import type { Space, GetSpacesQuery } from '~/types/space'
import { useSpaces } from '../composables/useSpaces'
import CreateSpaceModal from './CreateSpaceModal.vue'
import SpacesTable from './SpacesTable.vue'
import SpacesGrid from './SpacesGrid.vue'

const localePath = useLocalePath()
const { useList, viewMode } = useSpaces()

const activeTab = ref<'owned' | 'joined'>('owned')

// Single query state
const spacesQuery = ref<GetSpacesQuery>({
  role: 'OWNER',
  page: 1,
  limit: 6,
})

// Initialize infinite scroll
const {
  data: rawSpacesData,
  items: accumulatedSpaces,
  meta: accumulatedMeta,
  loading,
  hasMore,
  loadMore,
  reset,
} = useInfiniteScroll<Space>(spacesQuery, useList)

// Computed spaces and metadata depending on view mode (grid infinite scroll vs table pagination)
const currentSpaces = computed(() => {
  if (viewMode.value === 'table') {
    return rawSpacesData.value?.items || []
  }
  return accumulatedSpaces.value
})

const currentMeta = computed(() => {
  if (viewMode.value === 'table') {
    return (
      rawSpacesData.value?.meta || {
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0,
      }
    )
  }
  return accumulatedMeta.value
})

// Separate local counts for the tab badges
const ownedCount = ref(0)
const joinedCount = ref(0)

// Prefetch total counts once on mount
onMounted(async () => {
  const api = useApi()
  const spacesRepository = createSpacesRepo(api)
  try {
    const ownedRes = await spacesRepository.findAll({ role: 'OWNER', page: 1, limit: 1 })
    ownedCount.value = ownedRes.meta.total

    const joinedRes = await spacesRepository.findAll({ role: 'MEMBER', page: 1, limit: 1 })
    joinedCount.value = joinedRes.meta.total
  } catch (error) {
    console.error('Failed to prefetch spaces counts:', error)
  }
})

// Synchronize count of active tab when currentMeta updates
watch(
  () => currentMeta.value.total,
  newTotal => {
    if (spacesQuery.value.role === 'OWNER') {
      ownedCount.value = newTotal
    } else {
      joinedCount.value = newTotal
    }
  },
)

const goToPage = (page: number) => {
  spacesQuery.value.page = page
}

// Reset page counts when switching tabs or view modes
watch(activeTab, newTab => {
  spacesQuery.value.role = newTab === 'owned' ? 'OWNER' : 'MEMBER'
  reset()
})

watch(viewMode, () => {
  reset()
})

const showCreateModal = ref(false)

const enterSpace = async (space: Space) => {
  await navigateTo(localePath(`/spaces/${space.slug}`))
}

const openCreateSpace = () => {
  showCreateModal.value = true
}

const handleCreateSuccess = (newSpace: Space) => {
  showCreateModal.value = false

  // Increment active count
  if (spacesQuery.value.role === 'OWNER') {
    ownedCount.value++
  } else {
    joinedCount.value++
  }

  enterSpace(newSpace)
}
</script>
