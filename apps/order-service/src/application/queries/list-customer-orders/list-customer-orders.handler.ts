import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListCustomerOrdersQuery } from './list-customer-orders.query';
import { IOrderReadRepository, ORDER_READ_REPOSITORY } from '../../ports/order-read-repository.port';

@QueryHandler(ListCustomerOrdersQuery)
export class ListCustomerOrdersHandler implements IQueryHandler<ListCustomerOrdersQuery> {
  constructor(@Inject(ORDER_READ_REPOSITORY) private readonly readRepository: IOrderReadRepository) {}
  execute(query: ListCustomerOrdersQuery) { return this.readRepository.findByCustomerId(query.customerId); }
}
