<template>
  <div>
    <!-- Polaroid Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-8">
      <!-- Create Space Card at the start of grid -->
      <div
        class="reveal-item"
        style="animation-delay: 200ms"
      >
        <div
          class="polaroid !bg-surface text-on-surface cursor-pointer flex flex-col justify-between h-[320px] group"
          style="--rotation: -1.2deg"
          @click="$emit('create')"
        >
          <!-- Blueprint / Draft cover area -->
          <div class="aspect-[4/3] w-full bg-background relative border border-dashed border-border-strong/50 flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:bg-primary/5">
            <!-- Grid pattern -->
            <div class="absolute inset-0 opacity-[0.07] bg-[radial-gradient(var(--on-surface)_1px,transparent_1px)] [background-size:12px_12px]"></div>

            <div class="w-12 h-12 rounded-full border border-dashed border-secondary/30 flex items-center justify-center text-secondary/40 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300 relative z-10 bg-surface/50">
              <span class="material-symbols-outlined !text-[24px]">add</span>
            </div>
          </div>

          <!-- Label matching space cards -->
          <div class="pt-4 px-1 text-center space-y-1 pb-1">
            <p class="font-title text-xl font-bold tracking-tight text-secondary group-hover:text-primary transition-colors">
              New Sanctuary
            </p>
            <div class="flex justify-center items-center text-[11px] font-body text-secondary/45">
              <span class="font-poetic italic text-sm">Initiate a new vault</span>
            </div>
          </div>

          <!-- Dotted line to match members list area -->
          <div class="flex items-center justify-center pt-2 border-t border-dashed border-border/40 px-1 text-[10px] text-secondary/35 uppercase tracking-widest font-bold pb-1">
            Create Empty Draft
          </div>
        </div>
      </div>

      <!-- Active Space Items -->
      <div
        v-for="(space, index) in spaces"
        :key="space.uuid"
        class="reveal-item"
        :style="{ animationDelay: `${(index + 1) * 100 + 200}ms` }"
      >
        <div
          class="polaroid !bg-surface text-on-surface cursor-pointer flex flex-col justify-between h-[320px]"
          :style="{ '--rotation': `${getRotation(index)}deg` }"
          @click="$emit('enter', space)"
        >
          <!-- Cover image wrapper -->
          <div class="aspect-[4/3] w-full overflow-hidden bg-surface-variant relative border border-border/10">
            <img
              v-if="space.coverUrl || space.avatarUrl"
              :src="space.coverUrl || space.avatarUrl || ''"
              class="w-full h-full object-cover grayscale-[15%] sepia-[10%] hover:grayscale-0 hover:sepia-0 transition-all duration-500"
              alt="Space Cover"
            />
            <!-- Default warm background for spaces without cover -->
            <div
              v-else
              class="w-full h-full bg-gradient-to-tr from-secondary/10 via-primary/5 to-primary/10 flex items-center justify-center"
            >
              <span class="material-symbols-outlined !text-[40px] text-secondary/30">photo_album</span>
            </div>

            <!-- Type Badge -->
            <span
              class="absolute top-3 right-3 bg-surface/90 text-on-surface px-2.5 py-0.5 rounded text-[10px] uppercase font-body text-sm font-semibold tracking-wider border border-border shadow-sm"
            >
              {{ space.type }}
            </span>
          </div>

          <!-- Title & Date Info -->
          <div class="pt-4 px-1 text-left space-y-1">
            <p class="font-title text-xl font-bold tracking-tight text-on-surface truncate">
              {{ space.name }}
            </p>
            <div class="flex justify-between items-center text-[11px] font-body text-secondary/60">
              <span class="font-poetic italic text-sm">Created {{ formatDate(space.createdAt) }}</span>
            </div>
          </div>

          <!-- Space Members Avatars (stacked) -->
          <div class="flex items-center justify-between pt-2 border-t border-border/30 px-1">
            <div class="flex -space-x-1.5 overflow-hidden">
              <div
                v-for="member in space.members?.slice(0, 4)"
                :key="member.id"
                class="inline-block h-5 w-5 rounded-full ring-2 ring-surface bg-secondary text-on-secondary flex items-center justify-center font-bold text-[8px] uppercase"
              >
                {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
              </div>
              <div
                v-if="space.members?.length > 4"
                class="inline-block h-5 w-5 rounded-full ring-2 ring-surface bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-[8px]"
              >
                +{{ space.members.length - 4 }}
              </div>
            </div>
            <span class="text-[10px] text-secondary/60"> {{ space.members?.length || 0 }} Members </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Infinite Scroll Trigger Element -->
    <div
      ref="infiniteScrollTrigger"
      class="h-10 w-full flex items-center justify-center py-6"
    >
      <v-progress-circular
        v-if="loading && spaces.length > 0"
        indeterminate
        color="primary"
        size="28"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Space } from '~/types/space'

const props = defineProps<{
  spaces: Space[]
  loading: boolean
  hasMore: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'enter', space: Space): void
  (e: 'load-more'): void
}>()

// Infinite Scroll intersection observer logic
const infiniteScrollTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (process.client && !observer) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && props.hasMore && !props.loading) {
        emit('load-more')
      }
    }, { threshold: 0.1 })
  }

  if (observer && infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value)
  }
}

const destroyObserver = () => {
  if (observer) {
    observer.disconnect()
  }
}

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  destroyObserver()
})

watch(infiniteScrollTrigger, (newEl) => {
  if (observer) {
    observer.disconnect()
    if (newEl) {
      observer.observe(newEl)
    }
  }
})

// Safe rotation angles to prevent random jumps during Vue re-renders
const predefinedRotations = [-2.5, 1.8, -1.2, 2.3, -2.0, 1.5, -0.8, 2.7]
const getRotation = (index: number) => {
  return predefinedRotations[index % predefinedRotations.length]
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}
</script>
