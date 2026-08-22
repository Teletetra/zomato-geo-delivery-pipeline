import { DeliveryEntity } from '../entities/delivery.entity';

export const DeliveryRepository = Symbol('DeliveryRepository');
export interface IDeliveryRepository {
  findById(id: string): Promise<DeliveryEntity | null>;
  save(entity: DeliveryEntity): Promise<void>;
}
