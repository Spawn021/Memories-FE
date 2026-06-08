import { ref } from 'vue'
import { z } from 'zod'
import { ApiError, type ApiValidationError } from '~/types'

export const useForm = <TSchema extends z.ZodTypeAny>(schema?: TSchema) => {
  const validationErrors = ref<ApiValidationError>({})
  const error = ref('')

  const clearErrors = () => {
    validationErrors.value = {}
    error.value = ''
  }

  const validate = (data: unknown): data is z.infer<TSchema> => {
    clearErrors()
    if (!schema) return true

    const result = schema.safeParse(data)
    if (!result.success) {
      const errors: ApiValidationError = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(issue.message)
      })
      validationErrors.value = errors
      error.value = 'Please correct the validation errors.'
      return false
    }
    return true
  }

  const handleApiError = (
    err: unknown,
    fallbackMessage = 'An unexpected error occurred. Please try again.',
  ) => {
    if (err instanceof ApiError) {
      if (err.statusCode === 400 && err.errors) {
        validationErrors.value = err.errors
        error.value = err.message || 'Please correct the validation errors.'
      } else {
        error.value = err.message
      }
    } else if (err instanceof Error) {
      if (process.dev) {
        error.value = err.message
      } else {
        error.value = fallbackMessage
      }
    } else {
      error.value = fallbackMessage
    }
  }

  return {
    validationErrors,
    error,
    validate,
    handleApiError,
    clearErrors,
  }
}
