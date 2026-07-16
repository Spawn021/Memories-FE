<template>
  <v-dialog
    :model-value="true"
    width="800px"
    max-width="800px"
    persistent
    @update:model-value="$emit('close')"
  >
    <v-card class="bg-surface max-h-[90vh] overflow-hidden">
      <v-card-item>
        <v-card-title class="font-title text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[28px]">domain_add</span>
          Join Sanctuary
        </v-card-title>
        <v-card-subtitle class="text-[12px] text-secondary mt-1">
          Discover public spaces or use an invitation code to enter
        </v-card-subtitle>
        <template #append>
          <v-btn
            icon
            variant="plain"
            class="w-8! h-8! min-w-0! cursor-pointer"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined text-[20px] hover:text-primary">close</span>
          </v-btn>
        </template>
      </v-card-item>

      <v-divider />

      <v-card-text>
        <v-tabs
          v-model="activeTab"
          color="primary"
          grow
          class="mb-6 border-b border-border/40"
        >
          <v-tab :value="JOIN_MODAL_TABS.INVITE_CODE">
            <span class="material-symbols-outlined text-[16px] mr-1.5">vpn_key</span>
            <span class="font-title text-xs font-medium uppercase tracking-wider">Invite Code</span>
          </v-tab>
          <v-tab :value="JOIN_MODAL_TABS.EXPLORE_SPACE">
            <span class="material-symbols-outlined text-[16px] mr-1.5">explore</span>
            <span class="font-title text-xs font-medium uppercase tracking-wider">Explore Public</span>
          </v-tab>
          <v-tab :value="JOIN_MODAL_TABS.REQUEST">
            <span class="material-symbols-outlined text-[16px] mr-1.5">group_add</span>
            <span class="font-title text-xs font-medium uppercase tracking-wider">Requests</span>
            <v-badge
              v-if="totalRequestsCount > 0"
              color="error"
              :content="totalRequestsCount"
              inline
              class="ml-1.5"
            />
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item
            :value="JOIN_MODAL_TABS.INVITE_CODE"
            class="space-y-4 py-1"
          >
            <div class="space-y-2">
              <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Invitation Token or Link</label>
              <v-text-field
                v-model="invitedLink"
                hide-details="auto"
                variant="outlined"
                placeholder="Enter code or paste invite URL"
                rounded="xl"
                @keyup.enter="handleJoinByInvite"
              >
                <template #prepend-inner>
                  <span class="material-symbols-outlined text-primary">link</span>
                </template>
                <template #append-inner>
                  <v-btn
                    color="primary"
                    variant="text"
                    size="x-small"
                    :ripple="false"
                    :loading="joining || validateInviteLoading"
                    :disabled="!invitedLink?.trim()"
                    class="font-body! text-sm! font-semibold!"
                    @click="handleJoinByInvite"
                  >
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item
            :value="JOIN_MODAL_TABS.EXPLORE_SPACE"
            class="space-y-4 flex flex-col grow min-h-0 py-1"
          >
            <!-- Search bar -->
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-3.5 text-secondary/40 !text-[20px]">search</span>
              <input
                v-model="searchQuery"
                class="w-full pl-11 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-body text-sm text-on-surface placeholder:text-secondary/40"
                placeholder="Search public sanctuaries..."
                type="text"
              />
            </div>

            <!-- Search Results List -->
            <div class="flex-grow overflow-y-auto custom-scroll max-h-[38vh] pr-1 space-y-3">
              <!-- Loading state -->
              <div
                v-if="searching"
                class="py-12 flex justify-center"
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
                class="py-16 text-center border border-dashed border-border/60 rounded-2xl bg-background/20"
              >
                <span class="material-symbols-outlined !text-[36px] text-secondary/30">explore</span>
                <p class="font-title text-sm font-bold text-secondary/70 mt-2">No public sanctuaries found</p>
                <p class="font-body text-[11px] text-secondary/40 mt-1">Try entering a different keyword</p>
              </div>

              <!-- Result cards -->
              <div
                v-else
                v-for="space in searchResults"
                :key="space.uuid"
                class="p-4 bg-background/40 border border-border/50 rounded-xl flex justify-between items-center transition-all duration-300 hover:border-primary/30 hover:bg-surface hover:shadow-xs group"
              >
                <div class="space-y-1.5 overflow-hidden pr-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="text-[9px] uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold tracking-widest border border-primary/5"
                    >
                      {{ space.type }}
                    </span>
                    <span class="font-title font-bold text-[14px] text-on-surface truncate max-w-[180px]">{{ space.name }}</span>
                  </div>
                  <p class="text-[11px] text-secondary/70 font-mono">@{{ space.slug }}</p>
                  <p class="text-[11px] text-secondary/50 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">groups</span>
                    {{ space.members?.filter(m => m.status === 'ACTIVE').length || 0 }} members active
                  </p>
                </div>

                <!-- Join CTA -->
                <button
                  v-if="isMember(space)"
                  disabled
                  class="px-4 py-2 border border-border/80 bg-surface/50 text-secondary/40 text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-not-allowed shrink-0"
                >
                  Joined
                </button>
                <button
                  v-else-if="isPending(space)"
                  disabled
                  class="px-4 py-2 border border-amber-500/20 bg-amber-500/5 text-amber-600/80 text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-not-allowed shrink-0 flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending
                </button>
                <v-btn
                  v-else
                  color="primary"
                  size="small"
                  :loading="joiningUuid === space.uuid"
                  class="spring-btn font-body text-[11px] font-bold tracking-wider uppercase rounded-xl! shrink-0 h-8.5!"
                  style="text-transform: none; border-radius: 10px"
                  @click="handleJoinPublic(space)"
                >
                  Join
                </v-btn>
              </div>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item
            :value="JOIN_MODAL_TABS.REQUEST"
            class="space-y-5 flex flex-col flex-grow min-h-0 py-1"
          >
            <AppDataTable
              :headers="headers"
              :items="sentRequests"
              :loading="sentRequestsLoading"
              :meta="sentRequestsMeta"
              table-class="border-0 bg-transparent shadow-none hover:shadow-none"
              @update:options="
                options => {
                  tableOptions.page = options.page
                  tableOptions.itemsPerPage = options.itemsPerPage
                }
              "
            >
              <template #item.spaceName="{ item: req }">
                <span class="font-bold">🌿 {{ req.space?.name }}</span>
              </template>

              <template #item.spaceSlug="{ item: req }">
                <span class="font-mono text-secondary/60">@{{ req.space?.slug }}</span>
              </template>

              <template #item.status="{ item: req }">
                <span
                  v-if="req.status === 'PENDING'"
                  class="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/10 inline-flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Review
                </span>
                <span
                  v-else-if="req.status === 'REJECTED'"
                  class="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-widest bg-error/10 text-error border border-error/10 inline-flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Rejected
                </span>
              </template>

              <template #item.actions="{ item: req }">
                <button
                  class="spring-btn px-3 py-1.5 border border-border text-secondary/50 hover:text-error hover:bg-error/5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shrink-0"
                  @click="handleWithdrawRequest(req.space?.uuid)"
                >
                  {{ req.status === 'PENDING' ? 'Withdraw' : 'Dismiss' }}
                </button>
              </template>

              <template #empty>
                <div class="py-12 text-center border border-dashed border-border/60 rounded-2xl bg-background/20">
                  <span class="material-symbols-outlined !text-[36px] text-secondary/30">notifications_off</span>
                  <p class="font-title text-sm font-bold text-secondary/70 mt-2">No pending requests</p>
                  <p class="font-body text-[11px] text-secondary/40 mt-1">You don't have any sent requests.</p>
                </div>
              </template>
            </AppDataTable>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="showConfirmDialog"
    max-width="460px"
    persistent
  >
    <v-card class="rounded-2xl border border-border shadow-2xl p-5 select-none bg-surface">
      <v-card-item>
        <v-card-title class="font-title text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
          <span class="material-symbols-outlined text-primary"> meeting_room </span>
          <span> Request Sanctuary Entry </span>
        </v-card-title>
        <template #append>
          <v-btn
            icon
            variant="plain"
            class="w-8! h-8! min-w-0! cursor-pointer"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined text-[20px] hover:text-primary">close</span>
          </v-btn>
        </template>
      </v-card-item>
      <v-card-text class="space-y-5 mt-5">
        <div
          v-if="selectedSpace"
          class="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/5"
          >
            {{ selectedSpace.name.charAt(0).toUpperCase() }}
          </div>
          <div class="overflow-hidden">
            <p class="font-title font-bold text-sm text-on-surface truncate">{{ selectedSpace.name }}</p>
            <p class="text-[11px] text-secondary/60 truncate font-mono">@{{ selectedSpace.slug }}</p>
          </div>
        </div>

        <p class="font-body text-sm text-secondary font-medium leading-relaxed text-center">
          This sanctuary requires administrator approval. You can write an optional message to introduce yourself or explain why you are
          requesting entry.
        </p>

        <!-- Message Field -->
        <div class="space-y-1.5">
          <label class="block font-body text-[12px] uppercase tracking-widest text-secondary/80">Message to Admin</label>
          <v-textarea
            v-model="joinMessage"
            variant="outlined"
            placeholder="Type your message here (optional)..."
            rows="3"
            hide-details="auto"
            class="font-body text-sm rounded-xl"
            rounded="lg"
            maxlength="200"
            counter
          />
        </div>
      </v-card-text>

      <v-card-actions class="flex gap-3">
        <v-btn
          variant="outlined"
          class="font-body! text-sm! font-semibold! border-border-strong! spring-btn flex-1 h-11! rounded-xl!"
          :disabled="joining"
          @click="showConfirmDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="font-body! text-sm! font-semibold! spring-btn flex-1 h-11! rounded-xl!"
          :loading="joining"
          @click="submitJoinAction"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSpaces } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import { useQueryClient } from '@tanstack/vue-query'
