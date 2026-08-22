export interface DeliveryStatusChangedEvent {
  type: 'DeliveryStatusChanged';
  eventId: string;
  occurredAt: string;
  orderId: string;
  status: string;
}
