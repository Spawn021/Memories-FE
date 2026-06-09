import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const customTheme = {
  dark: false,
  colors: {
    primary: '#e26a4a',
    secondary: '#5c6e60',
    error: '#d65c5c',
    background: '#f7f8f6',
    surface: '#ffffff',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: false,
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme,
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
