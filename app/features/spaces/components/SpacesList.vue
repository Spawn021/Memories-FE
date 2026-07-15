<template>
  <div class="grow flex flex-col justify-between p-6 md:p-12 md:pb-0">
    <div>
      <header class="reveal-item delay-100">
        <h2 class="font-title text-sm uppercase tracking-[0.2em] text-secondary/60">Select Sanctuary</h2>
        <p class="font-poetic text-4xl italic text-on-background mt-1">Available Spaces</p>
      </header>

      <div
        class="sticky top-0 bg-background backdrop-blur-md z-20 pt-3 sm:py-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:h-18"
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

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
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

      <div
        v-show="activeTab === ACTIVE_TAB.OWNER"
        class="space-y-6 flex flex-col grow pt-4"
      >
        <div class="flex flex-col sm:flex-row gap-6 items-start grow w-full">
          <!-- Left Collapsible Filter Panel -->
          <transition name="slide-fade">
            <SpaceFilters
              v-if="isFilterOpen"
              v-model:selected-type="ownedQuery.type"
              v-model:selected-visibility="ownedQuery.visibility"
              class="reveal-item"
              @close="isFilterOpen = false"
            />
          </transition>

          <!-- Right Content Container -->
          <div class="grow w-full space-y-6">
            <!-- Toolbar is placed at the top of the right container -->
            <SpaceToolbar
              v-model:search-query="ownedQuery.search"
              v-model:view-mode="viewMode"
              v-model:is-filter-open="isFilterOpen"
              v-model:sort-by="ownedQuery.sortBy"
              v-model:sort-order="ownedQuery.sortOrder"
              :active-filter-count="activeFilterCountOwned"
              class="reveal-item"
            />

            <!-- Loading state inside list container during search/filter refetching -->
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

            <!-- Empty state when active filters return 0 results -->
            <div
              v-else-if="ownedSpaces.length === 0 && isFilterOwned"
              class="py-20 flex flex-col items-center justify-center space-y-4 border border-border/40 rounded-2xl bg-surface/35 backdrop-blur-md shadow-xs animate-fade-in"
            >
              <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
              <h3 class="font-poetic text-2xl italic text-on-background">No sanctuaries found</h3>
              <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
                No sanctuaries match your active search or filters. Try adjusting them or click reset.
              </p>
            </div>

            <!-- Global Empty State when user has absolutely zero spaces -->
            <div
              v-else-if="ownedSpaces.length === 0"
              class="py-20 flex flex-col items-center justify-center space-y-4 border border-border/40 rounded-2xl bg-surface/35 backdrop-blur-md shadow-xs animate-fade-in"
            >
              <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
              <h3 class="font-poetic text-2xl italic text-on-background">No sanctuaries found</h3>
              <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
                You don't have any sanctuaries in this vault yet. Create a new one to start capturing your journey.
              </p>
            </div>

            <template v-else>
              <SpacesGrid
                v-if="viewMode === VIEW_MODE.GRID"
                :spaces="ownedSpaces"
                :loading="ownedLoading"
                :has-more="ownedHasMore"
                @create="openCreateSpace"
                @enter="enterSpace"
                @load-more="loadMoreOwned"
                @delete="handleDeleteSpace"
                @edit="openEditSpace"
              />

              <SpacesTable
                v-else-if="viewMode === VIEW_MODE.TABLE"
                :spaces="ownedSpaces"
                :meta="ownedMeta"
                :loading="ownedLoading"
                :sort-by="ownedQuery.sortBy"
                :sort-order="ownedQuery.sortOrder"
                @create="openCreateSpace"
                @enter="enterSpace"
                @update:options="updateOptionsOwned"
                @delete="handleDeleteSpace"
                @edit="openEditSpace"
              />
            </template>
          </div>
        </div>
      </div>

      <div
        v-show="activeTab === ACTIVE_TAB.MEMBER"
        class="space-y-6 flex flex-col mt-4"
      >
        <div class="flex flex-col sm:flex-row gap-6 items-start grow w-full">
          <!-- Left Collapsible Filter Panel -->
          <transition name="slide-fade">
            <SpaceFilters
              v-if="isFilterOpen"
              v-model:selected-type="joinedQuery.type"
              v-model:selected-visibility="joinedQuery.visibility"
              class="reveal-item"
              @close="isFilterOpen = false"
            />
          </transition>

          <!-- Right Content Container -->
          <div class="grow w-full space-y-6">
            <!-- Toolbar is placed at the top of the right container -->
            <SpaceToolbar
              v-model:search-query="joinedQuery.search"
              v-model:view-mode="viewMode"
              v-model:is-filter-open="isFilterOpen"
              v-model:sort-by="joinedQuery.sortBy"
              v-model:sort-order="joinedQuery.sortOrder"
              :active-filter-count="activeFilterCountJoined"
              class="reveal-item"
            />

            <!-- Loading state inside list container during search/filter refetching -->
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

            <!-- Empty state when active filters return 0 results -->
            <div
              v-else-if="joinedSpaces.length === 0 && isFilterJoined"
              class="py-20 flex flex-col items-center justify-center space-y-4 border border-border/40 rounded-2xl bg-surface/35 backdrop-blur-md shadow-xs animate-fade-in"
            >
              <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
              <h3 class="font-poetic text-2xl italic text-on-background">No joined sanctuaries found</h3>
              <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
                No joined sanctuaries match your active search or filters. Try adjusting them or click reset.
              </p>
            </div>

            <!-- Global Empty State when user has absolutely zero spaces -->
            <div
              v-else-if="joinedSpaces.length === 0"
              class="py-20 flex flex-col items-center justify-center space-y-4 border border-border/40 rounded-2xl bg-surface/35 backdrop-blur-md shadow-xs animate-fade-in"
            >
              <span class="material-symbols-outlined text-[48px]! text-secondary/30">photo_library</span>
              <h3 class="font-poetic text-2xl italic text-on-background">No joined sanctuaries found</h3>
              <p class="text-[13px] text-secondary max-w-xs text-center leading-relaxed">
                You haven't joined any sanctuaries yet. Request to join a space to start sharing memories.
              </p>
            </div>

            <template v-else>
              <SpacesGrid
                v-if="viewMode === VIEW_MODE.GRID"
                :spaces="joinedSpaces"
                :loading="joinedLoading"
                :has-more="joinedHasMore"
                :show-create-card="false"
                @create="openCreateSpace"
                @enter="enterSpace"
                @load-more="loadMoreJoined"
                @leave="handleLeaveSpace"
              />

              <SpacesTable
                v-else-if="viewMode === VIEW_MODE.TABLE"
                :spaces="joinedSpaces"
                :meta="joinedMeta"
                :loading="joinedLoading"
                :sort-by="joinedQuery.sortBy"
                :sort-order="joinedQuery.sortOrder"
                @create="openCreateSpace"
                @enter="enterSpace"
                @update:options="updateOptionsJoined"
                @leave="handleLeaveSpace"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Space Modal -->
    <CreateSpaceModal
      v-if="showCreateModal"
      :space="editingSpace || undefined"
      @close="closeCreateModal"
      @success="handleCreateSuccess"
    />

    <!-- Join Space Modal -->
    <JoinSpaceModal
      v-if="showJoinModal"
      @close="showJoinModal = false"
      @success="handleJoinSuccess"
    />

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-model="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :action-text="confirmDialog.actionText"
      :color="confirmDialog.color"
      @confirm="confirmDialog.onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import type { Space } from '~/features/spaces/spaces.type'
