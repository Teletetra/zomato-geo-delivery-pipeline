import { OrderDomainEvent } from '../../domain/events/order.event';

export const ORDER_EVENT_STORE = Symbol('ORDER_EVENT_STORE');
export interface IOrderEventStore {
  append(events: OrderDomainEvent[]): Promise<void>;
  load(aggregateId: string): Promise<OrderDomainEvent[]>;
}
