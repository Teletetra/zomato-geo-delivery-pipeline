import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { GeoDispatchService } from '../../application/services/geo-dispatch.service';

interface OrderCreatedPayload {
  type: 'OrderCreated';
  orderId: string;
  customerId: string;
  restaurantId: string;
  pickup?: { latitude: number; longitude: number };
  drop?: { latitude: number; longitude: number };
}

interface PaymentCompletedPayload {
  type: 'PaymentCompleted';
  orderId: string;
}

@Injectable()
export class OrderPaymentConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderPaymentConsumer.name);
  private readonly consumer: Consumer;
  private readonly kafka: Kafka;

  constructor(private readonly dispatch: GeoDispatchService) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID ?? 'zomato-delivery-consumer',
      brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',').map((v) => v.trim()),
    });
    this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_DELIVERY_GROUP_ID ?? 'delivery-service' });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: process.env.KAFKA_ORDER_TOPIC ?? 'order.events', fromBeginning: false });
    await this.consumer.subscribe({ topic: process.env.KAFKA_PAYMENT_TOPIC ?? 'payment.events', fromBeginning: false });
    await this.consumer.run({ eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      try {
        const event = JSON.parse(message.value.toString()) as OrderCreatedPayload | PaymentCompletedPayload;
        if (event.type === 'OrderCreated') {
          if (!event.pickup || !event.drop) {
            this.logger.warn(`OrderCreated ${event.orderId} has no geo coordinates; waiting for enriched event`);
            return;
          }
          const delivery = await this.dispatch.createDelivery({
            id: `delivery-${event.orderId}`,
            orderId: event.orderId,
            customerId: event.customerId,
            restaurantId: event.restaurantId,
            pickup: event.pickup,
            drop: event.drop,
          });
          await this.dispatch.findAndAssignNearestPartner(delivery.id, 5);
        }

        if (event.type === 'PaymentCompleted') {
          const delivery = await this.dispatch.get(`delivery-${event.orderId}`);
          if (!delivery.props.deliveryPartnerId) {
            await this.dispatch.findAndAssignNearestPartner(delivery.id, 5);
          }
        }
      } catch (error) {
        this.logger.error(`Failed to process ${topic} message`, error instanceof Error ? error.stack : String(error));
      }
    }});
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
