<template>
  <div
    class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
    @click.self="$emit('close')"
  >
    <div
      class="bg-surface border border-border p-6 md:p-8 shadow-2xl relative rotate-[1deg] hover:rotate-0 transition-all duration-300 max-w-lg w-full max-h-[90vh] flex flex-col overflow-y-auto custom-scroll"
    >
      <!-- Modal Header -->
      <header class="mb-6 flex justify-between items-start">
        <div>
          <h2 class="font-title text-2xl font-bold text-on-surface">Sanctuary Settings</h2>
          <p class="text-[12px] text-secondary">Manage members and invite access for 🌿 {{ space?.name }}</p>
        </div>
        <button
          class="spring-btn text-secondary/50 hover:text-primary cursor-pointer p-1"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <!-- Tab Buttons (Custom CSS Tabs) -->
      <div class="flex border-b border-border mb-6">
        <button
          class="flex-1 pb-3 text-[13px] uppercase tracking-widest font-title font-bold transition-all border-b-2 cursor-pointer"
          :class="activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-secondary/60'"
          @click="activeTab = 'members'"
        >
          Members ({{ activeMembers.length }})
        </button>
        <button
          v-if="activeRole === 'OWNER' || activeRole === 'ADMIN'"
          class="flex-1 pb-3 text-[13px] uppercase tracking-widest font-title font-bold transition-all border-b-2 cursor-pointer"
          :class="activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-secondary/60'"
          @click="activeTab = 'requests'"
        >
          Requests ({{ pendingMembers.length }})
        </button>
        <button
          class="flex-1 pb-3 text-[13px] uppercase tracking-widest font-title font-bold transition-all border-b-2 cursor-pointer"
          :class="activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-secondary/60'"
          @click="activeTab = 'invite'"
        >
          Generate Invite
        </button>
      </div>

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
            <p class="text-[10px] text-secondary/50 italic">This link is multi-use and expires in {{ inviteForm.expiresInHours }} hours.</p>
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
          Close Settings
        </v-btn>
      </div>
    </div>
  </div>
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

const loading = computed(() => updateLoading.value || removeLoading.value || inviteLoading.value || approveLoading.value || rejectLoading.value)

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
  await submitUpdateRole({ uuid: props.space.uuid, memberUserId, role: newRole })
  if (updateError.value) {
    toast.error(updateError.value.message)
  } else {
    toast.success('Member role updated')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  }
}

const handleKick = async (memberUserId: number) => {
  if (!confirm('Are you sure you want to remove this member from the space?')) return
  await submitRemoveMember({ uuid: props.space.uuid, memberUserId })
  if (removeError.value) {
    toast.error(removeError.value.message)
  } else {
    toast.success('Member removed')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
    emit('close')
  }
}

const handleApprove = async (memberUserId: number) => {
  await submitApproveMember({ uuid: props.space.uuid, memberUserId })
  if (approveError.value) {
    toast.error(approveError.value.message)
  } else {
    toast.success('Member request approved!')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  }
}

const handleReject = async (memberUserId: number) => {
  if (!confirm('Are you sure you want to reject this request?')) return
  await submitRejectMember({ uuid: props.space.uuid, memberUserId })
  if (rejectError.value) {
    toast.error(rejectError.value.message)
  } else {
    toast.success('Member request rejected.')
    await refreshNuxtData(`space-detail-${props.space.slug}`)
  }
}

const generateLink = async () => {
  inviteToken.value = ''
  await submitCreateInvite({
    uuid: props.space.uuid,
    role: inviteForm.value.role,
    expiresInHours: inviteForm.value.expiresInHours,
  })
  if (inviteError.value) {
    toast.error(inviteError.value.message)
  } else if (inviteData.value) {
    inviteToken.value = inviteData.value.token
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
