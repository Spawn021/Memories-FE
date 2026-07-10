export interface User {
  id: string
  uuid: string
  email: string
  username: string
  globalRole: string
  displayName: string | null
  avatarUrl: string | null
  birthdate: string | null
  sessionId?: number
}
