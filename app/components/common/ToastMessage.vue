<template>
  <div class="fixed top-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none max-w-95 w-full">
    <TransitionGroup name="toast-list">
      <ToastItem
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import ToastItem from './ToastItem.vue'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
