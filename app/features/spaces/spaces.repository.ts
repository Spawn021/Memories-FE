import type {
  Space,
  CreateSpaceDto,
  UpdateSpaceDto,
  SpaceMember,
  GetSpacesQuery,
  UpdateMemberRoleDto,
  RemoveMemberDto,
  CreateInviteDto,
} from '~/features/spaces/spaces.type'
import type { PaginatedResult, ApiSuccessMessage } from '~/types'

export const spacesRepository = () => {
  const api = useApi()
  return {
    async findAll(query?: GetSpacesQuery): Promise<PaginatedResult<Space>> {
      return api<PaginatedResult<Space>>('/spaces', {
        method: 'GET',
        query: cleanQuery(query),
      })
    },

    async findOne(uuidOrSlug: string): Promise<Space> {
      return api<Space>(`/spaces/${uuidOrSlug}`, {
        method: 'GET',
      })
    },

    async create(body: CreateSpaceDto): Promise<Space> {
      return api<Space>('/spaces', {
        method: 'POST',
        body,
      })
    },

    async update(uuid: string, body: UpdateSpaceDto): Promise<Space> {
      return api<Space>(`/spaces/${uuid}`, {
        method: 'PATCH',
        body,
      })
    },

    async remove(uuid: string): Promise<void> {
      await api(`/spaces/${uuid}`, {
        method: 'DELETE',
      })
    },

    async getMembers(uuid: string): Promise<SpaceMember[]> {
      return api<SpaceMember[]>(`/spaces/${uuid}/members`, {
        method: 'GET',
      })
    },

    async acceptInvite(params: { token: string; message?: string }): Promise<ApiSuccessMessage & { space: Space }> {
      return api<ApiSuccessMessage & { space: Space }>('/spaces/invites/accept', {
        method: 'POST',
        body: params,
      })
    },

    async validateInvite(token: string): Promise<any> {
      return api<any>('/spaces/invites/validate', {
        method: 'GET',
        query: { token },
      })
    },

    async updateMemberRole(params: UpdateMemberRoleDto): Promise<ApiSuccessMessage> {
      return api<ApiSuccessMessage>(`/spaces/${params.uuid}/members/${params.memberUserId}/role`, {
        method: 'PATCH',
        body: { role: params.role },
      })
    },

    async removeMember(params: RemoveMemberDto): Promise<ApiSuccessMessage> {
      return api<ApiSuccessMessage>(`/spaces/${params.uuid}/members/${params.memberUserId}`, {
        method: 'DELETE',
      })
    },

    async createInvite(params: CreateInviteDto): Promise<{ token: string }> {
      return api<{ token: string }>(`/spaces/${params.uuid}/invites`, {
        method: 'POST',
        body: { role: params.role, expiresInHours: params.expiresInHours },
      })
    },

    async search(q: string): Promise<Space[]> {
      return api<Space[]>('/spaces/search', {
        method: 'GET',
        query: { q },
      })
    },

    async requestToJoin(uuid: string, message?: string): Promise<ApiSuccessMessage> {
      return api<ApiSuccessMessage>(`/spaces/${uuid}/join-request`, {
        method: 'POST',
        body: { message },
      })
    },

    async approveMember(uuid: string, memberUserId: number): Promise<ApiSuccessMessage> {
      return api<ApiSuccessMessage>(`/spaces/${uuid}/members/${memberUserId}/approve`, {
        method: 'POST',
      })
    },

    async rejectMember(uuid: string, memberUserId: number): Promise<ApiSuccessMessage> {
      return api<ApiSuccessMessage>(`/spaces/${uuid}/members/${memberUserId}/reject`, {
        method: 'POST',
      })
    },
  }
}
