<template>
  <div>
    <header class="mb-6 animate-waterfall delay-50">
      <h1 class="font-title text-2xl md:text-3xl mb-1.5">{{ t('auth.registerTitle') }}</h1>
      <p class="font-body text-secondary text-[15px]">{{ t('auth.registerSubtitle') }}</p>
    </header>

    <div
      v-if="error"
      class="mb-4 p-3.5 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border animate-waterfall"
    >
      {{ error }}
    </div>

    <form
      class="space-y-4"
      @submit.prevent="handleRegister"
    >
      <div class="space-y-1.5 animate-waterfall delay-100">
        <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.email') }}</label>
        <v-text-field
          v-model="form.email"
          type="email"
          :placeholder="t('form.placeholders.email')"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :error-messages="validationErrors.email"
          @focus="clearFieldError('email')"
          @blur="validateFieldOnBlur('email')"
        />
      </div>
      <div class="space-y-1.5 animate-waterfall delay-150">
        <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.password') }}</label>
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('form.placeholders.password')"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :error-messages="validationErrors.password"
          @focus="clearFieldError('password')"
          @blur="validateFieldOnBlur('password')"
        >
          <template #append-inner>
            <button
              type="button"
              class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
              :title="showPassword ? t('form.hidePassword') : t('form.showPassword')"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined text-[20px]! text-primary">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </template>
        </v-text-field>
      </div>

      <!-- Confirm Password Field -->
      <div class="space-y-1.5 animate-waterfall delay-200">
        <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">{{ t('form.labels.confirmPassword') }}</label>
        <v-text-field
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="t('form.placeholders.password')"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :error-messages="validationErrors.confirmPassword"
          @focus="clearFieldError('confirmPassword')"
          @blur="validateFieldOnBlur('confirmPassword')"
        >
          <template #append-inner>
            <button
              type="button"
              class="text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer p-1"
              :title="showConfirmPassword ? t('form.hidePassword') : t('form.showPassword')"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="material-symbols-outlined text-[20px]! text-primary">
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </template>
        </v-text-field>
      </div>

      <v-checkbox
        v-model="form.terms"
        hide-details="auto"
        color="primary"
        class="animate-waterfall delay-250"
        :error-messages="validationErrors.terms"
        @focus="clearFieldError('terms')"
        @blur="validateFieldOnBlur('terms')"
        @update:model-value="validateFieldOnBlur('terms')"
      >
        <template #label>
          <span class="text-[13px] font-body text-secondary">
            {{ t('auth.agreeTo') }}
            <NuxtLink
              class="text-primary hover:underline"
              :to="routes.terms()"
              @click.stop
            >
              {{ t('auth.terms') }}
            </NuxtLink>
            &amp;
            <NuxtLink
              class="text-primary hover:underline"
              :to="routes.privacy()"
              @click.stop
            >
              {{ t('auth.privacy') }}
            </NuxtLink>
          </span>
        </template>
      </v-checkbox>

      <!-- CTA Actions -->
      <div class="space-y-4 pt-3 animate-waterfall delay-400">
        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          class="spring-btn font-body tracking-wider uppercase font-bold! rounded-lg! h-12.5!"
        >
          {{ t('auth.createSpace') }}
        </v-btn>

        <div class="relative flex items-center py-1">
          <div class="grow border-t border-border"></div>
          <span class="shrink mx-3 text-secondary/50 font-body text-[11px] uppercase">{{ t('auth.or') }}</span>
          <div class="grow border-t border-border"></div>
        </div>

        <v-btn
          type="button"
          variant="outlined"
          block
          size="large"
          class="spring-btn font-body tracking-wider uppercase text-on-surface border-border"
          style="font-weight: 600; border-radius: var(--radius-lg); height: 50px"
          @click="handleGoogleLogin"
        >
          <template #prepend>
            <img
              :src="GoogleIcon"
              alt="Google"
              class="h-4 w-4 shrink-0 mr-1"
            />
          </template>
          {{ t('auth.continueGoogle') }}
        </v-btn>
      </div>
    </form>

    <footer class="mt-8 text-center animate-waterfall delay-450">
      <p class="font-body text-secondary text-[14px]">
        {{ t('auth.alreadyHaveSpace') }}
        <NuxtLink
          class="text-primary font-medium hover:underline"
          :to="routes.login()"
        >
          {{ t('auth.signIn') }}
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { GoogleIcon } from '~/assets/icons'
import { useForm } from '~/composables/useForm'
import { registerSchema } from '~/schema/auth/register.schema'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const routes = useRoutes()

const emit = defineEmits<{
  (e: 'success', data: { email: string; password?: string }): void
}>()

const { register, loginWithGoogle, loading } = useAuth()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const { validationErrors, error, validate, clearFieldError, validateFieldOnBlur, handleApiError } = useForm(registerSchema, form)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
  const isValid = validate()
  if (!isValid) return

  try {
    const result = await register(form.email, form.password)
    toast.success(t(result.message))
    emit('success', { email: form.email, password: form.password })
  } catch (err) {
    handleApiError(err)
  }
}

const handleGoogleLogin = () => {
  loginWithGoogle()
}
</script>
