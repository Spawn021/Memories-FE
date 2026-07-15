import type { SORT_DIRECTIONS } from '~/constants'

export type ApiValidationError = Record<string, string[]>

export interface ApiResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiSuccessMessage {
  message: string
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
    this.name = 'ApiError'
  }
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginationMeta
}

export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS]

export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortDirection
}

export type PaginationSort = {
  sortBy: string
  sortOrder: SortDirection
}

export type ALIGN_HEADER_TABLE = 'left' | 'right' | 'center'
