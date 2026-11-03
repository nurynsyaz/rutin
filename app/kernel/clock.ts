export interface Clock {
  now(): Date
}

export const systemClock: Clock = {
  now: () => new Date(),
}

/** Pin "now" for tests and demos. */
export function fixedClock(iso: string): Clock {
  const at = new Date(iso)
  return { now: () => new Date(at) }
}