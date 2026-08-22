import { DomainError } from '@common/errors';
import { OrderStatus } from '@common/enums';

export type OrderProps = {
  customerId: string;
  restaurantId: string;
  items: Array<{ menuItemId: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
};

export class OrderAggregate {
  private constructor(
    public readonly id: string,
    private props: OrderProps,
    private pendingEvents: object[] = [],
  ) {}

  static create(id: string, input: Omit<OrderProps, 'status'>) {
    if (!input.items.length) throw new DomainError('Order must contain at least one item');
    const order = new OrderAggregate(id, { ...input, status: OrderStatus.CREATED });
    order.pendingEvents.push({ type: 'OrderCreated', orderId: id, ...input });
    return order;
  }

  confirm() {
    if (this.props.status !== OrderStatus.CREATED) throw new DomainError('Only CREATED orders can be confirmed');
    this.props.status = OrderStatus.CONFIRMED;
    this.pendingEvents.push({ type: 'OrderConfirmed', orderId: this.id });
  }

  cancel(reason: string) {
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(this.props.status)) throw new DomainError('Order cannot be cancelled');
    this.props.status = OrderStatus.CANCELLED;
    this.pendingEvents.push({ type: 'OrderCancelled', orderId: this.id, reason });
  }

  get status() { return this.props.status; }
  get snapshot(): OrderProps { return { ...this.props, items: [...this.props.items] }; }
  pullEvents() { const events = [...this.pendingEvents]; this.pendingEvents = []; return events; }
}
