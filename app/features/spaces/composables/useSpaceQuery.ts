import { ref, computed, watch, type Ref } from 'vue'
import type { GetSpacesQuery } from '../spaces.type'
import { VIEW_MODE, VIEW_MODE_LIMIT } from '../spaces.constant'
import type { ViewMode } from '../spaces.type'
export const useSpaceQuery = (role: 'OWNER' | 'MEMBER', viewMode: Ref<ViewMode>) => {
  const query = ref<GetSpacesQuery>({
    role,
    page: 1,
    limit: viewMode.value === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE,
    search: '',
    type: [],
    visibility: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  })

  watch(viewMode, newMode => {
    query.value.limit = newMode === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE
    query.value.page = 1
  })
  const activeFilterCount = computed(() => {
    let count = 0
    if (query.value.type && Array.isArray(query.value.type)) {
      count += query.value.type.length
    }
    if (query.value.visibility && Array.isArray(query.value.visibility)) {
      count += query.value.visibility.length
    }
    return count
  })
  const isFiltered = computed(() => {
    const hasType = Array.isArray(query.value.type) ? query.value.type.length > 0 : !!query.value.type
    const hasVisibility = Array.isArray(query.value.visibility) ? query.value.visibility.length > 0 : !!query.value.visibility
    return !!(query.value.search || hasType || hasVisibility)
  })
  const setPage = (page: number) => {
    query.value.page = page
  }
  const setLimit = (limit: number) => {
    query.value.limit = limit
    query.value.page = 1
  }
  const resetFilters = () => {
    query.value.type = []
    query.value.visibility = []
    query.value.search = ''
    query.value.sortBy = 'updatedAt'
    query.value.sortOrder = 'desc'
    query.value.page = 1
  }
  return {
    query,
    activeFilterCount,
    isFiltered,
    setPage,
    setLimit,
    resetFilters,
  }
}
