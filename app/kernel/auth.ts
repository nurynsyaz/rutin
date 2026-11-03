export type Role = 'member' | 'admin'

export type Permission =
    | 'routine:read'
    | 'routine:write'
    | 'attachment:upload'
    | 'attachment:download'
    | 'attachment:delete'
    | 'profile:write'
    | 'admin:users:read'

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