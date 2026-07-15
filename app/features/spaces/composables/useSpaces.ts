import { VIEW_MODE, ACTIVE_TAB } from '../spaces.constant'
import type { ActiveTab, ViewMode } from '../spaces.type'

export const useSpaces = () => {
  const viewMode = ref<ViewMode>(VIEW_MODE.GRID)
  const activeTab = ref<ActiveTab>(ACTIVE_TAB.OWNER)
  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  const setActiveTab = (tab: ActiveTab) => {
    activeTab.value = tab
  }
  return {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
  }
}
