import { useAuth } from '~/features/auth/auth.queries'

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  await initAuth()
})
