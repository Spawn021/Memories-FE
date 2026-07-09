<template>
  <div class="space-y-6">
    <!-- Table View -->
    <v-table
      class="border border-border rounded-md bg-surface/20 backdrop-blur-sm select-none custom-v-table reveal-item"
      hover
    >
      <thead>
        <tr>
          <th class="text-left">Sanctuary</th>
          <th class="text-left">Vault Type</th>
          <th class="text-left">Created Date</th>
          <th class="text-left">Members</th>
          <th class="text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Special draft card row in table view -->
        <tr
          class="hover:bg-primary/5 transition-colors cursor-pointer group/row"
          @click="$emit('create')"
        >
          <td class="py-3 px-6 flex items-center gap-3.5 border-none h-full">
            <div class="w-10 h-7 rounded border border-dashed border-primary/30 flex items-center justify-center bg-background/50 group-hover/row:border-primary transition-colors shrink-0">
              <span class="material-symbols-outlined !text-[16px] text-primary/60 group-hover/row:text-primary">add</span>
            </div>
            <div>
              <p class="font-title text-sm font-bold text-primary group-hover/row:text-primary-hover">New Sanctuary</p>
              <p class="text-[10px] text-secondary/40 font-poetic italic leading-tight mt-0.5">Draft a new memory vault</p>
            </div>
          </td>
          <td>
            <span class="bg-surface/50 border border-dashed border-primary/20 text-secondary/50 text-[9px] font-bold px-2 py-0.5 rounded uppercase">DRAFT</span>
          </td>
          <td class="text-[12px] text-secondary/30 italic font-poetic">
            --
          </td>
          <td class="text-[12px] text-secondary/30 italic">
            --
          </td>
          <td class="text-right">
            <div class="inline-flex justify-end w-full pr-2">
              <span class="material-symbols-outlined !text-[16px] text-secondary/30 group-hover/row:text-primary transition-colors">add</span>
            </div>
          </td>
        </tr>

        <!-- Actual Spaces rows -->
        <tr
          v-for="space in spaces"
          :key="space.uuid"
          class="hover:bg-surface/40 transition-colors cursor-pointer group/row"
          @click="$emit('enter', space)"
        >
          <td>
            <div class="flex items-center gap-3.5">
              <!-- Cover image thumbnail -->
              <div class="w-10 h-7 rounded overflow-hidden bg-surface-variant border border-border/20 shrink-0">
                <img
                  v-if="space.coverUrl || space.avatarUrl"
                  :src="space.coverUrl || space.avatarUrl || ''"
                  class="w-full h-full object-cover grayscale-[15%] sepia-[10%] group-hover/row:grayscale-0 group-hover/row:sepia-0 transition-all duration-300"
                  alt="Cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-tr from-secondary/10 via-primary/5 to-primary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined !text-[12px] text-secondary/30">photo_album</span>
                </div>
              </div>
              <div class="overflow-hidden">
                <p class="font-title text-sm font-bold text-on-surface truncate group-hover/row:text-primary transition-colors">{{ space.name }}</p>
              </div>
            </div>
          </td>
          <td>
            <span class="bg-background border border-border text-secondary/80 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
              {{ space.type }}
            </span>
          </td>
          <td class="font-poetic italic text-[13px] text-secondary/70">
            {{ formatDate(space.createdAt) }}
          </td>
          <td>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5 overflow-hidden">
                <div
                  v-for="member in space.members?.slice(0, 3)"
                  :key="member.id"
                  class="inline-block h-5 w-5 rounded-full ring-2 ring-surface bg-secondary text-on-secondary flex items-center justify-center font-bold text-[8px] uppercase"
                >
                  {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
                </div>
                <div
                  v-if="space.members?.length > 3"
                  class="inline-block h-5 w-5 rounded-full ring-2 ring-surface bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-[8px]"
                >
                  +{{ space.members.length - 3 }}
                </div>
              </div>
              <span class="text-[11px] text-secondary/60">
                {{ space.members?.length || 0 }} Active
              </span>
            </div>
          </td>
          <td class="text-right">
            <div class="inline-flex justify-end w-full pr-2">
              <button class="w-8 h-8 rounded-full border border-border hover:border-primary/30 flex items-center justify-center text-secondary hover:text-primary hover:bg-background transition-colors">
                <span class="material-symbols-outlined !text-[16px]">arrow_forward</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Pagination bar using Vuetify V-Pagination -->
    <div
      v-if="meta.totalPages > 1"
      class="pt-6"
    >
      <v-pagination
        :model-value="meta.page"
        :length="meta.totalPages"
        :total-visible="5"
        active-color="primary"
        density="comfortable"
        variant="flat"
        class="custom-v-pagination"
        @update:model-value="goToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Space } from '~/types/space'
import type { PaginationMeta } from '~/types'

defineProps<{
  spaces: Space[]
  meta: PaginationMeta
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'enter', space: Space): void
  (e: 'change-page', page: number): void
}>()

const goToPage = (page: number) => {
  emit('change-page', page)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}
</script>

<style scoped>
.custom-v-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-v-table :deep(.v-table__wrapper) {
  background: transparent !important;
}

.custom-v-table :deep(table) {
  width: 100% !important;
}

.custom-v-table :deep(tr) {
  background: transparent !important;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05)) !important;
}

.custom-v-table :deep(th) {
  height: 52px !important;
  border-bottom: 1px solid var(--border) !important;
  font-size: 11px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.15em !important;
  font-weight: 700 !important;
  color: var(--secondary) !important;
  opacity: 0.6;
}

.custom-v-table :deep(td) {
  height: 68px !important;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05)) !important;
  color: var(--on-surface) !important;
  font-size: 13px !important;
}

.custom-v-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

.custom-v-pagination :deep(.v-btn) {
  border-radius: var(--radius-md) !important;
  font-family: var(--font-body) !important;
  font-weight: 700 !important;
  font-size: 12px !important;
}

.custom-v-pagination :deep(.v-pagination__list) {
  justify-content: center !important;
}
</style>
