export interface User {
  id: string
  uuid: string
  email: string
  globalRole: string
  displayName: string | null
  avatarUrl: string | null
  birthdate: string | null
  sessionId?: number
}
export type ApiValidationError = Record<string, string[]>
export interface ApiResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  statusCode: number
  message: string
  errors?: ApiValidationError
}

export class ApiError extends Error {
  statusCode: number
  errors?: ApiValidationError

  constructor(statusCode: number, message: string | string[], errors?: ApiValidationError) {
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    super(parsedMessage)
    this.statusCode = statusCode
    this.errors = errors
    this.name = 'ApiErrorr'
  }
}
