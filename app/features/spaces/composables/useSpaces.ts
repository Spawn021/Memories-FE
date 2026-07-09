import { ref } from 'vue'
import { useSpaces as useSpacesQueries } from '~/features/spaces/spaces.queries'

// Shared state for persistent viewMode across the application
const viewMode = ref<'grid' | 'table'>('grid')

if (process.client) {
  const savedMode = localStorage.getItem('spaces_view_mode') as 'grid' | 'table'
  if (savedMode === 'grid' || savedMode === 'table') {
    viewMode.value = savedMode
  }
}

export const useSpaces = () => {
  const queries = useSpacesQueries()

  const setViewMode = (mode: 'grid' | 'table') => {
    viewMode.value = mode
    if (process.client) {
      localStorage.setItem('spaces_view_mode', mode)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode.value === 'grid' ? 'table' : 'grid')
  }

  return {
    ...queries,
    viewMode,
    setViewMode,
    toggleViewMode,
  }
}