import type { Space } from '~/features/spaces/spaces.type'
import { JOIN_MODAL_TABS } from '~/features/spaces/spaces.constant'
import type { TableHeader } from '~/components/common/AppDataTable.vue'
import AppDataTable from '~/components/common/AppDataTable.vue'

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const { useAcceptInvite, useValidateInvite, useSearch, useRequestToJoin, useRemoveMember, useSentRequests } = useSpaces()
const toast = useToast()
const queryClient = useQueryClient()
const { handleError } = useErrorHandler()

const showConfirmDialog = ref(false)
const activeTab = ref(JOIN_MODAL_TABS.INVITE_CODE)

const invitedLink = ref('')
const invitedToken = ref('')
const selectedSpace = ref<Space>()
const isInviteFlow = ref(false)

const searchQuery = ref('')

const joinMessage = ref('')

// Mutations
const { mutateAsync: acceptInvite, isPending: inviteLoading } = useAcceptInvite()
const { mutateAsync: validateInvite, isPending: validateInviteLoading } = useValidateInvite()
const { mutateAsync: requestJoin, isPending: requestLoading } = useRequestToJoin()

const { mutateAsync: removeMember } = useRemoveMember()

const joiningUuid = ref('')
const joining = computed(() => inviteLoading.value || requestLoading.value)

