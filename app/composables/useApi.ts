import { useRuntimeConfig, navigateTo, useRoute } from '#app'
import { publicRoutes } from '~/constants'
import { useAuthStore } from '~/stores/auth'
import { ApiError, type ApiErrorResponse } from '~/types'

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
  const route = useRoute()

  const customFetch: typeof $fetch = $fetch.create({
    baseURL: apiBase,
    onRequest({ options }) {
      options.credentials = 'include'
    },
    onResponse({ response }) {
      if (
        response._data &&
        typeof response._data === 'object' &&
        'success' in response._data &&
        response._data.success === true
      ) {
        response._data = response._data.data
      }
    },
    async onResponseError({ request, response, options }) {
      const isRefreshRequest = request.toString().includes('/auth/refresh')
      const isLoginRequest = request.toString().includes('/auth/login')
      const fetchOptions = options as typeof options & { _retry?: boolean }

      if (response.status === 401 && !isRefreshRequest && !isLoginRequest && !fetchOptions._retry) {
        fetchOptions._retry = true

        if (!isRefreshing) {
          isRefreshing = true

          try {
            await $fetch('/auth/refresh', {
              baseURL: apiBase,
              method: 'POST',
              credentials: 'include',
            })

            isRefreshing = false
            onRefreshed(true)

            return customFetch(
              request,
              fetchOptions as unknown as Parameters<typeof customFetch>[1],
            )
          } catch {
            isRefreshing = false
            onRefreshed(false)
            authStore.clearUser()
            const isPublic = publicRoutes.includes(route.path) || route.meta.public === true
            if (!isPublic) {
              await navigateTo('/login')
            }

            const status = response ? response.status : 500
            const errorData = response?._data as ApiErrorResponse | undefined
            return Promise.reject(
              new ApiError(
                status,
                errorData?.message || 'Session expired. Please log in again.',
                errorData?.errors,
              ),
            )
          }
        }

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(success => {
            if (success) {
              resolve(
                customFetch(request, fetchOptions as unknown as Parameters<typeof customFetch>[1]),
              )
            } else {
              const status = response ? response.status : 500
              const errorData = response?._data as ApiErrorResponse | undefined
              reject(
                new ApiError(
                  status,
                  errorData?.message || 'Authentication failed',
                  errorData?.errors,
                ),
              )
            }
          })
        })
      }
      const errorData = response._data as ApiErrorResponse | undefined
      return Promise.reject(
        new ApiError(
          response.status,
          errorData?.message || 'Something went wrong',
          errorData?.errors,
        ),
      )
    },
  })

  return customFetch
}
