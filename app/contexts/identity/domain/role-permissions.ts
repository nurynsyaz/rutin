import type { Permission, Role } from './types'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  member: [
    'routine:read',
    'routine:write',
    'attachment:upload',
    'attachment:download',
    'attachment:delete',
    'profile:write',
  ],
  admin: [
    'routine:read',
    'routine:write',
    'attachment:upload',
    'attachment:download',
    'attachment:delete',
    'profile:write',
    'admin:users:read',
  ],
}