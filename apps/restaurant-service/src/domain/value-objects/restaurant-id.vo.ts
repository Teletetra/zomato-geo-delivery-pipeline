export class RestaurantId {
  constructor(public readonly value: string) {
    if (!value?.trim()) throw new Error('Restaurant id is required');
  }
}
