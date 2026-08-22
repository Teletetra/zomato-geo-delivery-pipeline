import { Module } from '@nestjs/common';
import { DeliveryRepository } from './domain/repositories/delivery.repository';
import { DriverRepository } from './domain/repositories/driver.repository';
import { GeoDispatchService } from './application/services/geo-dispatch.service';
import { DeliveryEventsPublisher } from './application/ports/delivery-events.port';
import { InMemoryDeliveryRepository } from './infrastructure/persistence/in-memory-delivery.repository';
import { InMemoryDriverRepository } from './infrastructure/persistence/in-memory-driver.repository';
import { KafkaDeliveryEventsPublisher } from './infrastructure/events/kafka-delivery.events.publisher';
import { OrderPaymentConsumer } from './infrastructure/messaging/order-payment.consumer';
import { DeliveryController } from './interfaces/http/controllers/delivery.controller';
import { DriverController } from './interfaces/http/controllers/driver.controller';
import { KafkaPublisher } from '../../../libs/kafka/src/kafka.publisher';

@Module({
  controllers: [DeliveryController, DriverController],
  providers: [
    GeoDispatchService,
    KafkaPublisher,
    OrderPaymentConsumer,
    InMemoryDeliveryRepository,
    InMemoryDriverRepository,
    KafkaDeliveryEventsPublisher,
    { provide: DeliveryRepository, useExisting: InMemoryDeliveryRepository },
    { provide: DriverRepository, useExisting: InMemoryDriverRepository },
    { provide: DeliveryEventsPublisher, useExisting: KafkaDeliveryEventsPublisher },
  ],
})
export class AppModule {}
