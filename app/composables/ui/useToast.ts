export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, message, type })
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string) => {
    addToast(msg, 'success')
  }

  const error = (msg: string) => {
    addToast(msg, 'error')
  }

  const warning = (msg: string) => {
    addToast(msg, 'warning')
  }

  const info = (msg: string) => {
    addToast(msg, 'info')
  }

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
