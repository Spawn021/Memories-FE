<template>
  <div class="w-full sm:w-65 shrink-0 space-y-4 sm:sticky sm:top-21">
    <!-- Filter Card Container -->
    <div class="border border-border/50 rounded-2xl bg-surface/35 backdrop-blur-md p-5 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/30">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary/60 text-lg!">tune</span>
          <span class="font-title text-[13px] font-bold uppercase tracking-wider text-on-surface">Filters</span>
          <span
            v-if="activeFilterCount > 0"
            class="flex items-center justify-center min-w-4 h-4 px-1.5 rounded-full bg-primary/15 text-primary text-[9px] font-title font-bold"
          >
            {{ activeFilterCount }}
          </span>
        </div>
        <button
          class="flex items-center justify-center w-6 h-6 rounded-lg text-secondary/60 hover:text-on-surface hover:bg-surface/50 transition-all duration-200 cursor-pointer"
          title="Close filters"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined text-lg!">close</span>
        </button>
      </div>

      <!-- Section: Sanctuary Type -->
      <div class="space-y-2">
        <button
          class="flex items-center justify-between w-full text-left font-title text-[11px] font-bold uppercase tracking-widest text-secondary/70 hover:text-on-surface transition-colors py-1 cursor-pointer"
          @click="isTypeExpanded = !isTypeExpanded"
        >
          <span>Sanctuary Type</span>
          <span
            class="material-symbols-outlined text-base transform transition-transform duration-250"
            :class="{ 'rotate-180': isTypeExpanded }"
          >
            keyboard_arrow_down
          </span>
        </button>

        <transition name="expand">
          <div
            v-if="isTypeExpanded"
            class="space-y-1 pt-1 overflow-hidden"
          >
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              class="flex items-center gap-2.5 w-full py-1.5 px-2 rounded-lg text-xs font-body transition-all duration-200 text-left cursor-pointer group"
              :class="
                selectedType.includes(opt.value)
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-secondary/70 hover:text-on-surface hover:bg-surface/30'
              "
              @click="toggleType(opt.value)"
            >
              <!-- Checkbox Square -->
              <span
                class="flex items-center justify-center w-4 h-4 rounded-md border transition-all duration-200 shrink-0"
                :class="
                  selectedType.includes(opt.value)
                    ? 'border-primary bg-primary text-white shadow-[0_0_8px_var(--primary)]'
                    : 'border-secondary/40 group-hover:border-secondary/70 bg-transparent'
                "
              >
                <span
                  v-if="selectedType.includes(opt.value)"
                  class="material-symbols-outlined text-xs! font-bold"
                >
                  check
                </span>
              </span>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- Divider -->
      <div class="border-t border-border/20" />

      <!-- Section: Visibility -->
      <div class="space-y-2">
        <button
          class="flex items-center justify-between w-full text-left font-title text-[11px] font-bold uppercase tracking-widest text-secondary/70 hover:text-on-surface transition-colors py-1 cursor-pointer"
          @click="isVisibilityExpanded = !isVisibilityExpanded"
        >
          <span>Visibility</span>
          <span
            class="material-symbols-outlined transform transition-transform duration-250"
            :class="{ 'rotate-180': isVisibilityExpanded }"
          >
            keyboard_arrow_down
          </span>
        </button>

        <transition name="expand">
          <div
            v-if="isVisibilityExpanded"
            class="space-y-1 pt-1 overflow-hidden"
          >
            <button
              v-for="opt in visibilityOptions"
              :key="opt.value"
              class="flex items-center gap-2.5 w-full py-1.5 px-2 rounded-lg text-xs font-body transition-all duration-200 text-left cursor-pointer group"
              :class="
                selectedVisibility.includes(opt.value)
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-secondary/70 hover:text-on-surface hover:bg-surface/30'
              "
              @click="toggleVisibility(opt.value)"
            >
              <!-- Checkbox Square -->
              <span
                class="flex items-center justify-center w-4 h-4 rounded-md border transition-all duration-200 shrink-0"
                :class="
                  selectedVisibility.includes(opt.value)
                    ? 'border-primary bg-primary text-white shadow-[0_0_8px_var(--primary)]'
                    : 'border-secondary/40 group-hover:border-secondary/70 bg-transparent'
                "
              >
                <span
                  v-if="selectedVisibility.includes(opt.value)"
                  class="material-symbols-outlined text-xs! font-bold"
                >
                  check
                </span>
              </span>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </transition>
      </div>

      <transition name="expand">
        <div
          v-if="selectedType.length > 0 || selectedVisibility.length > 0"
          class="space-y-4 pt-1"
        >
          <div class="border-t border-border/20" />
          <button
            class="w-full py-2.5 border border-dashed border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 rounded-xl text-[10px] uppercase font-title font-bold tracking-widest transition-all duration-200 cursor-pointer text-center"
            @click="resetFilters"
          >
            Reset All
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpaceType, SpaceVisibility } from '../spaces.type'

const props = defineProps<{
  selectedType: SpaceType[]
  selectedVisibility: SpaceVisibility[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedType', value: SpaceType[]): void
  (e: 'update:selectedVisibility', value: SpaceVisibility[]): void
  (e: 'close'): void
}>()

const isTypeExpanded = ref(true)
const isVisibilityExpanded = ref(true)

const activeFilterCount = computed(() => {
  return props.selectedType.length + props.selectedVisibility.length
})

const typeOptions = [
  { label: 'Personal', value: 'PERSONAL' as const },
  { label: 'Couple', value: 'COUPLE' as const },
  { label: 'Friends', value: 'FRIENDS' as const },
  { label: 'Family', value: 'FAMILY' as const },
]

const visibilityOptions = [
  { label: 'Public', value: 'PUBLIC' as const },
  { label: 'Private', value: 'PRIVATE' as const },
]

const toggleType = (val: SpaceType) => {
  const next = [...props.selectedType]
  const idx = next.indexOf(val)
  if (idx > -1) {
    next.splice(idx, 1)
  } else {
    next.push(val)
  }
  emit('update:selectedType', next)
}

const toggleVisibility = (val: SpaceVisibility) => {
  const next = [...props.selectedVisibility]
  const idx = next.indexOf(val)
  if (idx > -1) {
    next.splice(idx, 1)
  } else {
    next.push(val)
  }
  emit('update:selectedVisibility', next)
}

const resetFilters = () => {
  emit('update:selectedType', [])
  emit('update:selectedVisibility', [])
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 200px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}
</style>
