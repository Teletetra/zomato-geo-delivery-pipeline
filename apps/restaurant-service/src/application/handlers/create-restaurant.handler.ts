import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateRestaurantCommand } from '../commands/create-restaurant.command';
import { RESTAURANT_REPOSITORY, IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { RESTAURANT_EVENT_PUBLISHER, IRestaurantEventPublisher } from '../ports/event-publisher.port';
import { RestaurantEntity } from '../../domain/entities/restaurant.entity';
import { RestaurantCreatedEvent } from '../../domain/events/restaurant-created.event';
@CommandHandler(CreateRestaurantCommand)
export class CreateRestaurantHandler implements ICommandHandler<CreateRestaurantCommand> {
  constructor(@Inject(RESTAURANT_REPOSITORY) private readonly repo: IRestaurantRepository, @Inject(RESTAURANT_EVENT_PUBLISHER) private readonly events: IRestaurantEventPublisher) {}
  async execute(cmd: CreateRestaurantCommand) { const entity=RestaurantEntity.create(cmd.input); await this.repo.save(entity); const p=entity.toPrimitives(); await this.events.publish('restaurant.created',new RestaurantCreatedEvent({id:p.id,name:p.name,address:p.address,isOpen:p.isOpen,occurredAt:new Date().toISOString()}).payload,p.id); return p; }
}
