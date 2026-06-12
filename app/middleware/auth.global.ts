import { useAuthStore } from '~/stores/auth'
import { guestRoutes, noAuthRoutes, ROUTES } from '~/constants'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()

  // 1. Clean the language prefix from the target route path (e.g. /vi/login -> /login)
  const cleanPath = to.path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'

  const isGuestRoute = guestRoutes.includes(cleanPath)
  const isNoAuthRoute = noAuthRoutes.includes(cleanPath)

  // 3. Handle routing protection rules
  // If not logged in and not accessing a page that doesn't require auth -> redirect to login
  if (!authStore.isAuthenticated && !isNoAuthRoute) {
    return navigateTo(localePath({ path: ROUTES.LOGIN, query: { redirect: to.fullPath } }))
  }

  // If logged in and trying to access a guest-only page -> redirect to dashboard
  if (authStore.isAuthenticated && isGuestRoute) {
    return navigateTo(localePath(ROUTES.DASHBOARD))
  }
})
