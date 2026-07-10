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
            :value="ACTIVE_TAB.OWNER"
            class="text-[13px] font-title font-bold tracking-widest uppercase cursor-pointer"
          >
            My Sanctuaries ({{ ownedCount }})
          </v-tab>
          <v-tab
            :value="ACTIVE_TAB.MEMBER"
            class="text-[13px] font-title font-bold tracking-widest uppercase cursor-pointer"
          >
            Joined Archives ({{ joinedCount }})
          </v-tab>
        </v-tabs>

        <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div class="flex border border-border rounded bg-background overflow-hidden">
            <button
              class="p-2 flex items-center justify-center transition-colors cursor-pointer w-9 h-9"
              :class="viewMode === VIEW_MODE.GRID ? 'bg-primary/10 text-primary font-bold' : 'text-secondary/60 hover:text-primary'"
              title="Grid View"
              @click="setViewMode(VIEW_MODE.GRID)"
            >
              <span class="material-symbols-outlined text-lg!">grid_view</span>
            </button>
            <button
              class="p-2 flex items-center justify-center border-l border-border transition-colors cursor-pointer w-9 h-9"
              :class="viewMode === VIEW_MODE.TABLE ? 'bg-primary/10 text-primary font-bold' : 'text-secondary/60 hover:text-primary'"
              title="Table View"
              @click="setViewMode(VIEW_MODE.TABLE)"
            >
              <span class="material-symbols-outlined text-lg!">table_rows</span>
            </button>
          </div>

          <button
            class="spring-btn flex items-center gap-1.5 px-4 py-2 border border-primary/20 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 rounded-md text-[12px] uppercase font-bold tracking-widest cursor-pointer"
            @click="openCreateSpace"
          >
            <span class="material-symbols-outlined text-base!">add</span>
            New Space
          </button>

          <button
            class="spring-btn flex items-center gap-1.5 px-4 py-2 border border-secondary/20 hover:border-secondary text-secondary bg-secondary/5 hover:bg-secondary/10 rounded-md text-[12px] uppercase font-bold tracking-widest cursor-pointer"
            @click="openJoinSpace"
          >
            <span class="material-symbols-outlined text-base!">group_add</span>
            Join Space
          </button>
        </div>
      </div>

      <!-- OWNED SPACES TAB -->
      <div
        v-show="activeTab === ACTIVE_TAB.OWNER"
        class="space-y-8 flex flex-col grow"
      >
        <div
          v-if="ownedLoading && ownedSpaces.length === 0"
          class="py-20 flex flex-col items-center justify-center space-y-4"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          />
          <p class="font-poetic text-xl italic text-secondary">Opening vaults...</p>
        </div>

        <template v-else-if="ownedSpaces.length > 0">
          <SpacesGrid
            v-if="viewMode === VIEW_MODE.GRID"
            :spaces="ownedSpaces"
            :loading="ownedLoading"
            :has-more="ownedHasMore"
            @create="openCreateSpace"
            @enter="enterSpace"
            @load-more="loadMoreOwned"
          />

          <SpacesTable
            v-else-if="viewMode === VIEW_MODE.TABLE"
            :spaces="ownedSpaces"
            :meta="ownedMeta"
            :loading="ownedLoading"
            @create="openCreateSpace"
            @enter="enterSpace"
            @change-page="setPageOwned"
            @change-limit="setLimitOwned"
          />
        </template>

        <!-- Empty State -->
        <div
          v-else-if="!ownedLoading"
          class="py-20 flex flex-col items-center justify-center space-y-4"
        >
          <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
          <h3 class="font-poetic text-2xl italic text-on-background">No sanctuaries found</h3>
          <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
            You don't have any sanctuaries in this vault yet. Create a new one to start capturing your journey.
          </p>
        </div>
      </div>

      <!-- JOINED SPACES TAB -->
      <div
        v-show="activeTab === ACTIVE_TAB.MEMBER"
        class="space-y-8 flex flex-col grow"
      >
        <div
          v-if="joinedLoading && joinedSpaces.length === 0"
          class="py-20 flex flex-col items-center justify-center space-y-4"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          />
          <p class="font-poetic text-xl italic text-secondary">Opening vaults...</p>
        </div>

        <template v-else-if="joinedSpaces.length > 0">
          <SpacesGrid
            v-if="viewMode === VIEW_MODE.GRID"
            :spaces="joinedSpaces"
            :loading="joinedLoading"
            :has-more="joinedHasMore"
            @create="openCreateSpace"
            @enter="enterSpace"
            @load-more="loadMoreJoined"
          />

          <SpacesTable
            v-else-if="viewMode === VIEW_MODE.TABLE"
            :spaces="joinedSpaces"
            :meta="joinedMeta"
            :loading="joinedLoading"
            @create="openCreateSpace"
            @enter="enterSpace"
            @change-page="setPageJoined"
            @change-limit="setLimitJoined"
          />
        </template>

        <!-- Empty State -->
        <div
          v-else-if="!joinedLoading"
          class="py-20 flex flex-col items-center justify-center space-y-4"
        >
          <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
          <h3 class="font-poetic text-2xl italic text-on-background">No joined sanctuaries found</h3>
          <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
            You haven't joined any sanctuaries yet. Request to join a space to start sharing memories.
          </p>
        </div>
      </div>
    </div>

    <!-- Create Space Modal -->
    <CreateSpaceModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @success="handleCreateSuccess"
    />

    <!-- Join Space Modal -->
    <JoinSpaceModal
      v-if="showJoinModal"
      @close="showJoinModal = false"
      @success="handleJoinSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type { Space, GetSpacesQuery } from '~/features/spaces/spaces.type'
