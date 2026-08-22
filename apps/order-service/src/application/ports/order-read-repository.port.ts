export const ORDER_READ_REPOSITORY = Symbol('ORDER_READ_REPOSITORY');
export interface OrderReadModel {
  id: string;
  customerId: string;
  restaurantId: string;
  total: number;
  status: string;
  version: number;
  items: Array<{ menuItemId: string; quantity: number; unitPrice: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderReadRepository {
  findById(id: string): Promise<OrderReadModel | null>;
  findByCustomerId(customerId: string): Promise<OrderReadModel[]>;
}
