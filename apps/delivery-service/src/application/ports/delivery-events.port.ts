export const DeliveryEventsPublisher = Symbol('DeliveryEventsPublisher');

export interface IDeliveryEventsPublisher {
  publishAssigned(event: {
    eventId: string;
    occurredAt: string;
    orderId: string;
    deliveryPartnerId: string;
  }): Promise<void>;
  publishStatusChanged(event: {
    eventId: string;
    occurredAt: string;
    orderId: string;
    status: string;
  }): Promise<void>;
}
