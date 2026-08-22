export class RestaurantCreatedEvent {
  readonly type = 'restaurant.created';
  constructor(public readonly payload: { id: string; name: string; address: string; isOpen: boolean; occurredAt: string }) {}
}
