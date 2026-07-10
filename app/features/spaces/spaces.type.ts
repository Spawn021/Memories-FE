import type { PaginationQuery } from '~/types'
import type { User } from '../auth/auth.type'
import { ACTIVE_TAB, VIEW_MODE } from './spaces.constant'

export type SpaceType = 'PERSONAL' | 'COUPLE' | 'FAMILY' | 'FRIENDS'
export type SpaceVisibility = 'PRIVATE' | 'PUBLIC'
export type SpaceRole = 'OWNER' | 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER'
export type SpaceMemberStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'
export type ViewMode = (typeof VIEW_MODE)[keyof typeof VIEW_MODE]
export type ActiveTab = (typeof ACTIVE_TAB)[keyof typeof ACTIVE_TAB]

export interface SpaceMember {
  id: number
  spaceId: number
  userId: number
  role: SpaceRole
  status: SpaceMemberStatus
  joinRequestMessage: string | null
  joinedAt: string
  user: User
}

export interface Space {
  id: number
  uuid: string
  name: string
  slug: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  type: SpaceType
  visibility: SpaceVisibility
  ownerId: number
  themeKey: string
  layoutKey: string
  createdAt: string
  updatedAt: string
  members: SpaceMember[]
}

export interface CreateSpaceDto {
  name: string
  description?: string
  avatarUrl?: string
  coverUrl?: string
  type: SpaceType
  visibility: SpaceVisibility
  themeKey?: string
  layoutKey?: string
}

export interface UpdateSpaceDto {
  name?: string
  description?: string
  avatarUrl?: string
  coverUrl?: string
  visibility?: SpaceVisibility
  themeKey?: string
  layoutKey?: string
}

export interface GetSpacesQuery extends PaginationQuery {
  role?: 'OWNER' | 'MEMBER'
  search?: string
  type?: SpaceType
}

export interface UpdateMemberRoleDto {
  uuid: string
  memberUserId: number
  role: SpaceRole
}

export interface RemoveMemberDto {
  uuid: string
  memberUserId: number
}

export interface CreateInviteDto {
  uuid: string
  role: SpaceRole
  expiresInHours: number
}
