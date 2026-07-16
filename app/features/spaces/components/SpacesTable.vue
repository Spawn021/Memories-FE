<template>
  <div class="space-y-6 mt-4">
    <AppDataTable
      max-height="calc(100vh - 380px)"
      :headers="headers"
      :items="spaces"
      :loading="loading"
      :meta="meta"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @row-click="$emit('enter', $event)"
      @update:options="$emit('update:options', $event)"
    >
      <!-- Custom slots for cell contents -->
      <template #item.name="{ item: space }">
        <div class="flex items-center gap-3.5">
          <!-- Cover image thumbnail -->
          <div class="w-10 h-7 rounded overflow-hidden bg-surface-variant border border-border/20 shrink-0">
            <img
              v-if="space.coverUrl || space.avatarUrl"
              :src="space.coverUrl || space.avatarUrl || ''"
              class="w-full h-full object-cover grayscale-15 sepia-10 group-hover/row:grayscale-0 group-hover/row:sepia-0 transition-all duration-300"
              alt="Cover"
            />
            <div
              v-else
              class="w-full h-full bg-linear-to-tr from-secondary/10 via-primary/5 to-primary/10 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-xs! text-secondary/30">photo_album</span>
            </div>
          </div>
          <div class="overflow-hidden">
            <p class="font-title text-sm font-bold text-on-surface truncate group-hover/row:text-primary transition-colors">
              {{ space.name }}
            </p>
          </div>
        </div>
      </template>

      <template #item.type="{ item: space }">
        <span class="bg-background border border-border text-secondary/80 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
          {{ space.type }}
        </span>
      </template>

      <template #item.createdAt="{ item: space }">
        <span class="font-poetic italic text-[13px] text-secondary/70">
          {{ formatDate(space.createdAt) }}
        </span>
      </template>

      <template #item.members="{ item: space }">
        <div
          class="flex items-center gap-2"
          @click.stop
        >
          <div class="flex -space-x-1.5 overflow-hidden">
            <div
              v-for="member in space.members?.slice(0, 3)"
              :key="member.id"
              class="h-5 w-5 rounded-full ring-2 ring-surface bg-secondary text-on-secondary flex items-center justify-center font-bold text-[8px] uppercase"
            >
              {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
            </div>
            <div
              v-if="space.members?.length > 3"
              class="h-5 w-5 rounded-full ring-2 ring-surface bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-[8px]"
            >
              +{{ space.members.length - 3 }}
            </div>
          </div>
          <span class="text-[11px] text-secondary/60"> {{ space.members?.length || 0 }} Active </span>
        </div>
      </template>

      <template #item.action="{ item: space }">
        <div class="inline-flex items-center w-full gap-2">
          <template v-if="isSpaceOwner(space)">
            <v-btn
              icon
              variant="plain"
              class="w-5! h-5! min-w-0!"
              title="Edit Sanctuary"
              :ripple="false"
              @click="handleEdit(space, $event)"
            >
              <span class="material-symbols-outlined text-[20px]! text-on-surface!">edit</span>
            </v-btn>
            <v-btn
              icon
              variant="plain"
              class="w-5! h-5!! min-w-0!"
              :ripple="false"
              title="Delete Sanctuary"
              @click="handleDelete(space, $event)"
            >
              <span class="material-symbols-outlined text-[20px]! text-primary!">delete</span>
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              icon
              variant="plain"
              class="w-5! h-5!! min-w-0!"
              :ripple="false"
              title="Leave Sanctuary"
              @click="handleLeave(space, $event)"
            >
              <span class="material-symbols-outlined text-[20px]! text-warning">logout</span>
            </v-btn>
          </template>
        </div>
      </template>
    </AppDataTable>
  </div>
</template>

<script setup lang="ts">
import type { Space } from '~/features/spaces/spaces.type'
import type { PaginationMeta } from '~/types'
import { useAuthStore } from '~/stores/auth'
import AppDataTable, { type TableHeader, type TableOptions } from '~/components/common/AppDataTable.vue'

defineProps<{
  spaces: Space[]
  meta: PaginationMeta
  loading: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'enter', space: Space): void
  (e: 'update:options', options: TableOptions): void
  (e: 'delete', space: Space): void
  (e: 'leave', space: Space): void
  (e: 'edit', space: Space): void
}>()

const authStore = useAuthStore()

const headers: TableHeader[] = [
  { key: 'name', label: 'Sanctuary', sortable: true },
  { key: 'type', label: 'Vault Type', sortable: true },
  { key: 'createdAt', label: 'Created Date', sortable: true },
  { key: 'members', label: 'Members', sortable: false },
  { key: 'action', label: 'Action', sortable: false, width: 120 },
]

const isSpaceOwner = (space: Space) => {
  return String(space.ownerId) === String(authStore.user?.id)
}

const handleEdit = (space: Space, e: MouseEvent) => {
  e.stopPropagation()
  emit('edit', space)
}

const handleDelete = (space: Space, e: MouseEvent) => {
  e.stopPropagation()
  emit('delete', space)
}

const handleLeave = (space: Space, e: MouseEvent) => {
  e.stopPropagation()
  emit('leave', space)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(dateStr))
}
</script>

<style scoped>
:deep(.v-btn--variant-plain) {
  opacity: 1 !important;
}
</style>