// AppDataTable configuration for sent requests
const headers: TableHeader[] = [
  { key: 'spaceName', label: 'Sanctuary', sortable: false },
  { key: 'spaceSlug', label: 'Slug', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'actions', label: '', align: 'right', sortable: false, width: 120 },
]

const tableOptions = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: undefined,
  sortOrder: undefined,
})

const sentRequestsQuery = computed(() => ({
  page: tableOptions.value.page,
  limit: tableOptions.value.itemsPerPage,
}))

// Query sent requests
const { data: sentRequestsData, refetch: refetchSentRequests, isPending: sentRequestsLoading } = useSentRequests(sentRequestsQuery)
const sentRequests = computed(() => sentRequestsData.value?.items || [])
const sentRequestsMeta = computed(() => sentRequestsData.value?.meta)

const totalRequestsCount = computed(() => sentRequestsData.value?.meta?.total || 0)

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

const handleJoinByInvite = async () => {
  let token = invitedLink.value?.trim() || ''
  if (!token) {
    return
  }

  if (token.includes('token=')) {
    const url = new URL(token)
    token = url.searchParams.get('token') || token
  }

  try {
    const inviteInfo = await validateInvite(token)
    if (inviteInfo) {
      if (inviteInfo.requiresApproval) {
        selectedSpace.value = inviteInfo.space
        isInviteFlow.value = true
        invitedToken.value = token
        joinMessage.value = ''
        showConfirmDialog.value = true
      } else {
        try {
          await acceptInvite({ token })
          toast.success('Joined sanctuary successfully!')
          emit('success', inviteInfo.space)
        } catch (err) {
          handleError(err)
        }
      }
    }
  } catch (err) {
    handleError(err)
  }
}

const handleJoinPublic = async (space: Space) => {
  if (space.visibility === 'PUBLIC') {
    joiningUuid.value = space.uuid
    try {
      await requestJoin({ uuid: space.uuid })
      toast.success('Joined sanctuary successfully!')
      refetchSentRequests()
      queryClient.invalidateQueries({ queryKey: ['spaces-sent-requests'] })
      queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
      queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
      queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
    } catch (err) {
      handleError(err)
    } finally {
      joiningUuid.value = ''
    }
  } else {
    selectedSpace.value = space
    isInviteFlow.value = false
    joinMessage.value = ''
    showConfirmDialog.value = true
  }
}

const submitJoinAction = async () => {
  if (!selectedSpace.value) return

  try {
    if (isInviteFlow.value) {
      await acceptInvite({ token: invitedToken.value, message: joinMessage.value })
      toast.success('Entry request sent successfully!')
      showConfirmDialog.value = false
      emit('close')
      emit('success', selectedSpace.value)
    } else {
      await requestJoin({ uuid: selectedSpace.value.uuid, message: joinMessage.value })
      toast.success('Entry request sent successfully!')
      showConfirmDialog.value = false
    }
    refetchSentRequests()
    queryClient.invalidateQueries({ queryKey: ['spaces-sent-requests'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
  } catch (err) {
    handleError(err)
  }
}

const handleWithdrawRequest = async (spaceUuid: string) => {
  if (!authStore.user || !spaceUuid) return
  try {
    await removeMember({ uuid: spaceUuid, memberUserId: authStore.user.id })
    toast.success('Request removed successfully.')
    refetchSentRequests()
    queryClient.invalidateQueries({ queryKey: ['spaces-sent-requests'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
  } catch (err) {
    handleError(err)
  }
}

onMounted(() => {
  refetchSentRequests()
})
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
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
