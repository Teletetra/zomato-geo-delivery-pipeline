export interface OrderCreatedEvent {
  type: 'OrderCreated';
  eventId: string;
  occurredAt: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  total: number;
}

export interface OrderConfirmedEvent {
  type: 'OrderConfirmed';
  eventId: string;
  occurredAt: string;
  orderId: string;
}
