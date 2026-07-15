<template>
  <v-dialog
    :model-value="true"
    @update:model-value="$emit('close')"
    max-width="512px"
  >
    <v-card
      class="bg-surface border border-border rounded-2xl shadow-2xl relative rotate-[1deg] hover:rotate-0 transition-all duration-300 w-full max-h-[90vh] flex flex-col overflow-hidden"
    >
      <v-card-item class="px-6 py-5 md:px-8 shrink-0">
        <v-card-title class="font-title text-2xl font-bold text-on-surface">Sanctuary Settings</v-card-title>
        <v-card-subtitle class="text-[12px] text-secondary mt-1">Manage members and invite access for 🌿 {{ space?.name }}</v-card-subtitle>
        <template #append>
          <v-btn
            icon
            variant="plain"
            class="w-8! h-8! min-w-0! text-secondary/50 hover:text-primary transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined">close</span>
          </v-btn>
        </template>
      </v-card-item>

      <v-divider class="border-border/60" />

      <v-card-text class="flex-1 overflow-y-auto custom-scroll px-6 py-6 md:px-8">
        <v-tabs
          v-model="activeTab"
          color="primary"
          grow
          class="mb-6 border-b border-border/40"
        >
          <v-tab
            value="members"
            class="font-title text-[13px] font-bold uppercase tracking-widest"
          >
            Members ({{ activeMembers.length }})
          </v-tab>
          <v-tab
            v-if="activeRole === 'OWNER' || activeRole === 'ADMIN'"
            value="requests"
            class="font-title text-[13px] font-bold uppercase tracking-widest"
          >
            Requests ({{ pendingMembers.length }})
          </v-tab>
          <v-tab
            value="invite"
            class="font-title text-[13px] font-bold uppercase tracking-widest"
          >
            Generate Invite
          </v-tab>
        </v-tabs>

        <!-- Tab Content: Manage Members -->
        <div
          v-if="activeTab === 'members'"
          class="space-y-4 flex-grow overflow-y-auto custom-scroll max-h-[40vh] pr-1"
        >
          <div
            v-for="member in activeMembers"
            :key="member.id"
            class="flex items-center justify-between p-3 bg-background rounded-md border border-border"
          >
            <!-- Member profile -->
            <div class="flex items-center gap-3 overflow-hidden">
              <div
                class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm"
              >
                {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
              </div>
              <div class="overflow-hidden">
                <p class="font-bold text-[13px] leading-tight text-on-surface truncate">
                  {{ member.user.displayName || 'Member' }}
                  <span
                    v-if="String(member.userId) === String(authStore.user?.id)"
                    class="ml-1 text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded"
                  >
                    YOU
                  </span>
                </p>
                <p class="text-[11px] text-secondary truncate">
                  {{ member.user.email }}
                </p>
              </div>
            </div>

            <!-- Member role selector / Kick -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Role Selector Dropdown -->
              <select
                :value="member.role"
                :disabled="!canManage(member)"
                class="px-2.5 py-1 bg-surface border border-border rounded text-[12px] font-semibold text-on-surface focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                @change="handleRoleChange(member.userId, ($event.target as HTMLSelectElement).value as SpaceRole)"
              >
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="CONTRIBUTOR">Contributor</option>
                <option value="VIEWER">Viewer</option>
              </select>

              <!-- Kick member button -->
              <button
                v-if="canManage(member) && String(member.userId) !== String(authStore.user?.id)"
                class="spring-btn p-1.5 text-secondary/40 hover:text-error hover:bg-error/5 rounded transition-all cursor-pointer"
                title="Remove from space"
                @click="handleKick(member.userId)"
              >
                <span class="material-symbols-outlined !text-[18px]">person_remove</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content: Join Requests -->
        <div
          v-else-if="activeTab === 'requests'"
          class="space-y-4 flex-grow overflow-y-auto custom-scroll max-h-[40vh] pr-1"
        >
          <div
            v-if="pendingMembers.length === 0"
            class="py-8 text-center text-secondary/60 text-[13px] font-body"
          >
            No pending requests to join.
          </div>
          <div
            v-else
            v-for="member in pendingMembers"
            :key="member.id"
            class="p-4 bg-background rounded-md border border-border space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 overflow-hidden">
                <div
                  class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm"
                >
                  {{ member.user.displayName?.charAt(0).toUpperCase() || 'M' }}
                </div>
                <div class="overflow-hidden">
                  <p class="font-bold text-[13px] leading-tight text-on-surface truncate">
                    {{ member.user.displayName || 'Member' }}
                  </p>
                  <p class="text-[11px] text-secondary truncate">
                    {{ member.user.email }}
                  </p>
                </div>
              </div>

              <!-- Approve/Reject buttons -->
              <div class="flex gap-2">
                <button
                  class="spring-btn px-3 py-1 bg-success/10 hover:bg-success/20 text-success text-[11px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-0.5"
                  @click="handleApprove(member.userId)"
                >
                  <span class="material-symbols-outlined !text-[14px]">done</span>
                  Approve
                </button>
                <button
                  class="spring-btn px-3 py-1 bg-error/10 hover:bg-error/20 text-error text-[11px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-0.5"
                  @click="handleReject(member.userId)"
                >
                  <span class="material-symbols-outlined !text-[14px]">close</span>
                  Reject
                </button>
              </div>
            </div>
            <!-- Request message if any -->
            <div
              v-if="member.joinRequestMessage"
              class="p-2.5 bg-surface border border-border/50 rounded text-[12px] text-secondary/80 leading-relaxed font-body"
            >
              <span class="font-semibold block text-[10px] text-secondary/60 uppercase tracking-widest mb-0.5">Message:</span>
              "{{ member.joinRequestMessage }}"
            </div>
          </div>
        </div>

        <!-- Tab Content: Generate Invite Link -->
        <div
          v-else-if="activeTab === 'invite'"
          class="space-y-5"
        >
          <!-- Invite Role -->
          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">INVITE ROLE</label>
            <select
              v-model="inviteForm.role"
              class="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] cursor-pointer text-on-surface"
            >
              <option value="CONTRIBUTOR">Contributor (Can upload & edit own memories)</option>
              <option value="VIEWER">Viewer (Can only view & react/comment)</option>
              <option value="ADMIN">Admin (Full access except deleting space)</option>
            </select>
          </div>

          <!-- Expiration Time -->
          <div class="space-y-1.5">
            <label class="block font-body text-sm text-[12px] uppercase tracking-widest text-secondary">LINK EXPIRATION</label>
            <select
              v-model="inviteForm.expiresInHours"
              class="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-[14px] cursor-pointer text-on-surface"
            >
              <option :value="24">24 Hours</option>
              <option :value="48">48 Hours</option>
              <option :value="168">7 Days</option>
            </select>
          </div>

          <!-- Action / Generated link box -->
          <div class="pt-2 space-y-4">
            <v-btn
              color="primary"
              block
              size="large"
              :loading="loading"
              class="spring-btn font-body text-sm font-semibold tracking-wider uppercase h-11! rounded-md!"
              @click="generateLink"
            >
              Generate Invite Link
            </v-btn>

            <!-- Generated Link container -->
            <div
              v-if="generatedLink"
              class="p-4 bg-background border border-border rounded-md space-y-2 animate-fadeIn"
            >
              <p class="text-[10px] uppercase tracking-widest text-secondary/60 font-bold">Generated Link</p>
              <div class="flex gap-2">
                <input
                  ref="linkInput"
                  :value="generatedLink"
                  readonly
                  class="flex-1 px-3 py-1.5 bg-surface border border-border rounded text-[12px] text-secondary font-mono focus:outline-none"
                  type="text"
                  @click="selectAllText"
                />
                <button
                  class="spring-btn px-4 bg-secondary text-white hover:bg-secondary-hover text-[11px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  @click="copyToClipboard"
                >
                  <span class="material-symbols-outlined !text-[14px]">{{ copied ? 'check' : 'content_copy' }}</span>
                  {{ copied ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <p class="text-[10px] text-secondary/50 italic">
                This link is multi-use and expires in {{ inviteForm.expiresInHours }} hours.
              </p>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider class="border-border/60" />

      <v-card-actions class="px-6 py-4 md:px-8 flex justify-end shrink-0">
        <v-btn
          type="button"
          variant="outlined"
          size="large"
          class="spring-btn font-body text-sm font-semibold tracking-wider uppercase text-on-surface border-border h-11! rounded-md!"
          @click="$emit('close')"
        >
          Close Settings
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpaces } from '~/features/spaces/spaces.queries'
import { useAuthStore } from '~/stores/auth'
import type { Space, SpaceRole, SpaceMember } from '~/features/spaces/spaces.type'

const props = defineProps<{
  space: Space
}>()

const emit = defineEmits(['close'])

const { useUpdateMemberRole, useRemoveMember, useCreateInvite, useApproveMember, useRejectMember } = useSpaces()
const authStore = useAuthStore()

const activeTab = ref<'members' | 'requests' | 'invite'>('members')

const { mutateAsync: submitUpdateRole, error: updateError, isPending: updateLoading } = useUpdateMemberRole()
const { mutateAsync: submitRemoveMember, error: removeError, isPending: removeLoading } = useRemoveMember()
const { data: inviteData, mutateAsync: submitCreateInvite, error: inviteError, isPending: inviteLoading } = useCreateInvite()
const { mutateAsync: submitApproveMember, error: approveError, isPending: approveLoading } = useApproveMember()
const { mutateAsync: submitRejectMember, error: rejectError, isPending: rejectLoading } = useRejectMember()

const activeMembers = computed(() => {
  return props.space?.members.filter(m => m.status === 'ACTIVE') || []
})

const pendingMembers = computed(() => {
  return props.space?.members.filter(m => m.status === 'PENDING') || []
})

const loading = computed(
  () => updateLoading.value || removeLoading.value || inviteLoading.value || approveLoading.value || rejectLoading.value,
)

const activeRole = computed<SpaceRole | null>(() => {
  if (!props.space || !authStore.user) return null
  const member = props.space.members.find(m => String(m.userId) === String(authStore.user?.id))
  return member ? member.role : null
})

// Invite Form
const inviteForm = ref({
  role: 'CONTRIBUTOR' as SpaceRole,
  expiresInHours: 24,
})

const inviteToken = ref('')
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)

const generatedLink = computed(() => {
  if (!inviteToken.value) return ''
  if (!process.client) return ''
  return `${window.location.origin}/spaces/invite?token=${inviteToken.value}`
})

// Permissions check: Can user manage this member?
const canManage = (member: SpaceMember) => {
  const myRole = activeRole.value
  if (!myRole) return false

  // Cannot manage yourself or the owner
  if (String(member.userId) === String(authStore.user?.id)) return false
  if (member.role === 'OWNER') return false

  // Owner can manage everyone
  if (myRole === 'OWNER') return true

  // Admin can only manage contributor and viewer
  if (myRole === 'ADMIN') {
    return member.role === 'CONTRIBUTOR' || member.role === 'VIEWER'
  }

  return false
}

const toast = useToast()

const handleRoleChange = async (memberUserId: number, newRole: SpaceRole) => {
  try {
    await submitUpdateRole({ uuid: props.space.uuid, memberUserId, role: newRole })
    toast.success('Member role updated')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  } catch (err: any) {
    toast.error(err.message || 'Failed to update member role')
  }
}

const handleKick = async (memberUserId: number) => {
  if (!confirm('Are you sure you want to remove this member from the space?')) return
  try {
    await submitRemoveMember({ uuid: props.space.uuid, memberUserId })
    toast.success('Member removed')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
    emit('close')
  } catch (err: any) {
    toast.error(err.message || 'Failed to remove member')
  }
}

const handleApprove = async (memberUserId: number) => {
  try {
    await submitApproveMember({ uuid: props.space.uuid, memberUserId })
    toast.success('Member request approved!')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  } catch (err: any) {
    toast.error(err.message || 'Failed to approve member')
  }
}

const handleReject = async (memberUserId: number) => {
  if (!confirm('Are you sure you want to reject this request?')) return
  try {
    await submitRejectMember({ uuid: props.space.uuid, memberUserId })
    toast.success('Member request rejected.')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  } catch (err: any) {
    toast.error(err.message || 'Failed to reject request')
  }
}

const generateLink = async () => {
  inviteToken.value = ''
  try {
    await submitCreateInvite({
      uuid: props.space.uuid,
      role: inviteForm.value.role,
      expiresInHours: inviteForm.value.expiresInHours,
    })
    if (inviteData.value) {
      inviteToken.value = inviteData.value.token
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to create invite')
  }
}

const copyToClipboard = () => {
  if (!generatedLink.value) return

  navigator.clipboard.writeText(generatedLink.value).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

const selectAllText = () => {
  if (linkInput.value) {
    linkInput.value.select()
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
