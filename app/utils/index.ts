/* eslint-disable @typescript-eslint/no-explicit-any */
export const cleanQuery = (query?: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {}
  if (!query) return cleaned

  Object.entries(query).forEach(([key, val]) => {
    if (val === undefined || val === null) return
    if (typeof val === 'string' && val.trim() === '') return
    if (Array.isArray(val)) {
      if (val.length === 0) return
      cleaned[key] = val.join(',')
    } else {
      cleaned[key] = val
    }
  })

  return cleaned
}
