import { Injectable } from '@nestjs/common';
import { KafkaPublisher } from '../../../../../libs/kafka/src/kafka.publisher';
import { IDeliveryEventsPublisher } from '../../application/ports/delivery-events.port';

@Injectable()
export class KafkaDeliveryEventsPublisher implements IDeliveryEventsPublisher {
  constructor(private readonly kafka: KafkaPublisher) {}

  async publishAssigned(event: {
    eventId: string;
    occurredAt: string;
    orderId: string;
    deliveryPartnerId: string;
  }): Promise<void> {
    await this.kafka.publish('delivery.events', {
      type: 'DeliveryAssigned',
      ...event,
    });
  }

  async publishStatusChanged(event: {
    eventId: string;
    occurredAt: string;
    orderId: string;
    status: string;
  }): Promise<void> {
    await this.kafka.publish('delivery.events', {
      type: 'DeliveryStatusChanged',
      ...event,
    });
  }
}