import { useSpaces } from '~/features/spaces/composables/useSpaces'
import { useSpaceQuery } from '~/features/spaces/composables/useSpaceQuery'
import CreateSpaceModal from '~/features/spaces/components/CreateSpaceModal.vue'
import JoinSpaceModal from '~/features/spaces/components/JoinSpaceModal.vue'
import SpacesTable from '~/features/spaces/components/SpacesTable.vue'
import SpacesGrid from '~/features/spaces/components/SpacesGrid.vue'
import SpaceFilters from '~/features/spaces/components/SpaceFilters.vue'
import SpaceToolbar from '~/features/spaces/components/SpaceToolbar.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useSpaces as useSpacesQueries } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import { ACTIVE_TAB, VIEW_MODE, VIEW_MODE_LIMIT } from '../spaces.constant'

const routes = useRoutes()
const queryClient = useQueryClient()
const authStore = useAuthStore()
const toast = useToast()
const { handleError } = useErrorHandler()
const { viewMode, activeTab } = useSpaces()
const { useList, useInfiniteList, useRemove, useRemoveMember } = useSpacesQueries()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const isFilterOpen = ref(false)

const {
  query: ownedQuery,
  activeFilterCount: activeFilterCountOwned,
  isFiltered: isFilterOwned,
  setPage: setPageOwned,
  setLimit: setLimitOwned,
} = useSpaceQuery(ACTIVE_TAB.OWNER, viewMode)

const {
  query: joinedQuery,
  activeFilterCount: activeFilterCountJoined,
  isFiltered: isFilterJoined,
  setPage: setPageJoined,
  setLimit: setLimitJoined,
} = useSpaceQuery(ACTIVE_TAB.MEMBER, viewMode)

const deleteMutation = useRemove()
const leaveMutation = useRemoveMember()

const { data: rawOwnedData, isPending: ownedTableLoading } = useList(ownedQuery, {
  enabled: computed(() => viewMode.value === VIEW_MODE.TABLE),
})

const {
  data: infiniteOwnedData,
  fetchNextPage: loadMoreOwned,
  hasNextPage: ownedHasMore,
  isFetching: ownedGridFetching,
} = useInfiniteList(ownedQuery, {
  enabled: computed(() => viewMode.value === VIEW_MODE.GRID),
})

const ownedLoading = computed(() => {
  return viewMode.value === VIEW_MODE.TABLE ? ownedTableLoading.value : ownedGridFetching.value
})

const DEFAULT_META_TABLE = { total: 0, page: 1, limit: VIEW_MODE_LIMIT.TABLE, totalPages: 0 }
const DEFAULT_META_GRID = { total: 0, page: 1, limit: VIEW_MODE_LIMIT.GRID, totalPages: 0 }

