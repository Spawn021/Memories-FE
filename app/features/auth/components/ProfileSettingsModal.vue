<template>
  <div
    class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
    @click.self="$emit('close')"
  >
    <div
      class="bg-surface border border-border p-6 md:p-8 shadow-2xl relative -rotate-[1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full flex flex-col"
    >
      <!-- Modal Header -->
      <header class="mb-6 flex justify-between items-start">
        <div>
          <h2 class="font-title text-2xl font-bold text-on-surface">Edit Profile</h2>
          <p class="text-[12px] text-secondary">Update your personal details inside the sanctuary</p>
        </div>
        <button
          class="spring-btn text-secondary/50 hover:text-primary cursor-pointer p-1"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- Messages -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border flex items-center gap-2"
      >
        <span class="material-symbols-outlined !text-[16px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-secondary/10 text-secondary rounded-md text-[13px] border border-border flex items-center gap-2"
      >
        <span class="material-symbols-outlined !text-[16px]">check_circle</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form Content -->
      <form
        class="space-y-4"
        @submit.prevent="handleSave"
      >
        <!-- Display Name -->
        <div class="space-y-1.5">
          <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">Display Name</label>
          <input
            v-model="form.displayName"
            class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] text-on-surface"
            placeholder="e.g. John Doe"
            required
            type="text"
          />
        </div>

        <!-- Username -->
        <div class="space-y-1.5">
          <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">Username</label>
          <input
            v-model="form.username"
            class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] text-on-surface"
            placeholder="e.g. johndoe"
            required
            type="text"
          />
        </div>

        <!-- Action buttons -->
        <div class="pt-4 flex gap-3 justify-end">
          <v-btn
            type="button"
            variant="outlined"
            size="large"
            class="spring-btn font-body text-sm font-semibold tracking-wider uppercase text-on-surface border-border h-11! rounded-md!"
            @click="$emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            size="large"
            :loading="loading"
            class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
          >
            Save Changes
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '../auth.queries'

const emit = defineEmits(['close', 'updated'])

const authStore = useAuthStore()
const { useUpdateProfile } = useAuth()
const { execute: updateProfile, loading, error: apiError } = useUpdateProfile()

const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  displayName: authStore.user?.displayName || '',
  username: authStore.user?.username || '',
})

const handleSave = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.value.displayName.trim() || !form.value.username.trim()) {
    errorMessage.value = 'Display name and username are required.'
    return
  }

  await updateProfile(form.value.displayName, form.value.username)
  if (apiError.value) {
    errorMessage.value = apiError.value.message || 'Failed to update profile.'
    return
  }

  successMessage.value = 'Profile updated successfully.'
  emit('updated')
  setTimeout(() => {
    emit('close')
  }, 1000)
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
