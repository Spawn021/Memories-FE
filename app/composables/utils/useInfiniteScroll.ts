/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedResult } from '~/types'

export function useInfiniteScroll<
  T extends { uuid?: string; id?: string | number },
  TValue extends PaginatedResult<T> | null | undefined = PaginatedResult<T> | null | undefined,
>(queryRef: Ref<{ page?: number; [key: string]: any }>, useListFn: (query: Ref<any>) => { data: Ref<TValue>; isPending: Ref<boolean> }) {
  const { data, isPending: loading } = useListFn(queryRef)

  const items = ref<T[]>([]) as Ref<T[]>

  watch(
    data,
    newVal => {
      if (!newVal) return
      const page = queryRef.value.page ?? 1
      if (page === 1) {
        items.value = newVal.items
      } else {
        const existingIds = new Set(items.value.map(item => item.uuid || item.id))
        const newItems = newVal.items.filter(item => !existingIds.has(item.uuid || item.id))
        items.value = [...items.value, ...newItems]
      }
    },
    { immediate: true },
  )

  const hasMore = computed(() => {
    const meta = data.value?.meta
    if (!meta) return false
    return meta.page < meta.totalPages
  })

  const loadMore = () => {
    if (hasMore.value && !loading.value) {
      queryRef.value.page = (queryRef.value.page ?? 1) + 1
    }
  }

  const reset = () => {
    queryRef.value.page = 1
    items.value = []
  }

  return {
    data,
    items,
    loading,
    hasMore,
    loadMore,
    reset,
  }
}
