export class RestaurantStatusChangedEvent {
  readonly type = 'restaurant.status.changed';
  constructor(public readonly payload: { id: string; isOpen: boolean; occurredAt: string }) {}
}
