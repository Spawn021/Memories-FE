<template>
  <div
    class="pointer-events-auto relative overflow-hidden flex items-start py-3 px-3.5 bg-surface/90 dark:bg-surface/80 border border-border-strong backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full select-none transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:scale-[1.01]"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div
      :class="getIconBgClass(toast.type)"
      class="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mr-3 transition-colors relative"
    >
      <div
        class="absolute inset-0 rounded-lg opacity-10 filter blur-[1px] bg-current"
        :class="getIconColorClass(toast.type)"
      ></div>
      <span
        class="material-symbols-outlined text-lg relative z-10 transition-colors"
        :class="getIconColorClass(toast.type)"
      >
        {{ getIconName(toast.type) }}
      </span>
    </div>

    <!-- Content text -->
    <div class="grow pt-0.5 pr-2">
      <div
        class="font-title text-[14px] font-bold tracking-wide transition-colors leading-tight"
        :class="getTitleColorClass(toast.type)"
      >
        {{ getToastTitle(toast.type) }}
      </div>
      <div class="font-body text-[13px] text-on-surface/70 mt-0.5 leading-snug">
        {{ toast.message }}
      </div>
    </div>

    <!-- Close button -->
    <button
      type="button"
      class="text-secondary/40 hover:text-on-surface hover:bg-surface-variant transition-all ml-1 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 duration-200"
      @click="emitClose"
    >
      <span class="material-symbols-outlined text-sm">close</span>
    </button>

    <!-- Progress bar at the bottom (laser-thin style) -->
    <div
      class="absolute bottom-0 left-0 h-[2.5px] transition-[width] ease-linear duration-50"
      :class="getProgressBarBgClass(toast.type)"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const DURATION = 5000
const progress = ref(100)
const remainingTime = ref(DURATION)
let lastTimestamp = 0
let animationFrameId: number | null = null
const isHovered = ref(false)

const updateTimer = (timestamp: number) => {
  if (!lastTimestamp) {
    lastTimestamp = timestamp
  }

  const elapsed = timestamp - lastTimestamp
  lastTimestamp = timestamp

  if (!isHovered.value) {
    remainingTime.value = Math.max(0, remainingTime.value - elapsed)
    progress.value = (remainingTime.value / DURATION) * 100

    if (remainingTime.value <= 0) {
      emitClose()
      return
    }
  }

  animationFrameId = requestAnimationFrame(updateTimer)
}

const emitClose = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  emit('close')
}

const pauseTimer = () => {
  isHovered.value = true
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const resumeTimer = () => {
  isHovered.value = false
  lastTimestamp = 0
  animationFrameId = requestAnimationFrame(updateTimer)
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(updateTimer)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

const getToastTitle = (type: string) => {
  switch (type) {
    case 'success':
      return 'Success'
    case 'error':
      return 'Error'
    case 'warning':
      return 'Warning'
    case 'info':
    default:
      return 'Info'
  }
}

const getIconName = (type: string) => {
  switch (type) {
    case 'success':
      return 'check_circle'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}

const getIconBgClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-[#eaf0eb] dark:bg-[#1c2e23]'
    case 'error':
      return 'bg-[#ffdad6] dark:bg-[#3d1414]'
    case 'warning':
      return 'bg-[#fff3e0] dark:bg-[#3d2714]'
    case 'info':
    default:
      return 'bg-[#e3f2fd] dark:bg-[#14273d]'
  }
}

const getIconColorClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-secondary'
    case 'error':
      return 'text-error'
    case 'warning':
      return 'text-[#f57c00]'
    case 'info':
    default:
      return 'text-[#1e88e5]'
  }
}

const getTitleColorClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-secondary'
    case 'error':
      return 'text-error'
    case 'warning':
      return 'text-[#e65100] dark:text-[#ffb74d]'
    case 'info':
    default:
      return 'text-[#1565c0] dark:text-[#42a5f5]'
  }
}

const getProgressBarBgClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-secondary'
    case 'error':
      return 'bg-error'
    case 'warning':
      return 'bg-[#f57c00]'
    case 'info':
    default:
      return 'bg-[#1e88e5]'
  }
}
</script>
