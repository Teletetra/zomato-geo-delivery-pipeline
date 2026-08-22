export const RESTAURANT_READ_PORT = Symbol('RESTAURANT_READ_PORT');
export interface RestaurantReadPort { getById(id: string): Promise<unknown | null>; search(query?: string): Promise<unknown[]>; }
