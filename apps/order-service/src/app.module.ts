import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from './interfaces/http/controllers/order.controller';
import { CreateOrderHandler } from './application/commands/create-order.handler';
import { GetOrderHandler } from './application/queries/get-order.handler';
import { KafkaPublisher } from '@kafka/kafka.publisher';

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [KafkaPublisher, CreateOrderHandler, GetOrderHandler],
})
export class AppModule {}
