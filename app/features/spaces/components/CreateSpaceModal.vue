<template>
  <div
    class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
    @click.self="$emit('close')"
  >
    <div
      class="bg-surface border border-border p-6 md:p-8 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-md w-full max-h-[90vh] flex flex-col overflow-y-auto custom-scroll"
    >
      <header class="mb-5 flex justify-between items-start">
        <div>
          <h2 class="font-title text-2xl font-bold text-on-surface">Establish Sanctuary</h2>
          <p class="text-[12px] text-secondary">Establish a new shared memory space.</p>
        </div>
        <button
          class="spring-btn text-secondary/50 hover:text-primary cursor-pointer p-1"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- Global Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-danger-container text-on-danger-container rounded-md text-[13px] border border-border"
      >
        {{ errorMessage }}
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <!-- Space Name -->
        <div class="space-y-1.5">
          <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">SANCTUARY NAME</label>
          <v-text-field
            id="s-name"
            v-model="form.name"
            placeholder="e.g. Family Vault, Summer Trip 2026"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="custom-v-input"
            required
          />
        </div>

        <!-- Space Description -->
        <div class="space-y-1.5">
          <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">DESCRIPTION</label>
          <v-textarea
            id="s-desc"
            v-model="form.description"
            placeholder="Describe the purpose of this vault..."
            variant="outlined"
            density="compact"
            rows="3"
            hide-details="auto"
            class="custom-v-input"
          />
        </div>

        <!-- Space Type -->
        <div>
          <label
            class="block font-body text-sm text-[12px] text-secondary mb-1.5"
            for="s-type"
            >SANCTUARY TYPE</label
          >
          <select
            id="s-type"
            v-model="form.type"
            class="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] cursor-pointer text-on-surface"
          >
            <option value="PERSONAL">PERSONAL (Max 1 member)</option>
            <option value="COUPLE">COUPLE (Max 2 members)</option>
            <option value="FRIENDS">FRIENDS (Max 50 members)</option>
            <option value="FAMILY">FAMILY (No member limit)</option>
          </select>
        </div>

        <!-- Space Visibility -->
        <div>
          <label
            class="block font-body text-sm text-[12px] text-secondary mb-1.5"
            for="s-visibility"
            >VISIBILITY</label
          >
          <select
            id="s-visibility"
            v-model="form.visibility"
            class="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] cursor-pointer text-on-surface"
          >
            <option value="PUBLIC">PUBLIC (Searchable by everyone)</option>
            <option value="PRIVATE">PRIVATE (Invite-only)</option>
          </select>
        </div>

        <!-- Optional Mock Cover Image Selection -->
        <div>
          <label class="block font-body text-sm text-[12px] text-secondary mb-2">SELECT COVER ART</label>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="img in mockCovers"
              :key="img.url"
              class="aspect-[4/3] border-2 rounded-md overflow-hidden cursor-pointer transition-all relative group"
              :class="form.coverUrl === img.url ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-border-strong'"
              @click="form.coverUrl = img.url"
            >
              <img
                :src="img.url"
                class="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-300"
              />
              <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="pt-4 flex gap-3">
          <v-btn
            type="button"
            variant="outlined"
            size="large"
            class="flex-1 spring-btn font-body text-sm font-semibold tracking-wider uppercase text-on-surface border-border"
            style="font-weight: 600; border-radius: var(--radius-lg); height: 44px"
            @click="$emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="submitting"
            class="flex-1 spring-btn font-body text-sm font-semibold tracking-wider uppercase"
            style="font-weight: 600; border-radius: var(--radius-lg); height: 44px"
          >
            Establish
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpaceType, SpaceVisibility } from '~/features/spaces/spaces.type'
import { useSpaces } from '../spaces.queries'

const emit = defineEmits(['close', 'success'])

const { useCreate } = useSpaces()
const errorMessage = ref('')

const mockCovers = [
  { url: '/images/polaroid_1.png' },
  { url: '/images/polaroid_2.png' },
  { url: '/images/polaroid_3.png' },
  { url: '/images/polaroid_4.png' },
]

const form = ref({
  name: '',
  description: '',
  type: 'FRIENDS' as SpaceType,
  visibility: 'PUBLIC' as SpaceVisibility,
  coverUrl: '',
  avatarUrl: '',
})

// Setup reactive create space query
const { data: newSpace, isPending: submitting, error, mutateAsync: submitCreate } = useCreate()

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Please enter a sanctuary name.'
    return
  }

  errorMessage.value = ''

  await submitCreate({
    name: form.value.name,
    description: form.value.description,
    type: form.value.type,
    visibility: form.value.visibility,
    coverUrl: form.value.coverUrl || undefined,
    avatarUrl: form.value.avatarUrl || undefined,
  })

  if (error.value) {
    errorMessage.value = error.value.message || 'Failed to establish sanctuary. Please try again.'
  } else if (newSpace.value) {
    await refreshNuxtData('spaces-list')
    emit('success', newSpace.value)
  }
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: var(--border-strong);
  border-radius: 9px;
}

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
