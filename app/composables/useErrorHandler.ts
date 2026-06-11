import { useToast } from '~/composables/useToast'
import { ApiError } from '~/types'
import { t } from '~/utils/i18n'

export const useErrorHandler = () => {
  const toast = useToast()

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      // Skip showing a toast for validation errors (handled locally by the form)
      const isValidationError = err.statusCode === 400 && err.errors
      if (!isValidationError) {
        toast.error(t(err.message))
      }
    } else if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error(t('DEFAULT_ERROR') || 'An unexpected error occurred.')
    }
  }

  return {
    handleError,
  }
}
