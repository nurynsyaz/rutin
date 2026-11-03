import type { DomainEventName, DomainEvents } from './catalogue'

export interface EventBus {
  publish<K extends DomainEventName>(name: K, payload: DomainEvents[K]): void
  subscribe<K extends DomainEventName>(
    name: K,
    handler: (payload: DomainEvents[K]) => void,
  ): () => void
}