export type CreateOrderItemInput = { menuItemId: string; quantity: number; unitPrice: number };

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string,
    public readonly items: CreateOrderItemInput[],
  ) {}
}
