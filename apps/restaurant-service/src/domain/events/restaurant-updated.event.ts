export class RestaurantUpdatedEvent {
  readonly type = 'restaurant.updated';
  constructor(public readonly payload: { id: string; name: string; description?: string | null; address: string; isOpen: boolean; occurredAt: string }) {}
}
