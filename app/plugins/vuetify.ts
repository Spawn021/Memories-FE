import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const lightTheme = {
  dark: false,
  colors: {
    primary: '#e26a4a',
    secondary: '#5c6e60',
    error: '#d65c5c',
    background: '#f7f8f6',
    surface: '#ffffff',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-error': '#ffffff',
    'on-background': '#181a1a',
    'on-surface': '#181a1a',
    'danger-container': '#ffdad6',
    'on-danger-container': '#93000a',
  },
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#f08265',
    secondary: '#8ea092',
    error: '#e57373',
    background: '#121414',
    surface: '#1a1d1d',
    'on-primary': '#181a1a',
    'on-secondary': '#181a1a',
    'on-error': '#181a1a',
    'on-background': '#f7f8f6',
    'on-surface': '#f7f8f6',
    'danger-container': '#93000a',
    'on-danger-container': '#ffdad6',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: false,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
