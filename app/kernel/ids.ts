declare const brand: unique symbol
type Brand<T, B extends string> = T & { readonly [brand]: B }

export type UserId = Brand<string, 'UserId'>
export type RoutineId = Brand<string, 'RoutineId'>
export type FileId = Brand<string, 'FileId'>
export type OccurrenceId = Brand<string, 'OccurrenceId'>

export const newId = <T extends string>(prefix: string): T =>
    `${prefix}_${crypto.randomUUID()}` as T

export const asUserId = (v: string) => v as UserId
export const asRoutineId = (v: string) => v as RoutineId
export const asFileId = (v: string) => v as FileId