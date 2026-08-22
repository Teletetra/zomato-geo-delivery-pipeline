import { Module } from '@nestjs/common';
import { DeliveryRepository } from './domain/repositories/delivery.repository';
import { GeoDispatchService } from './application/services/geo-dispatch.service';
import { DeliveryEventsPublisher } from './application/ports/delivery-events.port';
import { InMemoryDeliveryRepository } from './infrastructure/persistence/in-memory-delivery.repository';
import { KafkaDeliveryEventsPublisher } from './infrastructure/events/kafka-delivery.events.publisher';
import { DeliveryController } from './interfaces/http/controllers/delivery.controller';
import { KafkaPublisher } from '../../../libs/kafka/src/kafka.publisher';

@Module({
  controllers: [DeliveryController],
  providers: [
    GeoDispatchService,
    KafkaPublisher,
    InMemoryDeliveryRepository,
    KafkaDeliveryEventsPublisher,
    { provide: DeliveryRepository, useExisting: InMemoryDeliveryRepository },
    { provide: DeliveryEventsPublisher, useExisting: KafkaDeliveryEventsPublisher },
  ],
})
export class AppModule {}
