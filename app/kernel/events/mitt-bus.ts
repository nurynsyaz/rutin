import mitt from 'mitt'
import type { DomainEventName, DomainEvents } from './catalogue'
import type { EventBus } from './bus'

export function createEventBus(): EventBus {
  const emitter = mitt<Record<string, unknown>>()

  return {
    publish(name, payload) {
      emitter.emit(name, payload)
    },
    subscribe(name, handler) {
      const wrapped = (payload: unknown) =>
        (handler as (p: unknown) => void)(payload)
      emitter.on(name, wrapped)
      return () => emitter.off(name, wrapped)
    },
  }
}