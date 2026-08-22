import { Injectable } from '@nestjs/common';
import { KafkaPublisher } from '@kafka/kafka.publisher';

@Injectable()
export class OrderEventPublisher {
  constructor(private readonly kafka: KafkaPublisher) {}
  publish(event: object) { return this.kafka.publish('order.events', event); }
}
