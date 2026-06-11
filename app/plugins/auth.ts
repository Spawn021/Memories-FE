import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  await initAuth()
})
