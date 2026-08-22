import { DeliveryAggregate } from '../entities/delivery.aggregate';

export const DeliveryRepository = Symbol('DeliveryRepository');

export interface NearbyPartner {
  id: string;
  latitude: number;
  longitude: number;
  available: boolean;
}

export interface IDeliveryRepository {
  findById(id: string): Promise<DeliveryAggregate | null>;
  findByOrderId(orderId: string): Promise<DeliveryAggregate | null>;
  findNearbyPartners(location: { latitude: number; longitude: number }, radiusKm: number): Promise<NearbyPartner[]>;
  save(entity: DeliveryAggregate): Promise<void>;
}
