import type { FileId, RoutineId, UserId } from '../ids'
import type { Permission, Role } from '../../contexts/identity/domain/types'

interface Base {
    v: 1
    occurredAt: string
}

export interface DomainEvents {
    'identity.SignedIn': Base & { userId: UserId; role: Role; permissions: Permission[] }
    'identity.SignedOut': Base & { userId: UserId; reason: 'user' | 'expired' }
    'identity.SessionExpiring': Base & { expiresAt: string }
    'identity.AccessDenied': Base & { path: string; required: Permission }

    'profile.ProfileUpdated': Base & { userId: UserId; changes: Record<string, unknown> }

    'scheduling.RoutineCreated': Base & { routineId: RoutineId; scope: 'one' | 'future' }
    'scheduling.RoutineUpdated': Base & { routineId: RoutineId; scope: 'one' | 'future' }
    'scheduling.RoutineDeleted': Base & { routineId: RoutineId }
    'scheduling.OccurrenceCompleted': Base & { routineId: RoutineId; date: string }
    'scheduling.OccurrenceReopened': Base & { routineId: RoutineId; date: string }

    'attachments.FileUploaded': Base & {
        fileId: FileId
        routineId?: RoutineId
        name: string
        size: number
        mime: string
    }
    'attachments.FileUploadFailed': Base & { name: string; reason: string }
    'attachments.FileDeleted': Base & { fileId: FileId; routineId?: RoutineId }

    'shell.ConnectivityChanged': Base & { online: boolean }
}

export type DomainEventName = keyof DomainEvents