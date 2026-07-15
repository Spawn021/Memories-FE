<template>
  <v-dialog
    :model-value="true"
    width="800px"
    max-width="800px"
    persistent
    @update:model-value="$emit('close')"
  >
    <v-card class="bg-surface rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden">
      <v-card-item class="shrink-0">
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
                v-model="inviteToken"
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
                    :loading="joining || validatingInvite || processingJoin"
                    :disabled="!inviteToken?.trim()"
                    class="font-body! text-sm! font-semibold! tracking-wide rounded-xl!"
                    @click="handleJoinByInvite"
                  >
                    <span>Join</span>
                    <span class="material-symbols-outlined ml-1.5">arrow_forward</span>
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
            <div class="overflow-y-auto custom-scroll max-h-[42vh] pr-1 space-y-5">
              <!-- Empty State for Requests -->
              <div
                v-if="receivedRequests.length === 0 && sentRequests.length === 0"
                class="py-16 text-center border border-dashed border-border/60 rounded-2xl bg-background/20"
              >
                <span class="material-symbols-outlined !text-[36px] text-secondary/30">notifications_off</span>
                <p class="font-title text-sm font-bold text-secondary/70 mt-2">No pending requests</p>
                <p class="font-body text-[11px] text-secondary/40 mt-1">You don't have any sent or received requests.</p>
              </div>

              <!-- Section: Incoming Requests (To spaces I own/admin) -->
              <div
                v-if="receivedRequests.length > 0"
                class="space-y-3"
              >
                <h3 class="font-title text-xs font-bold uppercase tracking-widest text-secondary/80 flex items-center gap-1.5 px-1">
                  <span class="material-symbols-outlined text-[16px] text-primary">move_to_inbox</span>
                  Incoming Requests ({{ receivedRequests.length }})
                </h3>

                <div class="space-y-3">
                  <div
                    v-for="req in receivedRequests"
                    :key="req.space.uuid + '-' + req.member.userId"
                    class="p-4 bg-background/40 border border-border/50 rounded-xl space-y-3 hover:border-border-strong transition-all duration-300"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 overflow-hidden">
                        <div
                          class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs border border-primary/5"
                        >
                          {{ req.member.user?.displayName?.charAt(0).toUpperCase() || 'M' }}
                        </div>
                        <div class="overflow-hidden">
                          <p class="font-bold text-[13px] leading-tight text-on-surface truncate">
                            {{ req.member.user?.displayName || 'Someone' }}
                          </p>
                          <p class="text-[11px] text-secondary/60 truncate mt-0.5">
                            wants to join <span class="font-semibold text-primary">🌿 {{ req.space.name }}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Request Message -->
                    <div
                      v-if="req.member.joinRequestMessage"
                      class="p-2.5 bg-background border border-border/40 rounded-lg text-[11px] text-secondary leading-relaxed italic"
                    >
                      "{{ req.member.joinRequestMessage }}"
                    </div>

                    <!-- Approve/Reject buttons -->
                    <div class="flex justify-end gap-2 pt-1 border-t border-border/30">
                      <button
                        class="spring-btn px-3 py-1.5 border border-border text-secondary/60 hover:text-error hover:bg-error/5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1"
                        :disabled="approvingUuid === req.space.uuid + '-' + req.member.userId"
                        @click="handleRejectRequest(req.space.uuid, req.member.userId)"
                      >
                        <span class="material-symbols-outlined !text-[14px]">block</span>
                        Reject
                      </button>
                      <button
                        class="spring-btn px-3.5 py-1.5 bg-primary text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 shadow-sm hover:opacity-95"
                        :disabled="approvingUuid === req.space.uuid + '-' + req.member.userId"
                        @click="handleApproveRequest(req.space.uuid, req.member.userId)"
                      >
                        <span class="material-symbols-outlined !text-[14px]">done</span>
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section: Outgoing Requests (Sent to other spaces) -->
              <div
                v-if="sentRequests.length > 0"
                class="space-y-3"
              >
                <h3 class="font-title text-xs font-bold uppercase tracking-widest text-secondary/80 flex items-center gap-1.5 px-1">
                  <span class="material-symbols-outlined text-[16px] text-amber-500">outbox</span>
                  Sent Requests ({{ sentRequests.length }})
                </h3>

                <div class="space-y-3">
                  <div
                    v-for="space in sentRequests"
                    :key="space.uuid"
                    class="p-4 bg-background/40 border border-border/50 rounded-xl flex justify-between items-center hover:border-border-strong transition-all duration-300"
                  >
                    <div class="space-y-1 overflow-hidden pr-3">
                      <p class="font-bold text-[13px] leading-tight text-on-surface truncate">🌿 {{ space.name }}</p>
                      <p class="text-[11px] text-secondary/60 truncate font-mono">@{{ space.slug }}</p>
                      <div class="pt-1.5">
                        <span
                          class="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/10 inline-flex items-center gap-1"
                        >
                          <span class="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Review
                        </span>
                      </div>
                    </div>

                    <button
                      class="spring-btn px-3 py-1.5 border border-border text-secondary/50 hover:text-error hover:bg-error/5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shrink-0"
                      @click="handleWithdrawRequest(space.uuid)"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Confirm Join / Request Message Dialog -->
  <v-dialog
    v-model="showConfirmDialog"
    max-width="460px"
    @click:outside="showConfirmDialog = false"
  >
    <v-card class="rounded-2xl border border-border shadow-2xl p-5 select-none bg-surface">
      <v-card-title class="px-1 pt-1 pb-3 flex items-center gap-2.5 font-title font-bold text-[18px] text-on-surface">
        <span class="material-symbols-outlined text-primary">
          {{ requiresApproval ? 'mark_chat_unread' : 'meeting_room' }}
        </span>
        <span>
          {{ requiresApproval ? 'Request Sanctuary Entry' : 'Join Sanctuary' }}
        </span>
      </v-card-title>

      <v-card-text class="px-1 py-0 space-y-4">
        <!-- Sanctuary Preview Info -->
        <div v-if="selectedSpace" class="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/5">
            {{ selectedSpace.name.charAt(0).toUpperCase() }}
          </div>
          <div class="overflow-hidden">
            <p class="font-title font-bold text-sm text-on-surface truncate">🌿 {{ selectedSpace.name }}</p>
            <p class="text-[11px] text-secondary/60 truncate font-mono">@{{ selectedSpace.slug || 'sanctuary' }}</p>
          </div>
        </div>

        <!-- Approval Warning -->
        <p class="font-body text-xs text-secondary/70 leading-relaxed">
          {{ requiresApproval 
            ? 'This sanctuary requires administrator approval. You can write an optional message to introduce yourself or explain why you are requesting entry.' 
            : 'You are about to join this sanctuary. Confirm below to complete the action.' 
          }}
        </p>

        <!-- Message Field -->
        <div v-if="requiresApproval" class="space-y-1.5">
          <label class="block font-body text-[11px] uppercase tracking-widest text-secondary/70">Message to Admin</label>
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

      <v-card-actions class="px-1 pt-5 pb-0 flex gap-3">
        <v-btn
          variant="text"
          class="font-body text-sm font-semibold tracking-wide flex-1 h-11! rounded-xl!"
          style="text-transform: none;"
          :disabled="processingJoin"
          @click="showConfirmDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="spring-btn font-body text-sm font-semibold tracking-wide flex-1 h-11! rounded-xl!"
          style="text-transform: none;"
          :loading="processingJoin"
          @click="submitJoinAction"
        >
          {{ requiresApproval ? 'Send Request' : 'Join' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSpaces } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import { useQueryClient } from '@tanstack/vue-query'
import type { Space, SpaceMember } from '~/features/spaces/spaces.type'
import { JOIN_MODAL_TABS } from '~/features/spaces/spaces.constant'

const emit = defineEmits(['close', 'success'])

const activeTab = ref(JOIN_MODAL_TABS.INVITE_CODE)
const inviteToken = ref('')

const searchQuery = ref('')
const approvingUuid = ref('')

const showConfirmDialog = ref(false)
const joinMessage = ref('')
const isInviteFlow = ref(false)
const requiresApproval = ref(false)
const selectedSpace = ref<any>(null)
const validatedToken = ref('')
const processingJoin = ref(false)

const authStore = useAuthStore()
const { useAcceptInvite, useValidateInvite, useSearch, useRequestToJoin, useApproveMember, useRejectMember, useList, useRemoveMember } = useSpaces()
const toast = useToast()
const queryClient = useQueryClient()

// Mutations
const { data: inviteData, mutateAsync: acceptInvite, isPending: inviteLoading } = useAcceptInvite()
const { mutateAsync: validateInvite, isPending: validatingInvite } = useValidateInvite()
const { mutateAsync: requestJoin, isPending: requestLoading } = useRequestToJoin()
const { mutateAsync: approveMember } = useApproveMember()
const { mutateAsync: rejectMember } = useRejectMember()
const { mutateAsync: removeMember } = useRemoveMember()

const joiningUuid = ref('')
const joining = computed(() => inviteLoading.value || requestLoading.value)

// Query all user spaces to extract join requests (sent and received)
const userSpacesQuery = ref({
  limit: 100, // Fetch a large batch to catch all user spaces
})
const { data: userSpacesData, refetch: refetchUserSpaces } = useList(userSpacesQuery)
const allUserSpaces = computed(() => userSpacesData.value?.items || [])

// Sent requests: Spaces where the current user's membership is PENDING
const sentRequests = computed(() => {
  if (!authStore.user) return []
  return allUserSpaces.value.filter(space => {
    const myMember = space.members?.find(m => String(m.userId) === String(authStore.user?.id))
    return myMember && myMember.status === 'PENDING'
  })
})

// Received requests: Spaces owned/admined by the user that have PENDING members
const receivedRequests = computed(() => {
  if (!authStore.user) return []
  const list: Array<{ space: Space; member: SpaceMember }> = []
  allUserSpaces.value.forEach(space => {
    const myMember = space.members?.find(m => String(m.userId) === String(authStore.user?.id))
    const canManage = myMember && (myMember.role === 'OWNER' || myMember.role === 'ADMIN')
    if (canManage) {
      space.members?.forEach(member => {
        if (member.status === 'PENDING' && String(member.userId) !== String(authStore.user?.id)) {
          list.push({ space, member })
        }
      })
    }
  })
  return list
})

const totalRequestsCount = computed(() => sentRequests.value.length + receivedRequests.value.length)

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
  let token = inviteToken.value?.trim() || ''
  if (!token) {
    return
  }

  // If they paste a full URL, extract the token query parameter
  if (token.includes('token=')) {
    try {
      const url = new URL(token)
      token = url.searchParams.get('token') || token
    } catch {
      // Keep original token string
    }
  }

  try {
    const inviteInfo = await validateInvite(token)
    if (inviteInfo) {
      if (inviteInfo.requiresApproval) {
        selectedSpace.value = inviteInfo.space
        isInviteFlow.value = true
        requiresApproval.value = true
        validatedToken.value = token
        joinMessage.value = ''
        showConfirmDialog.value = true
      } else {
        processingJoin.value = true
        try {
          await acceptInvite({ token })
          toast.success('Joined sanctuary successfully!')
          emit('success', inviteInfo.space)
          refetchUserSpaces()
          queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
          queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
        } catch (err: any) {
          toast.error(err.message || 'Failed to accept invitation.')
        } finally {
          processingJoin.value = false
        }
      }
    }
  } catch (err: any) {
    toast.error(err.message || 'Invite link is invalid or has expired.')
  }
}

