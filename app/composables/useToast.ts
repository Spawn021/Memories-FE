import { ref } from 'vue'

export interface ToastOptions {
  message: string
  color?: string
  timeout?: number
}

const show = ref(true)
const message = ref('')
const color = ref('secondary')
const timeout = ref(5000)

export const useToast = () => {
  const toast = (opts: ToastOptions | string) => {
    if (typeof opts === 'string') {
      message.value = opts
      color.value = 'secondary'
      timeout.value = 5000
    } else {
      message.value = opts.message
      color.value = opts.color || 'secondary'
      timeout.value = opts.timeout ?? 5000
    }
    show.value = true
  }

  const success = (msg: string, time?: number) => {
    toast({ message: msg, color: 'secondary', timeout: time })
  }

  const error = (msg: string, time?: number) => {
    toast({ message: msg, color: 'error', timeout: time })
  }

  const info = (msg: string, time?: number) => {
    toast({ message: msg, color: 'primary', timeout: time })
  }

  return {
    show,
    message,
    color,
    timeout,
    toast,
    success,
    error,
    info,
  }
}
