import { useRuntimeConfig, navigateTo } from '#app'
import { useAuthStore } from '../stores/auth'

let isRefreshing = false
let refreshSubscribers: ((success: boolean) => void)[] = []

function subscribeTokenRefresh(cb: (success: boolean) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach(cb => cb(success))
  refreshSubscribers = []
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const apiBase = config.public.apiBase

  const customFetch = $fetch.create({
    baseURL: apiBase,
    onRequest({ options }) {
      // Send credentials (cookies) with every request
      options.credentials = 'include'
    },
    async onResponseError({ request, response, options }) {
      const isRefreshRequest = request.toString().includes('/auth/refresh')
      const isLoginRequest = request.toString().includes('/auth/login')

      // If response is 401 Unauthorized, and it's not a refresh or login request
      if (response.status === 401 && !isRefreshRequest && !isLoginRequest) {
        if (!isRefreshing) {
          isRefreshing = true

          try {
            // Attempt to refresh the tokens using HTTP-only cookies
            await $fetch('/auth/refresh', {
              baseURL: apiBase,
              method: 'POST',
              credentials: 'include',
            })

            isRefreshing = false
            onRefreshed(true)
          } catch (refreshError) {
            isRefreshing = false
            onRefreshed(false)

            // Clear the local state and redirect to login
            authStore.clearUser()
            await navigateTo('/login')
            return
          }
        }

        // Return a promise that resolves when the token refresh finishes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(success => {
            if (success) {
              resolve(customFetch(request, options))
            } else {
              reject(response)
            }
          })
        })
      }
    },
  })

  return customFetch
}