const handleJoinPublic = async (space: Space) => {
  if (space.visibility === 'PUBLIC') {
    joiningUuid.value = space.uuid
    try {
      await requestJoin({ uuid: space.uuid })
      toast.success('Joined sanctuary successfully!')
      refetchUserSpaces()
      queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
      queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
      queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
    } catch (err: any) {
      toast.error(err.message || 'Failed to join sanctuary.')
    } finally {
      joiningUuid.value = ''
    }
  } else {
    selectedSpace.value = space
    isInviteFlow.value = false
    requiresApproval.value = true
    joinMessage.value = ''
    showConfirmDialog.value = true
  }
}

const submitJoinAction = async () => {
  if (!selectedSpace.value) return

  processingJoin.value = true
  try {
    if (isInviteFlow.value) {
      await acceptInvite({ token: validatedToken.value, message: joinMessage.value })
      toast.success(requiresApproval.value ? 'Entry request sent successfully!' : 'Joined sanctuary successfully!')
      showConfirmDialog.value = false
      emit('close')
      emit('success', selectedSpace.value)
    } else {
      await requestJoin({ uuid: selectedSpace.value.uuid, message: joinMessage.value })
      toast.success('Entry request sent successfully!')
      showConfirmDialog.value = false
    }
    refetchUserSpaces()
    queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
  } catch (err: any) {
    toast.error(err.message || 'Failed to complete action.')
  } finally {
    processingJoin.value = false
  }
}

