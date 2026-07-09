import type {
  Space,
  CreateSpaceDto,
  UpdateSpaceDto,
  SpaceMember,
  GetSpacesQuery,
  UpdateMemberRoleDto,
  RemoveMemberDto,
  CreateInviteDto,
} from '~/types/space'
import type { PaginatedResult, ApiSuccessMessage } from '~/types'

export const spacesRepository = () => {
  const api = useApi()
  return {
    async findAll(query?: GetSpacesQuery): Promise<PaginatedResult<Space>> {
      return api<PaginatedResult<Space>>('/spaces', {
        method: 'GET',
        query,
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

    async acceptInvite(token: string): Promise<ApiSuccessMessage & { space: Space }> {
      return api<ApiSuccessMessage & { space: Space }>('/spaces/invites/accept', {
        method: 'POST',
        body: { token },
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
  }
}
