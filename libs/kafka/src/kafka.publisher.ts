import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPublisher.name);
  private readonly producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID ?? 'zomato-delivery-service',
      brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',').map((v) => v.trim()),
    });
    this.producer = kafka.producer({ allowAutoTopicCreation: true });
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async publish(topic: string, message: unknown, key?: string): Promise<void> {
    await this.producer.send({ topic, messages: [{ key, value: JSON.stringify(message) }] });
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }
}
