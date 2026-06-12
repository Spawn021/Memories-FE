import { ref, unref } from 'vue'
import { z } from 'zod'
import { ApiError, type ApiValidationError } from '~/types'

export const useForm = <TSchema extends z.ZodTypeAny>(schema?: TSchema, formData?: unknown) => {
  const { t } = useI18n()
  const validationErrors = ref<ApiValidationError>({})
  const error = ref('')
  const hasSubmitted = ref(false)

  const clearErrors = () => {
    validationErrors.value = {}
    error.value = ''
  }

  const getFormData = () => {
    if (typeof formData === 'function') {
      return formData()
    }
    return unref(formData)
  }

  const validate = (data?: unknown): data is z.infer<TSchema> => {
    hasSubmitted.value = true
    clearErrors()
    if (!schema) return true

    const dataToValidate = data !== undefined ? data : getFormData()

    const result = schema.safeParse(dataToValidate)
    if (!result.success) {
      const errors: ApiValidationError = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(t(issue.message))
      })
      validationErrors.value = errors
      error.value = t('E100')
      return false
    }
    return true
  }

  const clearFieldError = (field: string) => {
    validationErrors.value[field] = []
  }

  const validateFieldOnBlur = (field: string) => {
    if (!hasSubmitted.value) return
    if (!schema) return

    const dataToValidate = getFormData()
    const result = schema.safeParse(dataToValidate)
    if (result.success) {
      validationErrors.value[field] = []
    } else {
      const fieldIssues = result.error.issues.filter(issue => issue.path[0] === field)
      validationErrors.value[field] = fieldIssues.map(i => t(i.message))
    }
  }

  const handleApiError = (err: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.') => {
    if (err instanceof ApiError) {
      if (err.statusCode === 400 && err.errors) {
        const translatedErrors: ApiValidationError = {}
        for (const [key, messages] of Object.entries(err.errors)) {
          translatedErrors[key] = messages.map(msg => t(msg))
        }
        validationErrors.value = translatedErrors
        error.value = t(err.message) || t('E100')
      } else {
        error.value = t(err.message)
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
    hasSubmitted,
    validate,
    clearFieldError,
    validateFieldOnBlur,
    handleApiError,
    clearErrors,
  }
}
