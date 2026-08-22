import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';
import { GetOrderQuery } from './get-order.query';
import { IOrderReadRepository, ORDER_READ_REPOSITORY } from '../../ports/order-read-repository.port';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(@Inject(ORDER_READ_REPOSITORY) private readonly readRepository: IOrderReadRepository) {}
  async execute(query: GetOrderQuery) {
    const order = await this.readRepository.findById(query.orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
