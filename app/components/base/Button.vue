<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="spring-btn font-label-md text-[13px] uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none disabled:opacity-75 disabled:cursor-not-allowed"
    :class="[
      variantClasses,
      fullWidth ? 'w-full' : '',
      paddingClasses
    ]"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading"
      class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent shrink-0"
    ></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'text'
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
    fullWidth: false,
    size: 'md'
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-pure-surface border border-whisper-border text-obsidian-ink hover:text-sunlit-clementine hover:border-sunlit-clementine/20'
    case 'text':
      return 'bg-transparent text-muted-leaf hover:text-sunlit-clementine'
    case 'primary':
    default:
      return 'bg-sunlit-clementine text-pure-surface hover:opacity-95 shadow-lg shadow-sunlit-clementine/10'
  }
})

const paddingClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'py-2 px-4 text-[12px]'
    case 'lg':
      return 'py-4 px-10 text-[14px] tracking-[0.2em]'
    case 'md':
    default:
      return 'py-3.5 px-6 text-[13px] tracking-[0.15em]'
  }
})
</script>
