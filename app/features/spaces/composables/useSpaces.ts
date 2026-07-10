import { VIEW_MODE, ACTIVE_TAB, VIEW_MODE_LIMIT } from '../spaces.constant'
import type { ActiveTab, ViewMode, GetSpacesQuery } from '../spaces.type'

export const useSpaces = () => {
  const viewMode = ref<ViewMode>(VIEW_MODE.GRID)
  const activeTab = ref<ActiveTab>(ACTIVE_TAB.OWNER)
  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  const setActiveTab = (tab: ActiveTab) => {
    activeTab.value = tab
  }

  const spacesQuery = ref<GetSpacesQuery>({
    role: activeTab.value === ACTIVE_TAB.OWNER ? ACTIVE_TAB.OWNER : ACTIVE_TAB.MEMBER,
    page: 1,
    limit: viewMode.value === VIEW_MODE.GRID ? VIEW_MODE_LIMIT.GRID : VIEW_MODE_LIMIT.TABLE,
  })

  const setPage = (page: number) => {
    spacesQuery.value.page = page
  }

  const setLimit = (limit: number) => {
    spacesQuery.value.limit = limit
    spacesQuery.value.page = 1
  }

  return {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    spacesQuery,
    setPage,
    setLimit,
  }
}