const ownedSpaces = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) return rawOwnedData.value?.items ?? []
  return infiniteOwnedData.value?.pages.flatMap(page => page.items) ?? []
})

const ownedMeta = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) return rawOwnedData.value?.meta ?? DEFAULT_META_TABLE
  const lastPage = infiniteOwnedData.value?.pages.at(-1)
  return lastPage?.meta ?? DEFAULT_META_GRID
})

const { data: rawJoinedData, isPending: joinedTableLoading } = useList(joinedQuery, {
  enabled: computed(() => viewMode.value === VIEW_MODE.TABLE),
})

const {
  data: infiniteJoinedData,
  fetchNextPage: loadMoreJoined,
  hasNextPage: joinedHasMore,
  isFetching: joinedGridFetching,
} = useInfiniteList(joinedQuery, {
  enabled: computed(() => viewMode.value === VIEW_MODE.GRID),
})

const joinedLoading = computed(() => {
  return viewMode.value === VIEW_MODE.TABLE ? joinedTableLoading.value : joinedGridFetching.value
})

const joinedSpaces = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) return rawJoinedData.value?.items ?? []
  return infiniteJoinedData.value?.pages.flatMap(page => page.items) ?? []
})

const joinedMeta = computed(() => {
  if (viewMode.value === VIEW_MODE.TABLE) return rawJoinedData.value?.meta ?? DEFAULT_META_TABLE
  const lastPage = infiniteJoinedData.value?.pages.at(-1)
  return lastPage?.meta ?? DEFAULT_META_GRID
})

const ownedCount = computed(() => ownedMeta.value.total)
const joinedCount = computed(() => joinedMeta.value.total)

const enterSpace = async (space: Space) => {
  await navigateTo(routes.spaceDetail(space.slug))
}

const editingSpace = ref<Space | null>(null)

const openCreateSpace = () => {
  editingSpace.value = null
  showCreateModal.value = true
}

const openEditSpace = (space: Space) => {
  editingSpace.value = space
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingSpace.value = null
}

const openJoinSpace = () => {
  showJoinModal.value = true
}

const handleCreateSuccess = (newSpace: Space) => {
  showCreateModal.value = false
  editingSpace.value = null
  queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
  queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
  enterSpace(newSpace)
}

const handleJoinSuccess = () => {
  showJoinModal.value = false
  queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
  queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
}

const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  actionText: '',
  color: 'primary',
  onConfirm: () => {},
})

const handleDeleteSpace = (space: Space) => {
  confirmDialog.value = {
    show: true,
    title: 'Delete Sanctuary',
    message: `Are you sure you want to delete the sanctuary "${space.name}"? This action cannot be undone.`,
    actionText: 'Delete',
    color: 'error',
    onConfirm: () => {
      confirmDialog.value.show = false
      deleteMutation.mutate(space.uuid, {
        onSuccess: () => {
          toast.success(`Sanctuary "${space.name}" has been deleted.`)
          queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
          queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
        },
        onError: err => {
          handleError(err)
        },
      })
    },
  }
}

const handleLeaveSpace = (space: Space) => {
  const userId = authStore.user?.id
  if (!userId) {
    toast.error('You must be logged in to leave a space.')
    return
  }

  confirmDialog.value = {
    show: true,
    title: 'Leave Sanctuary',
    message: `Are you sure you want to leave the sanctuary "${space.name}"?`,
    actionText: 'Leave',
    color: 'warning',
    onConfirm: () => {
      confirmDialog.value.show = false
      leaveMutation.mutate(
        { uuid: space.uuid, memberUserId: userId },
        {
          onSuccess: () => {
            toast.success(`You have left "${space.name}".`)
            queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
            queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
          },
          onError: err => {
            handleError(err)
          },
        },
      )
    },
  }
}

const updateOptionsOwned = (options: {
  page: number
  itemsPerPage: number
  sortBy: string | undefined
  sortOrder: 'asc' | 'desc' | undefined
}) => {
  if (ownedQuery.value.limit !== options.itemsPerPage) {
    setLimitOwned(options.itemsPerPage)
  } else {
    setPageOwned(options.page)
  }
  ownedQuery.value.sortBy = options.sortBy
  ownedQuery.value.sortOrder = options.sortOrder
}

const updateOptionsJoined = (options: {
  page: number
  itemsPerPage: number
  sortBy: string | undefined
  sortOrder: 'asc' | 'desc' | undefined
}) => {
  if (joinedQuery.value.limit !== options.itemsPerPage) {
    setLimitJoined(options.itemsPerPage)
  } else {
    setPageJoined(options.page)
  }
  joinedQuery.value.sortBy = options.sortBy
  joinedQuery.value.sortOrder = options.sortOrder
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (min-width: 640px) {
  .slide-fade-enter-active {
    transition:
      max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 260px;
    overflow: hidden;
  }

  .slide-fade-leave-active {
    transition:
      max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 260px;
    overflow: hidden;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    max-width: 0;
    opacity: 0;
    transform: translateX(-30px);
    margin-right: -24px;
  }
}
</style>
