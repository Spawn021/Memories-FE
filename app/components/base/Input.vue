<template>
  <div class="space-y-1.5">
    <div v-if="label || $slots.label" class="flex justify-between items-end">
      <label
        :for="id"
        class="block font-label-sm text-[12px] uppercase tracking-widest text-muted-leaf transition-colors duration-200"
        :class="{ 'text-sunlit-clementine': isFocused }"
      >
        <slot name="label">{{ label }}</slot>
      </label>
      <slot name="label-right" />
    </div>

    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        class="w-full bg-pure-surface border rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sunlit-clementine/20 focus:border-sunlit-clementine transition-all font-body-md placeholder:text-muted-leaf/40 text-[15px]"
        :class="[
          hasError ? 'border-error' : 'border-obsidian-ink/10',
          type === 'password' ? 'pr-12' : '',
        ]"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-leaf/40 hover:text-sunlit-clementine transition-colors focus:outline-none select-none cursor-pointer flex items-center justify-center p-1"
        :title="showPassword ? 'Hide password' : 'Show password'"
        @click="togglePasswordVisibility"
      >
        <span class="material-symbols-outlined !text-[20px]">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
    </div>

    <span v-if="firstError" class="block mt-1 text-[11px] text-error">
      {{ firstError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    id: string
    label?: string
    type?: string
    placeholder?: string
    required?: boolean
    error?: string | string[]
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const isFocused = ref(false)
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const onFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const onBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const hasError = computed(() => {
  return !!props.error && (Array.isArray(props.error) ? props.error.length > 0 : true)
})

const firstError = computed(() => {
  if (!props.error) return ''
  if (Array.isArray(props.error)) {
    return props.error[0] || ''
  }
  return props.error
})
</script>
