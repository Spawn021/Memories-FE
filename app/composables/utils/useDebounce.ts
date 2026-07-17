import { type WatchSource } from 'vue'

export const useDebounce = <T>(source: WatchSource<T> | Ref<T>, delay = 300): Ref<T> => {
  const initialValue = typeof source === 'function' ? (source as () => T)() : (source as Ref<T>).value
  const debouncedValue = ref(initialValue) as Ref<T>
  let timeout: NodeJS.Timeout | null = null

  const cleanUp = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  watch(source, newValue => {
    cleanUp()
    timeout = setTimeout(() => {
      debouncedValue.value = newValue as T
    }, delay)
  })

  onUnmounted(() => {
    cleanUp()
  })

  return debouncedValue
}
