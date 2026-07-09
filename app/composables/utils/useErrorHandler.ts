import { ApiError } from '~/types'

export const useErrorHandler = () => {
  const toast = useToast()
  const { t } = useI18n()

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      const isValidationError = err.statusCode === 400 && err.errors
      if (!isValidationError) {
        toast.error(t(err.message))
      }
    } else if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error(t('DEFAULT_ERROR'))
    }
  }

  return {
    handleError,
  }
}
