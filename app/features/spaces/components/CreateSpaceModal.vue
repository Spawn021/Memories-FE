<template>
  <v-dialog
    :model-value="true"
    max-width="512px"
    persistent
    @update:model-value="$emit('close')"
  >
    <div
      class="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-2xl relative w-full max-h-[90vh] flex flex-col overflow-hidden sanctuary-modal-card"
    >
      <header class="mb-5 flex justify-between items-start shrink-0">
        <div>
          <h2 class="font-title text-2xl font-bold text-on-surface">
            {{ isEdit ? 'Refine Sanctuary' : 'Establish Sanctuary' }}
          </h2>
          <p class="text-[12px] text-secondary">
            {{ isEdit ? 'Modify your sanctuary settings.' : 'Establish a new shared memory space.' }}
          </p>
        </div>
        <button
          class="spring-btn text-secondary/40 hover:text-primary transition-colors cursor-pointer p-1"
          @click="$emit('close')"
        >
          <span class="material-symbols-rounded text-[20px]! font-medium">close</span>
        </button>
      </header>

      <!-- Global Error Message -->
      <div
        v-if="error"
        class="mb-6 p-2 bg-danger-container text-on-danger-container rounded-md text-[12px] border border-border reveal-item animate-waterfall shrink-0"
      >
        {{ error }}
      </div>

      <v-form
        class="flex-1 flex flex-col min-h-0"
        @submit.prevent="handleSubmit"
      >
        <div class="flex-1 overflow-y-auto custom-scroll modal-scroll pr-1.5 space-y-5 pb-1">
          <!-- Space Name -->
          <div class="space-y-1.5">
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Sanctuary Name</label>
            <v-text-field
              id="s-name"
              v-model="form.name"
              placeholder="e.g. Family Vault, Summer Trip 2026"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="validationErrors.name"
              @focus="clearFieldError('name')"
              @blur="validateFieldOnBlur('name')"
            />
          </div>

          <!-- Space Description -->
          <div class="space-y-1.5">
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Description</label>
            <v-textarea
              id="s-desc"
              v-model="form.description"
              placeholder="Describe the purpose of this sanctuary..."
              variant="outlined"
              density="compact"
              rows="3"
              hide-details="auto"
              class="font-body text-sm rounded-xl"
              rounded="lg"
              maxlength="200"
              :error-messages="validationErrors.description"
              @focus="clearFieldError('description')"
              @blur="validateFieldOnBlur('description')"
            />
          </div>

          <!-- Space Type (Disabled/Hidden in Edit Mode) -->
          <div
            v-if="!isEdit"
            class="space-y-2"
          >
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Sanctuary Type</label>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="typeOption in typeOptions"
                :key="typeOption.value"
                class="border rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer transition-all duration-300 relative overflow-hidden select-none bg-surface"
                :class="
                  form.type === typeOption.value
                    ? 'border-primary ring-2 ring-primary/10 bg-primary/2'
                    : 'border-border hover:border-border-strong hover:bg-background'
                "
                @click="form.type = typeOption.value"
              >
                <div class="flex items-center justify-between w-full">
                  <span
                    class="material-symbols-outlined text-[20px]!"
                    :class="form.type === typeOption.value ? 'text-primary' : 'text-secondary/60'"
                  >
                    {{ typeOption.icon }}
                  </span>
                  <span
                    v-if="form.type === typeOption.value"
                    class="material-symbols-outlined text-[16px] text-primary"
                  >
                    check_circle
                  </span>
                </div>
                <span class="font-title text-sm font-bold text-on-surface mt-1.5">{{ typeOption.label }}</span>
                <span class="font-body text-[11px] text-secondary/60 leading-tight">{{ typeOption.description }}</span>
              </div>
            </div>
          </div>

          <!-- Space Visibility -->
          <div class="space-y-2">
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Visibility</label>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="visibilityOption in visibilityOptions"
                :key="visibilityOption.value"
                class="border rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer transition-all duration-300 relative overflow-hidden select-none bg-surface"
                :class="
                  form.visibility === visibilityOption.value
                    ? 'border-primary ring-2 ring-primary/10 bg-primary/2'
                    : 'border-border hover:border-border-strong hover:bg-background'
                "
                @click="form.visibility = visibilityOption.value"
              >
                <div class="flex items-center justify-between w-full">
                  <span
                    class="material-symbols-outlined text-[20px]!"
                    :class="form.visibility === visibilityOption.value ? 'text-primary' : 'text-secondary/60'"
                  >
                    {{ visibilityOption.icon }}
                  </span>
                  <span
                    v-if="form.visibility === visibilityOption.value"
                    class="material-symbols-outlined text-[16px] text-primary"
                  >
                    check_circle
                  </span>
                </div>
                <span class="font-title text-sm font-bold text-on-surface mt-1.5">{{ visibilityOption.label }}</span>
                <span class="font-body text-[11px] text-secondary/60 leading-tight">{{ visibilityOption.description }}</span>
              </div>
            </div>
          </div>

          <!-- Cover Art Selection -->
          <div class="space-y-2">
            <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Select Cover Art</label>
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="img in mockCovers"
                :key="img.url"
                class="aspect-3/4 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative group border-2"
                :class="
                  form.coverUrl === img.url
                    ? 'border-primary shadow-md ring-2 ring-primary/10 scale-102'
                    : 'border-border hover:border-border-strong'
                "
                @click="form.coverUrl = form.coverUrl === img.url ? '' : img.url"
              >
                <img
                  :src="img.url"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <!-- Checkmark badge -->
                <div
                  v-if="form.coverUrl === img.url"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm"
                >
                  <span class="material-symbols-outlined text-[12px]! text-white font-bold">check</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="pt-4 flex gap-3 shrink-0">
          <v-btn
            type="button"
            variant="outlined"
            size="large"
            class="flex-1 spring-btn font-body text-sm border-border-strong! text-on-surface hover:bg-background"
            style="text-transform: none; border-radius: 12px; height: 44px; font-weight: 600"
            @click="$emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            size="large"
            :loading="submitting"
            class="flex-1 spring-btn font-body text-sm text-white"
            style="text-transform: none; border-radius: 12px; height: 44px; font-weight: 600"
          >
            {{ isEdit ? 'Save Changes' : 'Establish' }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Space, SpaceType, SpaceVisibility } from '~/features/spaces/spaces.type'
