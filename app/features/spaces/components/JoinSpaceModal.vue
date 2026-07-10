<template>
  <div
    class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
    @click.self="$emit('close')"
  >
    <div
      class="bg-surface border border-border p-6 md:p-8 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 max-w-lg w-full max-h-[90vh] flex flex-col overflow-y-auto custom-scroll"
    >
      <!-- Modal Header -->
      <header class="mb-6 flex justify-between items-start">
        <div>
          <h2 class="font-title text-2xl font-bold text-on-surface">Join Sanctuary</h2>
          <p class="text-[12px] text-secondary">Discover public spaces or use an invitation to enter</p>
        </div>
        <button
          class="spring-btn text-secondary/50 hover:text-primary cursor-pointer p-1"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- Custom Tabs -->
      <div class="flex border-b border-border mb-6">
        <button
          class="flex-1 pb-3 text-[13px] uppercase tracking-widest font-title font-bold transition-all border-b-2 cursor-pointer"
          :class="activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-secondary/60'"
          @click="activeTab = 'invite'"
        >
          Invite Code
        </button>
        <button
          class="flex-1 pb-3 text-[13px] uppercase tracking-widest font-title font-bold transition-all border-b-2 cursor-pointer"
          :class="activeTab === 'search' ? 'border-primary text-primary' : 'border-transparent text-secondary/60'"
          @click="activeTab = 'search'"
        >
          Explore Public
        </button>
      </div>

      <!-- Error / Success messages -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-error/5 border border-error/20 text-error text-[13px] rounded font-body animate-fadeIn"
      >
        {{ errorMessage }}
      </div>
      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-success/5 border border-success/20 text-success text-[13px] rounded font-body animate-fadeIn"
      >
        {{ successMessage }}
      </div>

      <!-- Tab: Invite Code -->
      <div
        v-if="activeTab === 'invite'"
        class="space-y-4"
      >
        <div class="space-y-1.5">
          <label class="block font-body text-[12px] uppercase tracking-widest text-secondary">INVITATION CODE OR LINK</label>
          <input
            v-model="inviteToken"
            class="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm text-on-surface"
            placeholder="Enter code or paste invite URL"
            required
            type="text"
            @keyup.enter="handleJoinByInvite"
          />
        </div>

        <v-btn
          color="primary"
          block
          size="large"
          :loading="joining"
          class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
          @click="handleJoinByInvite"
        >
          Enter Sanctuary
        </v-btn>
      </div>

      <!-- Tab: Explore Public -->
      <div
        v-else
        class="space-y-4 flex flex-col flex-grow min-h-0"
      >
        <!-- Search bar -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-secondary/50 !text-[20px]">search</span>
          <input
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-sm text-on-surface"
            placeholder="Search public sanctuaries..."
            type="text"
          />
        </div>

        <!-- Search Results List -->
        <div class="flex-grow overflow-y-auto custom-scroll max-h-[40vh] pr-1 space-y-3">
          <!-- Loading state -->
          <div
            v-if="searching"
            class="py-8 flex justify-center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              size="32"
            />
          </div>

          <!-- Empty search results -->
          <div
            v-else-if="searchResults.length === 0"
            class="py-12 text-center"
          >
            <span class="material-symbols-outlined !text-[32px] text-secondary/30">explore</span>
            <p class="font-poetic text-lg italic text-secondary/70 mt-2">No public sanctuaries found</p>
          </div>

          <!-- Result cards -->
          <div
            v-else
            v-for="space in searchResults"
            :key="space.uuid"
            class="p-4 bg-background border border-border rounded-md flex justify-between items-center transition-all hover:border-border-strong"
          >
            <div class="space-y-1 overflow-hidden pr-2">
              <div class="flex items-center gap-2">
                <span class="text-xs uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold tracking-wider">
                  {{ space.type }}
                </span>
                <span class="font-bold text-[14px] text-on-surface truncate block">{{ space.name }}</span>
              </div>
              <p class="text-[11px] text-secondary truncate">@{{ space.slug }}</p>
              <p class="text-[11px] text-secondary/60">{{ space.members?.length || 0 }} members active</p>
            </div>

            <!-- Join CTA -->
            <button
              v-if="isMember(space)"
              disabled
              class="px-3.5 py-1.5 border border-border bg-surface text-secondary/40 text-[11px] font-bold uppercase tracking-wider rounded cursor-not-allowed shrink-0"
            >
              Joined
            </button>
            <button
              v-else-if="isPending(space)"
              disabled
              class="px-3.5 py-1.5 border border-primary/20 bg-primary/5 text-primary/70 text-[11px] font-bold uppercase tracking-wider rounded cursor-not-allowed shrink-0"
            >
              Pending
            </button>
            <v-btn
              v-else
              color="primary"
              size="small"
              :loading="joiningUuid === space.uuid"
              class="spring-btn font-body text-[11px] font-bold tracking-wider uppercase rounded shrink-0 h-8!"
              @click="handleJoinPublic(space)"
            >
              Join
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="pt-6 mt-6 border-t border-border flex justify-end">
        <v-btn
          type="button"
          variant="outlined"
          size="large"
          class="spring-btn font-body text-sm font-semibold tracking-wider uppercase text-on-surface border-border h-11! rounded-md!"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSpaces } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import type { Space } from '~/features/spaces/spaces.type'

