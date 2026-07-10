export const VIEW_MODE = {
  GRID: 'GRID',
  TABLE: 'TABLE',
} as const

export const ACTIVE_TAB = {
  OWNER: 'OWNER',
  MEMBER: 'MEMBER',
} as const

export const VIEW_MODE_LIMIT = {
  [VIEW_MODE.GRID]: 11,
  [VIEW_MODE.TABLE]: 10,
} as const
