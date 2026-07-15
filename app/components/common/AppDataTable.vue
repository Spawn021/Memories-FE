<template>
  <div
    :class="[
      'relative w-full border border-border/50 rounded-2xl bg-surface/35 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md select-none',
      tableClass,
    ]"
  >
    <div
      v-if="$slots.toolbar"
      class="flex flex-col sm:flex-row gap-3.5 p-4 border-b border-border/45 bg-background/10 items-center justify-between select-none"
    >
      <slot name="toolbar" />
    </div>

    <v-table
      class="custom-app-table bg-transparent"
      hover
      fixed-header
    >
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="[
              'h-12 py-3 px-4 uppercase ',
              header.sortable ? 'cursor-pointer hover:text-on-surface' : '',
              header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left',
              header.thClass,
            ]"
            :style="header.width ? { width: typeof header.width === 'number' ? `${header.width}px` : header.width } : {}"
            @click="header.sortable && handleHeaderClick(header.key)"
          >
            <div
              class="flex items-center gap-1.5"
              :class="header.align === 'right' ? 'justify-end' : header.align === 'center' ? 'justify-center' : ''"
            >
              <span class="text">{{ header.label }}</span>
              <span
                v-if="header.sortable"
                class="material-symbols-outlined text-sm! text-primary hover:text-on-surface transition-colors"
              >
                {{ getSortIcon(header.key) }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading Skeletons -->
        <template v-if="loading">
          <tr
            v-for="i in skeletonCount"
            :key="`skeleton-${i}`"
            class="h-16"
          >
            <td
              v-for="header in headers"
              :key="`skeleton-col-${header.key}`"
              class="py-4 px-4"
            >
              <div class="animate-pulse bg-secondary/10 h-5 w-3/4 rounded-lg"></div>
            </td>
          </tr>
        </template>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0">
          <td
            :colspan="headers.length"
            class="py-16 text-center"
          >
            <slot name="empty">
              <span class="material-symbols-outlined text-[36px]! text-secondary/35">folder_open</span>
              <p class="font-title text-sm font-bold text-secondary/70 mt-2">No items found</p>
              <p class="font-body text-[11px] text-secondary/40 mt-1">There are no records to display.</p>
            </slot>
          </td>
        </tr>

        <!-- Data Rows -->
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.uuid || item.id || index"
            class="h-16 hover:bg-surface/50 border-b border-border/10 transition-colors duration-200 cursor-pointer group/row"
            @click="$emit('row-click', item)"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              :class="[
                'py-3.5 px-4 text-[13px] text-on-surface',
                header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left',
                header.class,
              ]"
            >
              <slot
                :name="`item.${header.key}`"
                :item="item"
              >
                {{ item[header.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>

    <div
      v-if="!hideDefaultFooter && meta && (meta.totalPages > 1 || meta.total > 0)"
      class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-border/40 select-none bg-background/25"
    >
      <!-- Items per page selector & range details -->
      <div class="flex items-center gap-4 text-[11px] text-secondary/70 w-full sm:w-auto justify-between sm:justify-start">
        <div class="flex items-center gap-2">
          <span>Items per page:</span>
          <v-menu location="bottom start">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="outlined"
                density="comfortable"
              >
                <div class="flex items-center justify-between w-full gap-2">
                  <span>{{ meta.limit }}</span>
                  <span class="material-symbols-outlined text-xs! text-secondary/40"> keyboard_arrow_down </span>
                </div>
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="limit in itemsPerPageOptions"
                :key="limit"
                :value="limit"
                :active="meta.limit === limit"
                color="primary"
                @click="handleLimitChange(limit)"
              >
                <v-list-item-title class="font-bold text-[11px] text-secondary">{{ limit }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <span class="font-medium">Showing {{ startItem }} - {{ endItem }} of {{ meta.total }}</span>
      </div>

      <!-- Pagination using Vuetify V-Pagination -->
      <v-pagination
        v-if="meta.totalPages >= 1"
        :model-value="meta.page"
        :length="meta.totalPages"
        :total-visible="5"
        active-color="primary"
        density="comfortable"
        variant="flat"
        class="w-full sm:w-auto"
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_LIMIT_TABLE, DEFAULT_PAGE_OPTIONS, DEFAULT_PAGE_TABLE, SORT_DIRECTIONS } from '~/constants'
import type { ALIGN_HEADER_TABLE, SortDirection } from '~/types'

export interface TableHeader {
  key: string
  label: string
  align?: ALIGN_HEADER_TABLE
  class?: string
  thClass?: string
  sortable?: boolean
  width?: string | number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TableOptions {
  page: number
  itemsPerPage: number
  sortBy: string | undefined
  sortOrder: SortDirection | undefined
}

const props = withDefaults(
  defineProps<{
    headers: TableHeader[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[]
    loading?: boolean
    skeletonCount?: number
    meta?: PaginationMeta
    sortBy?: string
    sortOrder?: SortDirection
    tableClass?: string
    itemsPerPageOptions?: number[]
    maxHeight?: string | number
    hideDefaultFooter?: boolean
  }>(),
  {
    loading: false,
    skeletonCount: 3,
    meta: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    tableClass: '',
    itemsPerPageOptions: () => DEFAULT_PAGE_OPTIONS,
    maxHeight: undefined,
    hideDefaultFooter: false,
  },
)

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'row-click', item: any): void
  (e: 'update:options', options: TableOptions): void
}>()

const handleHeaderClick = (colKey: string) => {
  let newOrder: SortDirection = SORT_DIRECTIONS.ASC
  if (props.sortBy === colKey) {
    newOrder = props.sortOrder === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC
  }

  emit('update:options', {
    page: props.meta?.page || DEFAULT_PAGE_TABLE,
    itemsPerPage: props.meta?.limit || DEFAULT_LIMIT_TABLE,
    sortBy: colKey,
    sortOrder: newOrder,
  })
}

const handlePageChange = (newPage: number) => {
  emit('update:options', {
    page: newPage,
    itemsPerPage: props.meta?.limit || DEFAULT_LIMIT_TABLE,
    sortBy: props.sortBy,
    sortOrder: props.sortOrder,
  })
}

const handleLimitChange = (newLimit: number) => {
  emit('update:options', {
    page: DEFAULT_PAGE_TABLE,
    itemsPerPage: newLimit,
    sortBy: props.sortBy,
    sortOrder: props.sortOrder,
  })
}

const getSortIcon = (colKey: string) => {
  if (props.sortBy === colKey) {
    return props.sortOrder === SORT_DIRECTIONS.ASC ? 'arrow_upward' : 'arrow_downward'
  }
  return 'unfold_more'
}

const startItem = computed(() => {
  if (!props.meta || props.meta.total === 0) return 0
  return (props.meta.page - 1) * props.meta.limit + 1
})

const endItem = computed(() => {
  if (!props.meta) return 0
  return Math.min(props.meta.page * props.meta.limit, props.meta.total)
})

const computedMaxHeight = computed(() => {
  if (!props.maxHeight) return 'none'
  return typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
})
</script>

<style scoped>
.custom-app-table :deep(tbody tr:last-child) {
  border-bottom: none !important;
}

.custom-app-table :deep(tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-on-surface), 0.1) !important;
}

.custom-app-table,
.custom-app-table :deep(.v-table__wrapper) {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

.custom-app-table:last-child,
.custom-app-table:last-child :deep(.v-table__wrapper) {
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

.custom-app-table :deep(.v-table__wrapper) {
  height: auto !important;
  max-height: v-bind(computedMaxHeight) !important;
  overflow-y: auto;
}

.custom-app-table :deep(.v-table__wrapper)::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-app-table :deep(.v-table__wrapper)::-webkit-scrollbar-track {
  background: transparent;
}
.custom-app-table :deep(.v-table__wrapper)::-webkit-scrollbar-thumb {
  background-color: var(--border-strong);
  border-radius: 9px;
}
.custom-app-table :deep(.v-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary);
}

.custom-app-table :deep(thead th) {
  background-color: rgb(var(--v-theme-surface)) !important;
}
</style>