const handleApproveRequest = async (spaceUuid: string, userId: number) => {
  const key = `${spaceUuid}-${userId}`
  approvingUuid.value = key
  try {
    await approveMember({ uuid: spaceUuid, memberUserId: userId })
    toast.success('Approved join request successfully!')
    refetchUserSpaces()
    queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
  } catch (err: any) {
    toast.error(err.message || 'Failed to approve request.')
  } finally {
    approvingUuid.value = ''
  }
}

const handleRejectRequest = async (spaceUuid: string, userId: number) => {
  const key = `${spaceUuid}-${userId}`
  approvingUuid.value = key
  try {
    await rejectMember({ uuid: spaceUuid, memberUserId: userId })
    toast.success('Rejected join request.')
    refetchUserSpaces()
    queryClient.invalidateQueries({ queryKey: ['spaces-list'] })
    queryClient.invalidateQueries({ queryKey: ['spaces-list-infinite'] })
  } catch (err: any) {
    toast.error(err.message || 'Failed to reject request.')
  } finally {
    approvingUuid.value = ''
  }
}

const handleWithdrawRequest = async (spaceUuid: string) => {
  if (!authStore.user) return
  try {
    await removeMember({ uuid: spaceUuid, memberUserId: authStore.user.id })
    toast.success('Withdrew join request successfully.')
    refetchUserSpaces()
    queryClient.invalidateQueries({ queryKey: ['spaces-search'] })
  } catch (err: any) {
    toast.error(err.message || 'Failed to withdraw request.')
  }
}

onMounted(() => {
  refetchUserSpaces()
})
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
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
