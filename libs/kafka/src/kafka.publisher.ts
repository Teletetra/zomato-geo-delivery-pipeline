import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KafkaPublisher {
  private readonly logger = new Logger(KafkaPublisher.name);
  async publish(topic: string, message: unknown): Promise<void> {
    this.logger.debug(`publish ${topic}: ${JSON.stringify(message)}`);
    // Wire @nestjs/microservices ClientKafka / kafkajs here.
  }
}