import { useSpaces } from '~/features/spaces/composables/useSpaces'
import CreateSpaceModal from '~/features/spaces/components/CreateSpaceModal.vue'
import JoinSpaceModal from '~/features/spaces/components/JoinSpaceModal.vue'
import SpacesTable from '~/features/spaces/components/SpacesTable.vue'
import SpacesGrid from '~/features/spaces/components/SpacesGrid.vue'
import { useSpaces as useSpacesQueries } from '~/features/spaces/spaces.queries'
import { ACTIVE_TAB, VIEW_MODE, VIEW_MODE_LIMIT } from '../spaces.constant'

const routes = useRoutes()
const { viewMode, setViewMode, activeTab } = useSpaces()
const { useList } = useSpacesQueries()

const showCreateModal = ref(false)
const showJoinModal = ref(false)

// 1. Owned Spaces State & Query
const ownedQuery = ref<GetSpacesQuery>({
  role: ACTIVE_TAB.OWNER,
  page: 1,
  limit: viewMode.value === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE,
})

const {
  data: rawOwnedData,
  items: accumulatedOwnedSpaces,
  loading: ownedLoading,
  hasMore: ownedHasMore,
  loadMore: loadMoreOwned,
  reset: resetOwned,
} = useInfiniteScroll<Space>(ownedQuery, useList)

const ownedSpaces = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) {
    return rawOwnedData.value?.items || []
  }
  return accumulatedOwnedSpaces.value
})

const ownedMeta = computed(() => {
  return (
    rawOwnedData.value?.meta || {
      total: 0,
      page: 1,
      limit: VIEW_MODE_LIMIT.TABLE,
      totalPages: 0,
    }
  )
})

const setPageOwned = (page: number) => {
  ownedQuery.value.page = page
}

const setLimitOwned = (limit: number) => {
  ownedQuery.value.limit = limit
  ownedQuery.value.page = 1
}

// 2. Joined Spaces State & Query
const joinedQuery = ref<GetSpacesQuery>({
  role: ACTIVE_TAB.MEMBER,
  page: 1,
  limit: viewMode.value === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE,
})

const {
  data: rawJoinedData,
  items: accumulatedJoinedSpaces,
  loading: joinedLoading,
  hasMore: joinedHasMore,
  loadMore: loadMoreJoined,
  reset: resetJoined,
} = useInfiniteScroll<Space>(joinedQuery, useList)

const joinedSpaces = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) {
    return rawJoinedData.value?.items || []
  }
  return accumulatedJoinedSpaces.value
})

const joinedMeta = computed(() => {
  return (
    rawJoinedData.value?.meta || {
      total: 0,
      page: 1,
      limit: VIEW_MODE_LIMIT.TABLE,
      totalPages: 0,
    }
  )
})

const setPageJoined = (page: number) => {
  joinedQuery.value.page = page
}

const setLimitJoined = (limit: number) => {
  joinedQuery.value.limit = limit
  joinedQuery.value.page = 1
}

// Computed counts directly linked to queries' totals
const ownedCount = computed(() => ownedMeta.value.total)
const joinedCount = computed(() => joinedMeta.value.total)

// Watch viewMode to update both limits and reset pagination
watch(viewMode, newMode => {
  const newLimit = newMode === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE
  ownedQuery.value.limit = newLimit
  ownedQuery.value.page = 1
  joinedQuery.value.limit = newLimit
  joinedQuery.value.page = 1
  resetOwned()
  resetJoined()
})

const enterSpace = async (space: Space) => {
  await navigateTo(routes.spaceDetail(space.slug))
}

const openCreateSpace = () => {
  showCreateModal.value = true
}

const openJoinSpace = () => {
  showJoinModal.value = true
}

const handleCreateSuccess = (newSpace: Space) => {
  showCreateModal.value = false
  clearNuxtData(key => key.startsWith('spaces-list-'))
  resetOwned()
  enterSpace(newSpace)
}

const handleJoinSuccess = () => {
  showJoinModal.value = false
  clearNuxtData(key => key.startsWith('spaces-list-'))
  resetJoined()
}
</script>
