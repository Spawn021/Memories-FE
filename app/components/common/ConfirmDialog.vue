<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="relative p-5 border border-border rounded-lg overflow-hidden bg-surface">
      <!-- Close Icon Button -->
      <button
        class="absolute top-4 right-4 text-secondary/40 hover:text-secondary transition-colors cursor-pointer p-1"
        @click="onCancel"
      >
        <span class="material-symbols-rounded text-[20px]! font-medium">close</span>
      </button>

      <div class="flex justify-center pt-6 pb-3">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          :class="iconConfig.bgClass"
        >
          <span
            class="material-symbols-rounded text-[24px]! font-semibold"
            :class="iconConfig.iconClass"
          >
            {{ iconConfig.icon }}
          </span>
        </div>
      </div>

      <!-- Title (Centered) -->
      <h3 class="font-title text-xl font-bold text-on-surface text-center pt-2 pb-1">
        {{ title }}
      </h3>

      <!-- Message (Centered & Lightened) -->
      <p class="font-body text-[14px] text-secondary/70 text-center px-4 pt-1 pb-6 leading-relaxed">
        {{ message }}
      </p>

      <!-- Action Buttons (Side by side, equal width) -->
      <div class="flex gap-3 px-5 pb-2">
        <v-btn
          variant="outlined"
          size="large"
          class="flex-1 spring-btn font-body text-sm font-bold border-border-strong! text-on-surface hover:bg-background"
          style="text-transform: none; border-radius: 12px; height: 42px; font-weight: 600"
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="color"
          variant="flat"
          size="large"
          class="flex-1 spring-btn font-body text-sm font-bold text-white"
          style="text-transform: none; border-radius: 12px; height: 42px; font-weight: 600"
          @click="onConfirm"
        >
          {{ actionText }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
  actionText?: string
  cancelText?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionText: 'Confirm',
  cancelText: 'Cancel',
  color: 'primary',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const iconConfig = computed(() => {
  if (props.color === 'error') {
    return {
      icon: 'warning',
      bgClass: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
      iconClass: 'text-red-500',
    }
  }
  if (props.color === 'warning') {
    return {
      icon: 'report_problem',
      bgClass: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      iconClass: 'text-amber-500',
    }
  }
  return {
    icon: 'help',
    bgClass: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
    iconClass: 'text-blue-500',
  }
})

const onCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const onConfirm = () => {
  emit('confirm')
}
</script>
