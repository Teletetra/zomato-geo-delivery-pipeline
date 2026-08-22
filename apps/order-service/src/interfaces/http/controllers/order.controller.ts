import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../../application/commands/create-order.command';
import { GetOrderQuery } from '../../../application/queries/get-order.query';

@Controller('orders')
export class OrderController {
  constructor(private readonly commands: CommandBus, private readonly queries: QueryBus) {}

  @Post()
  create(@Body() body: { customerId: string; restaurantId: string; items: Array<{ menuItemId: string; quantity: number; price: number }> }) {
    return this.commands.execute(new CreateOrderCommand(body.customerId, body.restaurantId, body.items));
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.queries.execute(new GetOrderQuery(id));
  }
}
