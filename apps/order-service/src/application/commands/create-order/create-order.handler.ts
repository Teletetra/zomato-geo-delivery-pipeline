import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderAggregate } from '../../../domain/aggregates/order.aggregate';
import { ORDER_EVENT_STORE, IOrderEventStore } from '../../ports/order-event-store.port';
import { ORDER_REPOSITORY, IOrderRepository } from '../../../domain/repositories/order.repository';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';
import { CreateOrderCommand } from './create-order.command';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_EVENT_STORE) private readonly eventStore: IOrderEventStore,
    @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  async execute(command: CreateOrderCommand) {
    const order = OrderAggregate.create(randomUUID(), command);
    const events = order.pullEvents();
    await this.eventStore.append(events);
    await this.repository.save(order);
    for (const event of events) await this.publisher.publish(event);
    return order.snapshot;
  }
}
