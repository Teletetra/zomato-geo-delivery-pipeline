import { OrderEntity } from '../entities/order.entity';

export const OrderRepository = Symbol('OrderRepository');
export interface IOrderRepository {
  findById(id: string): Promise<OrderEntity | null>;
  save(entity: OrderEntity): Promise<void>;
}
