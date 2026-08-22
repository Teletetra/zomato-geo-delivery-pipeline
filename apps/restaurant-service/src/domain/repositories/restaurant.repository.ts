import { RestaurantEntity } from '../entities/restaurant.entity';
export const RESTAURANT_REPOSITORY = Symbol('RESTAURANT_REPOSITORY');
export interface IRestaurantRepository {
  findById(id: string): Promise<RestaurantEntity | null>;
  search(query?: string): Promise<RestaurantEntity[]>;
  save(entity: RestaurantEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
