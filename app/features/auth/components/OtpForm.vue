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
import { TIME_RESEND_OTP } from '~/constants'
import { useAuth } from '../auth.queries'

const props = defineProps<{
  email: string
}>()

const { useVerifyEmail, useResendVerification } = useAuth()
const { mutateAsync: verifyEmail, isPending: loading, data: verifyResult } = useVerifyEmail()
const { mutateAsync: resendVerification, isPending: resending, data: resendResult } = useResendVerification()
const toast = useToast()
const { t } = useI18n()
const { handleError } = useErrorHandler()
const routes = useRoutes()

const otp = ref('')
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
  try {
    await verifyEmail({ email: props.email, otp: otp.value })
    if (verifyResult.value) {
      toast.success(t(verifyResult.value.message))
    }
    navigateTo(routes.login({ verified: 'true' }))
  } catch (err) {
    handleError(err)
  }
}

const handleResend = async () => {
  if (resendCooldown.value > 0 || resending) return
  try {
    await resendVerification({ email: props.email })
    if (resendResult.value) {
      toast.success(t(resendResult.value.message))
    }
    resendCooldown.value = TIME_RESEND_OTP
    startCooldownTimer()
  } catch (err) {
    handleError(err)
  }
}
</script>