const emit = defineEmits(['close', 'success'])

const activeTab = ref<'invite' | 'search'>('invite')
const inviteToken = ref('')
const searchQuery = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const authStore = useAuthStore()
const { useAcceptInvite, useSearch, useRequestToJoin } = useSpaces()
const toast = useToast()

// Mutations
const { data: inviteData, error: inviteError, mutateAsync: acceptInvite, isPending: inviteLoading } = useAcceptInvite()
const { error: requestError, mutateAsync: requestJoin, isPending: requestLoading } = useRequestToJoin()

const joiningUuid = ref('')
const joining = computed(() => inviteLoading.value || requestLoading.value)

// Explore Search Query
const debouncedSearchQuery = ref('')
let debounceTimeout: NodeJS.Timeout | null = null

watch(searchQuery, newVal => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal
  }, 350)
})

// Query for search
const { data: searchData, isPending: searching } = useSearch(debouncedSearchQuery)
const searchResults = computed<Space[]>(() => searchData.value || [])

// Check member status
const isMember = (space: Space) => {
  if (!authStore.user) return false
  return space.members?.some(m => String(m.userId) === String(authStore.user?.id) && m.status === 'ACTIVE')
}

const isPending = (space: Space) => {
  if (!authStore.user) return false
  return space.members?.some(m => String(m.userId) === String(authStore.user?.id) && m.status === 'PENDING')
}

// Actions
const handleJoinByInvite = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  let token = inviteToken.value.trim()
  if (!token) {
    errorMessage.value = 'Please enter an invite token or link.'
    return
  }

  // If they paste a full URL, extract the token query parameter
  if (token.includes('token=')) {
    try {
      const url = new URL(token)
      token = url.searchParams.get('token') || token
    } catch {
      // Keep original token token string
    }
  }

  await acceptInvite(token)

  if (inviteError.value) {
    errorMessage.value = inviteError.value.message || 'Failed to accept invitation.'
  } else if (inviteData.value) {
    successMessage.value = 'Successfully joined the sanctuary.'
    toast.success('Joined sanctuary successfully!')
    emit('success', inviteData.value.space)
  }
}

const handleJoinPublic = async (space: Space) => {
  errorMessage.value = ''
  successMessage.value = ''
  joiningUuid.value = space.uuid

  await requestJoin({ uuid: space.uuid })
  joiningUuid.value = ''

  if (requestError.value) {
    toast.error(requestError.value.message || 'Failed to join sanctuary.')
  } else {
    toast.success('Joined sanctuary successfully!')
    emit('success', space)
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
