import { useRuntimeConfig, navigateTo, useRoute } from '#app'
import { ERROR_STATUS_CODE, noAuthRoutes, ROUTES } from '~/constants'
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
  const localePath = useLocalePath()

  const customFetch: typeof $fetch = $fetch.create({
    baseURL: apiBase,
    onRequest({ options }) {
      options.credentials = 'include'
    },
    onRequestError() {
      const toast = useToast()
      const { t } = useI18n()
      toast.error(t('CONNECTION_ERROR'))
      throw new ApiError(ERROR_STATUS_CODE.CONNECTION_ERROR, t('CONNECTION_ERROR'))
    },
    onResponse({ response }) {
      if (response._data && typeof response._data === 'object' && 'success' in response._data && response._data.success === true) {
        response._data = response._data.data
      }
    },
    async onResponseError({ request, response, options }) {
      const isRefreshRequest = request.toString().includes('/auth/refresh')
      const isLoginRequest = request.toString().includes('/auth/login')
      const fetchOptions = options as typeof options & { _retry?: boolean }

      if (response.status === ERROR_STATUS_CODE.UNAUTHORIZED && !isRefreshRequest && !isLoginRequest && !fetchOptions._retry) {
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

            return customFetch(request, fetchOptions as unknown as Parameters<typeof customFetch>[1])
          } catch {
            isRefreshing = false
            onRefreshed(false)
            authStore.clearUser()
            const cleanPath = route.path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'
            const isNoAuth = noAuthRoutes.includes(cleanPath)
            if (!isNoAuth) {
              await navigateTo(localePath({ path: ROUTES.LOGIN, query: { redirect: route.fullPath } }))
            }

            const status = response ? response.status : 500
            const errorData = response?._data as ApiErrorResponse | undefined
            return Promise.reject(new ApiError(status, errorData?.message || 'Session expired. Please log in again.', errorData?.errors))
          }
        }

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(success => {
            if (success) {
              resolve(customFetch(request, fetchOptions as unknown as Parameters<typeof customFetch>[1]))
            } else {
              const status = response ? response.status : 500
              const errorData = response?._data as ApiErrorResponse | undefined
              reject(new ApiError(status, errorData?.message || 'Authentication failed', errorData?.errors))
            }
          })
        })
      }

      const errorData = response._data as ApiErrorResponse | undefined
      return Promise.reject(new ApiError(response.status, errorData?.message || 'Something went wrong', errorData?.errors))
    },
  })

  return customFetch
}
