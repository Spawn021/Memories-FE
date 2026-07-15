<template>
  <div
    class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background backdrop-blur-md -mt-3 pt-3 pb-3 -mb-1 sm:sticky top-18 z-10"
  >
    <v-text-field
      label="Search"
      density="compact"
      hide-details="auto"
      variant="outlined"
      placeholder="Search sanctuaries..."
      clearable
      rounded="xl"
      class="w-full! sm:max-w-md!"
      :model-value="searchQuery"
      @update:model-value="$emit('update:searchQuery', $event || '')"
    >
      <template #prepend-inner>
        <span class="material-symbols-outlined text-primary">search</span>
      </template>
    </v-text-field>
    <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
      <!-- Sort Menu -->
      <v-menu
        transition="slide-y-transition"
        location="bottom end"
      >
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            rounded="lg"
            variant="outlined"
            density="comfortable"
            class="border-border-strong! h-10! text-xs font-title font-bold tracking-widest px-3!"
          >
            <span class="material-symbols-outlined text-[18px]! mr-1.5 text-secondary">sort</span>
            <span class="text-secondary/80 font-body text-xs capitalize mr-1">Sắp xếp:</span>
            <span class="text-primary font-bold">{{ selectedSortLabel }}</span>
          </v-btn>
        </template>
        <v-list
          density="compact"
          class="text-[12px]! mt-1 py-0 min-w-45"
        >
          <v-list-item
            v-for="option in sortOptions"
            :key="option.id"
            :value="option.id"
            class="border-b last:border-b-0 cursor-pointer"
            @click="selectSort(option)"
          >
            <template #prepend>
              <span
                class="material-symbols-outlined text-base! mr-2"
                :class="sortBy === option.sortBy && sortOrder === option.sortOrder ? 'text-primary' : 'text-secondary/60'"
              >
                {{ option.icon }}
              </span>
            </template>
            <v-list-item-title
              class="font-semibold text-xs"
              :class="sortBy === option.sortBy && sortOrder === option.sortOrder ? 'text-primary' : 'text-secondary'"
            >
              {{ option.label }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-badge
        :model-value="activeFilterCount > 0"
        floating
        location="top right"
        :offset-x="8"
        :offset-y="8"
        color="primary"
        :content="activeFilterCount > 0 ? activeFilterCount : ''"
        class="custom-filter-badge"
      >
        <v-btn
          rounded="lg"
          variant="outlined"
          density="comfortable"
          icon
          :color="isFilterOpen ? 'primary' : 'default'"
          class="border-border-strong! h-10! w-10!"
          @click="$emit('update:isFilterOpen', !isFilterOpen)"
        >
          <span class="material-symbols-outlined text-xl!"> tune </span>
        </v-btn>
      </v-badge>

      <v-btn-toggle
        :model-value="viewMode"
        color="primary"
        rounded="lg"
        border
        mandatory
        density="comfortable"
        @update:model-value="$emit('update:viewMode', $event as ViewMode)"
      >
        <v-btn
          :value="VIEW_MODE.GRID"
          icon
          title="Grid View"
        >
          <span class="material-symbols-outlined text-base!">grid_view</span>
        </v-btn>
        <v-btn
          :value="VIEW_MODE.TABLE"
          icon
          title="Table View"
        >
          <span class="material-symbols-outlined text-base!">table_rows</span>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIEW_MODE } from '../spaces.constant'
import type { ViewMode } from '../spaces.type'

const props = withDefaults(
  defineProps<{
    searchQuery: string
    viewMode: ViewMode
    isFilterOpen: boolean
    activeFilterCount: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }>(),
  {
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },
)

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:viewMode', val: ViewMode): void
  (e: 'update:isFilterOpen', val: boolean): void
  (e: 'update:sortBy', val: string): void
  (e: 'update:sortOrder', val: 'asc' | 'desc'): void
}>()

interface SortOption {
  id: string
  label: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  icon: string
}

const sortOptions: SortOption[] = [
  { id: 'updated_desc', label: 'Cập nhật gần nhất', sortBy: 'updatedAt', sortOrder: 'desc', icon: 'update' },
  { id: 'updated_asc', label: 'Cập nhật cũ nhất', sortBy: 'updatedAt', sortOrder: 'asc', icon: 'history' },
  { id: 'created_desc', label: 'Mới tạo', sortBy: 'createdAt', sortOrder: 'desc', icon: 'new_releases' },
  { id: 'name_asc', label: 'Tên A-Z', sortBy: 'name', sortOrder: 'asc', icon: 'sort_by_alpha' },
  { id: 'name_desc', label: 'Tên Z-A', sortBy: 'name', sortOrder: 'desc', icon: 'sort_by_alpha' },
]

const selectedSortLabel = computed(() => {
  const option = sortOptions.find(opt => opt.sortBy === props.sortBy && opt.sortOrder === props.sortOrder)
  return option ? option.label : 'Sắp xếp'
})

const selectSort = (option: SortOption) => {
  emit('update:sortBy', option.sortBy)
  emit('update:sortOrder', option.sortOrder)
}
</script>

<style scoped>
.custom-filter-badge :deep(.v-badge__badge) {
  background-color: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 10px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: none !important;
}
</style>
