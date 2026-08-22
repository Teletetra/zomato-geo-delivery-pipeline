import { OrderDomainEvent } from '../../domain/events/order.event';

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');
export interface IEventPublisher {
  publish(event: OrderDomainEvent): Promise<void>;
}
