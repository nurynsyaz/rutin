export type ErrorCode =
    | 'UNAUTHENTICATED'
    | 'FORBIDDEN'
    | 'VALIDATION'
    | 'CONFLICT'
    | 'NETWORK'
    | 'FILE_TOO_LARGE'
    | 'FILE_TYPE_NOT_ALLOWED'
    | 'FILE_LIMIT_REACHED'

export interface DomainError {
    code: ErrorCode
    /** Field → code, for form mapping. Never a user-facing sentence. */
    fields?: Record<string, string>
    /** e.g. { maxMb: 10, actualMb: 12.4 } so the UI can build the message. */
    meta?: Record<string, unknown>
}

export type Result<T, E = DomainError> =
    | { ok: true, value: T }
    | { ok: false; error: E }

export const ok = <T>(value: T): Result<T> => ({ ok: true, value })
export const fail = <E = DomainError>(error: E): Result<never, E> => ({ ok: false, error })