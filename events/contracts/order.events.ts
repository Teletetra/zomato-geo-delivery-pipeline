export interface DeliveryLocation {
  latitude: number;
  longitude: number;
}

export interface OrderCreatedEvent {
  type: 'OrderCreated';
  eventId: string;
  occurredAt: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  total: number;
  pickup?: DeliveryLocation;
  drop?: DeliveryLocation;
}

export interface OrderConfirmedEvent {
  type: 'OrderConfirmed';
  eventId: string;
  occurredAt: string;
  orderId: string;
}
