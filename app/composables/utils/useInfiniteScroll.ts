/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedResult } from '~/types'

export function useInfiniteScroll<
  T extends { uuid?: string; id?: string | number },
  TValue extends PaginatedResult<T> | null | undefined = PaginatedResult<T> | null | undefined,
>(queryRef: Ref<{ page?: number; [key: string]: any }>, useListFn: (query: Ref<any>) => { data: Ref<TValue>; loading: Ref<boolean> }) {
  const { data, loading } = useListFn(queryRef)

  const items = ref<T[]>([]) as Ref<T[]>
  const DEFAULT_META = {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  }
  const meta = ref(DEFAULT_META)

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
      meta.value = newVal.meta
    },
    { immediate: true },
  )

  const hasMore = computed(() => meta.value.page < meta.value.totalPages)

  const loadMore = () => {
    if (hasMore.value && !loading.value) {
      queryRef.value.page = (queryRef.value.page ?? 1) + 1
    }
  }

  const reset = () => {
    queryRef.value.page = 1
    if (data.value) {
      items.value = data.value.items
      meta.value = data.value.meta
    } else {
      items.value = []
      meta.value = DEFAULT_META
    }
  }

  return {
    data,
    items,
    meta,
    loading,
    hasMore,
    loadMore,
    reset,
  }
}
