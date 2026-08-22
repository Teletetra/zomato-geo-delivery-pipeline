export const RESTAURANT_EVENT_PUBLISHER = Symbol('RESTAURANT_EVENT_PUBLISHER');
export interface IRestaurantEventPublisher { publish(topic: string, payload: unknown, key?: string): Promise<void>; }
