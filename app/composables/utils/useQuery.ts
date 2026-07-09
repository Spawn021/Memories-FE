import type { AsyncDataOptions } from '#app'
import { ApiError } from '~/types'

export function useQuery<T>(key: string | (() => string), fetchFn: () => Promise<T>, options: AsyncDataOptions<T> = {}) {
  const { data, pending, error, refresh } = useAsyncData<T>(key, fetchFn, options)

  return {
    data,
    loading: pending,
    error,
    refresh,
  }
}

export function useMutation<TArgs extends unknown[], T>(fetchFn: (...args: TArgs) => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const execute = async (...args: TArgs) => {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchFn(...args)
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
