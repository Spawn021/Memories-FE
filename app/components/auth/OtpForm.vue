<template>
  <div class="animate-waterfall text-center py-6 max-w-sm mx-auto">
    <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
      <span class="material-symbols-outlined text-2xl text-primary">mail</span>
    </div>
    <h2 class="font-title text-xl mb-3">{{ t('auth.enterCode') }}</h2>
    <p class="text-secondary mb-6 font-body text-[15px] leading-relaxed">
      {{ t('auth.sentCodeTo') }}<br />
      <strong class="text-on-surface">{{ email }}</strong>
      .
    </p>

    <div
      v-if="otpError"
      class="mb-4 p-3.5 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border text-left animate-waterfall"
    >
      {{ otpError }}
    </div>

    <form
      class="space-y-6"
      @submit.prevent="handleVerifyOtp"
    >
      <div class="flex justify-center mb-6">
        <v-otp-input
          v-model="otp"
          length="6"
          type="number"
          :disabled="loading"
          @finish="handleVerifyOtp"
        />
      </div>

      <v-btn
        type="submit"
        color="primary"
        block
        size="large"
        :loading="loading"
        :disabled="otp.length !== 6"
        class="spring-btn font-body! tracking-wider uppercase! font-sembold! h-12.5! rounded-lg!"
      >
        {{ t('auth.verifyAccount') }}
      </v-btn>
    </form>

    <div class="mt-6 text-center">
      <p class="text-secondary font-body text-[14px]">
        {{ t('auth.didNotReceiveCode') }}
        <button
          type="button"
          class="text-primary font-semibold hover:underline focus:outline-none cursor-pointer disabled:opacity-50 disabled:no-underline"
          :disabled="resendCooldown > 0 || loading || resending"
          @click="handleResend"
        >
          {{
            resendCooldown > 0 ? t('auth.resendIn', { seconds: resendCooldown }) : resending ? t('auth.resending') : t('auth.resendCode')
          }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { navigateTo } from '#app'
import { TIME_RESEND_OTP } from '~/constants'

const props = defineProps<{
  email: string
}>()

const { verifyEmail, resendVerificationCode, loading } = useAuth()
const toast = useToast()
const { t } = useI18n()
const { handleError } = useErrorHandler()
const routes = useRoutes()

const otp = ref('')
const otpError = ref('')
const resending = ref(false)
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const startCooldownTimer = () => {
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

const handleVerifyOtp = async () => {
  if (otp.value.length !== 6) return
  otpError.value = ''
  try {
    const result = await verifyEmail(props.email, otp.value)
    toast.success(t(result.message))
    navigateTo(routes.login({ query: { verified: 'true' } }))
  } catch (err) {
    handleError(err)
  }
}

const handleResend = async () => {
  if (resendCooldown.value > 0 || resending.value) return
  otpError.value = ''
  resending.value = true
  try {
    const result = await resendVerificationCode(props.email)
    toast.success(t(result.message))
    resendCooldown.value = TIME_RESEND_OTP
    startCooldownTimer()
  } catch (err) {
    handleError(err)
  } finally {
    resending.value = false
  }
}
</script>
