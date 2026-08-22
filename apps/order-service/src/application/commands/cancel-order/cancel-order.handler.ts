import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderAggregate } from '../../../domain/aggregates/order.aggregate';
import { IOrderEventStore, ORDER_EVENT_STORE } from '../../ports/order-event-store.port';
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/repositories/order.repository';
import { IEventPublisher, EVENT_PUBLISHER } from '../../ports/event-publisher.port';
import { CancelOrderCommand } from './cancel-order.command';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(@Inject(ORDER_EVENT_STORE) private readonly eventStore: IOrderEventStore, @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository, @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher) {}
  async execute(command: CancelOrderCommand) {
    const events = await this.eventStore.load(command.orderId);
    const order = OrderAggregate.rehydrate(command.orderId, events);
    order.cancel(command.reason);
    const newEvents = order.pullEvents();
    await this.eventStore.append(newEvents);
    await this.repository.save(order);
    for (const event of newEvents) await this.publisher.publish(event);
    return order.snapshot;
  }
}