import { spaceSchema } from '~/features/spaces/schemas/space.schema'
import { useSpaces } from '../spaces.queries'

const props = defineProps<{
  space?: Space
}>()

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.space)
const { useCreate, useUpdate } = useSpaces()

const mockCovers = [
  { url: '/images/polaroid_1.png' },
  { url: '/images/polaroid_2.png' },
  { url: '/images/polaroid_3.png' },
  { url: '/images/polaroid_4.png' },
]

const typeOptions = [
  { value: 'PERSONAL', label: 'Personal', description: 'Max 1 member', icon: 'person' },
  { value: 'COUPLE', label: 'Couple', description: 'Max 2 members', icon: 'favorite' },
  { value: 'FRIENDS', label: 'Friends', description: 'Max 50 members', icon: 'group' },
  { value: 'FAMILY', label: 'Family', description: 'Unlimited members', icon: 'groups' },
] as const

const visibilityOptions = [
  { value: 'PUBLIC', label: 'Public', description: 'Searchable by everyone', icon: 'public' },
  { value: 'PRIVATE', label: 'Private', description: 'Invite-only access', icon: 'lock' },
] as const

const form = ref({
  name: props.space?.name || '',
  description: props.space?.description || '',
  type: (props.space?.type || 'FRIENDS') as SpaceType,
  visibility: (props.space?.visibility || 'PUBLIC') as SpaceVisibility,
  coverUrl: props.space?.coverUrl || '',
  avatarUrl: props.space?.avatarUrl || '',
})

const { validationErrors, error, validate, clearFieldError, validateFieldOnBlur, handleApiError } = useForm(spaceSchema, form)

// Setup reactive create/update space queries
const { isPending: creating, mutateAsync: submitCreate } = useCreate()
const { isPending: updating, mutateAsync: submitUpdate } = useUpdate()

const submitting = computed(() => creating.value || updating.value)

const handleSubmit = async () => {
  const isValid = validate()
  if (!isValid) return

  try {
    if (isEdit.value && props.space) {
      const res = await submitUpdate({
        uuid: props.space.uuid,
        body: {
          name: form.value.name,
          description: form.value.description,
          visibility: form.value.visibility,
          coverUrl: form.value.coverUrl || undefined,
          avatarUrl: form.value.avatarUrl || undefined,
        },
      })
      emit('success', res)
    } else {
      const res = await submitCreate({
        name: form.value.name,
        description: form.value.description,
        type: form.value.type,
        visibility: form.value.visibility,
        coverUrl: form.value.coverUrl || undefined,
        avatarUrl: form.value.avatarUrl || undefined,
      })
      emit('success', res)
    }
  } catch (err: unknown) {
    handleApiError(err)
  }
}
</script>

<style>
.modal-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background-color: transparent !important;
  border-radius: 9px;
  transition: background-color 0.25s ease !important;
}

.modal-scroll:hover::-webkit-scrollbar-thumb,
.sanctuary-modal-card:hover .modal-scroll::-webkit-scrollbar-thumb {
  background-color: var(--border-strong) !important;
}

.modal-scroll::-webkit-scrollbar-thumb:hover,
.modal-scroll:hover::-webkit-scrollbar-thumb:hover,
.sanctuary-modal-card:hover .modal-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary) !important;
}
</style>
