export type Role = 'member' | 'admin'

export type Permission =
  | 'routine:read'
  | 'routine:write'
  | 'attachment:upload'
  | 'attachment:download'
  | 'attachment:delete'
  | 'profile:write'
  | 'admin:users:read'