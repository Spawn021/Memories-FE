<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="id"
        :checked="modelValue"
        type="checkbox"
        :required="required"
        class="h-4 w-4 rounded border border-outline-variant text-sunlit-clementine accent-sunlit-clementine focus:outline-none focus:ring-2 focus:ring-sunlit-clementine/20 cursor-pointer"
        @change="onChange"
      />
    </div>
    <div class="ml-3 text-[13px] select-none">
      <label :for="id" class="font-body-md text-muted-leaf cursor-pointer">
        <slot>{{ label }}</slot>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    id: string
    label?: string
    required?: boolean
  }>(),
  {
    required: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const onChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>
