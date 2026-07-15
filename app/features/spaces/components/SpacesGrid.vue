<template>
  <v-infinite-scroll
    :disabled="!hasMore || loading"
    @load="onLoad"
  >
    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-4 mt-4">
      <div
        v-if="showCreateCard"
        class="reveal-item group cursor-pointer"
        @click="$emit('create')"
      >
        <div
          class="relative h-85 rounded-xl border border-dashed border-border-strong/40 bg-surface flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:bg-primary/3 hover:shadow-lg"
        >
          <div
            class="absolute inset-0 opacity-[0.035] bg-[radial-gradient(var(--on-surface)_1px,transparent_1px)] bg-size-[18px_18px] pointer-events-none"
          />

          <div
            class="relative z-10 w-14 h-14 rounded-full border border-dashed border-secondary/25 flex items-center justify-center text-secondary/40 group-hover:border-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-400 bg-background"
          >
            <span class="material-symbols-outlined text-[26px]! text-primary/50">add</span>
          </div>

          <div class="relative z-10 text-center space-y-1 px-6">
            <p class="font-title text-lg font-bold tracking-tight text-secondary group-hover:text-primary transition-colors duration-300">
              New Sanctuary
            </p>
            <p class="font-poetic italic text-sm text-secondary/50">Initiate a new vault</p>
          </div>

          <div class="absolute bottom-0 inset-x-0 py-3 border-t border-dashed border-border/30 flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[13px]! text-secondary/30 group-hover:text-primary/50 transition-colors">
              draft
            </span>
            <span class="text-[10px] uppercase tracking-widest font-bold text-secondary/30 group-hover:text-primary/50 transition-colors">
              Create Empty Draft
            </span>
          </div>
        </div>
      </div>

      <div
        v-for="(space, index) in spaces"
        :key="space.uuid"
        class="reveal-item group cursor-pointer"
        :style="{ animationDelay: `${(index + (showCreateCard ? 1 : 0)) * 80 + 100}ms` }"
        @click="$emit('enter', space)"
      >
        <div
          class="relative h-85 rounded-xl overflow-hidden bg-surface border border-border/30 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:border-border-strong/40"
          :class="{
            '-translate-y-1.5 shadow-xl border-border-strong/40': menuOpenStates[space.uuid],
          }"
        >
          <div class="absolute inset-0">
            <img
              v-if="space.coverUrl || space.avatarUrl"
              :src="space.coverUrl || space.avatarUrl || ''"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              :class="{ 'scale-105': menuOpenStates[space.uuid] }"
              alt="Space Cover"
            />
            <!-- Fallback gradient -->
            <div
              v-else
              class="w-full h-full"
              :style="{ background: getCoverGradient(index) }"
            >
              <div class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[56px]! opacity-20 text-on-surface">photo_album</span>
              </div>
            </div>

            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          </div>

          <div class="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            <span
              class="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-widest bg-surface/80 text-on-surface border border-border/40 backdrop-blur-sm shadow-sm"
            >
              {{ space.type }}
            </span>
            <div class="flex items-center gap-1.5">
              <span
                class="w-6 h-6 rounded-full bg-surface/70 backdrop-blur-sm border border-border/30 flex items-center justify-center shadow-sm"
              >
                <span class="material-symbols-outlined text-[13px]! text-secondary">
                  {{ space.visibility === 'PUBLIC' ? 'public' : 'lock' }}
                </span>
              </span>

              <!-- Actions Dropdown -->
              <v-menu
                v-model="menuOpenStates[space.uuid]"
                :close-on-content-click="false"
                transition="slide-y-transition"
                location="bottom end"
              >
                <template #activator="{ props: menuProps }">
                  <v-tooltip
                    location="top left"
                    offset="1 -5"
                  >
                    <template #activator="{ props: tooltip }">
                      <button
                        v-bind="{ ...menuProps, ...tooltip }"
                        class="w-6 h-6 rounded-full bg-surface/70 hover:bg-surface border border-border/30 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                        @click.stop
                      >
                        <span class="material-symbols-outlined text-[14px]! text-secondary">more_vert</span>
                      </button>
                    </template>
                    <span>Actions</span>
                  </v-tooltip>
                </template>
                <v-list
                  density="compact"
                  class="text-[12px]! mt-1 py-0"
                >
                  <v-list-item
                    v-if="isSpaceOwner(space)"
                    value="edit"
                    class="border-b"
                    @click.stop="handleEdit(space)"
                  >
                    <template #prepend>
                      <span class="material-symbols-outlined text-base! mr-2 text-secondary">edit</span>
                    </template>
                    <span class="text-secondary font-semibold">Edit Sanctuary</span>
                  </v-list-item>
                  <v-list-item
                    v-if="isSpaceOwner(space)"
                    value="delete"
                    @click.stop="handleDelete(space)"
                  >
                    <template #prepend>
                      <span class="material-symbols-outlined text-base! mr-2 text-error">delete</span>
                    </template>
                    <span class="text-error font-semibold">Delete Sanctuary</span>
                  </v-list-item>
                  <v-list-item
                    v-else
                    value="leave"
                    @click.stop="handleLeave(space)"
                  >
                    <template #prepend>
                      <span class="material-symbols-outlined text-sm! mr-2 text-warning">logout</span>
                    </template>
                    <span class="text-warning font-semibold">Leave Sanctuary</span>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>

          <div class="absolute bottom-0 inset-x-0 p-4 z-10">
            <p class="font-title text-base font-bold tracking-tight text-white truncate drop-shadow">{{ space.name }}</p>

            <div class="flex items-center justify-between mt-2.5">
              <!-- Member avatars -->
              <div class="flex items-center gap-2">
                <div class="flex -space-x-1.5">
                  <div
                    v-for="member in space.members?.slice(0, 4)"
                    :key="member.id"
                    class="w-5 h-5 rounded-full ring-1 ring-white/30 bg-secondary/80 text-white flex items-center justify-center font-bold text-[8px] uppercase"
                  >
                    {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
                  </div>
                  <div
                    v-if="(space.members?.length ?? 0) > 4"
                    class="w-5 h-5 rounded-full ring-1 ring-white/30 bg-surface-variant/80 text-white flex items-center justify-center font-bold text-[8px]"
                  >
                    +{{ space.members.length - 4 }}
                  </div>
                </div>
                <span class="text-[10px] text-white/60 font-medium">{{ space.members?.length || 0 }} members</span>
              </div>

              <!-- Date -->
              <span class="font-poetic italic text-[11px] text-white/50">{{ formatDate(space.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #loading>
      <div class="flex justify-center py-6">
        <v-progress-circular
          indeterminate
          color="primary"
          size="28"
        />
      </div>
    </template>

    <template #empty>
      <span />
    </template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import type { Space } from '~/features/spaces/spaces.type'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(
  defineProps<{
    spaces: Space[]
    loading: boolean
    hasMore: boolean
    showCreateCard?: boolean
  }>(),
  {
    showCreateCard: true,
  },
)

const { showCreateCard } = toRefs(props)
const authStore = useAuthStore()

const menuOpenStates = ref<Record<string, boolean>>({})

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'enter', space: Space): void
  (e: 'load-more'): void
  (e: 'delete', space: Space): void
  (e: 'leave', space: Space): void
  (e: 'edit', space: Space): void
}>()

const isSpaceOwner = (space: Space) => {
  return String(space.ownerId) === String(authStore.user?.id)
}

const handleEdit = (space: Space) => {
  menuOpenStates.value[space.uuid] = false
  emit('edit', space)
}

const handleDelete = (space: Space) => {
  menuOpenStates.value[space.uuid] = false
  emit('delete', space)
}

const handleLeave = (space: Space) => {
  menuOpenStates.value[space.uuid] = false
  emit('leave', space)
}

const onLoad = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  if (!props.hasMore || props.loading) {
    done('empty')
    return
  }
  emit('load-more')
  done('ok')
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #e8d5c4 0%, #c9b5a4 100%)',
  'linear-gradient(135deg, #c4d5c8 0%, #a4b5a8 100%)',
  'linear-gradient(135deg, #d4c8e0 0%, #b4a8c0 100%)',
  'linear-gradient(135deg, #e0d4c4 0%, #c0b4a4 100%)',
  'linear-gradient(135deg, #c8d8e4 0%, #a8b8c4 100%)',
  'linear-gradient(135deg, #e4d0c8 0%, #c4b0a8 100%)',
]
const getCoverGradient = (index: number) => COVER_GRADIENTS[index % COVER_GRADIENTS.length]

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(dateStr))
}
</script>
