import mitt from 'mitt'
import type { DomainEventName, DomainEvents } from './catalogue'

export interface EventBus {
    publish<K extends DomainEventName>(name: K, payload: DomainEvents[K]): void
    subscribe<K extends DomainEventName>(
        name: K,
        handler: (payload: DomainEvents[K]) => void,
    ): () => void
}

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