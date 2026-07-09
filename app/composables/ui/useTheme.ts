import { useTheme as useVuetifyTheme } from 'vuetify'

const isDark = ref(false)

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const syncTheme = (val: boolean) => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (val) {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
        vuetifyTheme.global.name.value = 'dark'
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        html.removeAttribute('data-theme')
        vuetifyTheme.global.name.value = 'light'
        localStorage.setItem('theme', 'light')
      }
    }
  }

  watch(isDark, val => {
    syncTheme(val)
  })
  const initTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const activeTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
      isDark.value = activeTheme
      syncTheme(activeTheme)
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}
