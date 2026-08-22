import { Injectable } from '@nestjs/common';
import { DeliveryAggregate } from '../../domain/entities/delivery.aggregate';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { IDeliveryRepository, NearbyPartner } from '../../domain/repositories/delivery.repository';

@Injectable()
export class InMemoryDeliveryRepository implements IDeliveryRepository {
  private readonly deliveries = new Map<string, DeliveryAggregate>();

  private readonly partners: NearbyPartner[] = [
    { id: 'partner-101', latitude: 28.4595, longitude: 77.0266, available: true },
    { id: 'partner-102', latitude: 28.4708, longitude: 77.0219, available: true },
    { id: 'partner-103', latitude: 28.4358, longitude: 77.0032, available: false },
  ];

  async findById(id: string): Promise<DeliveryAggregate | null> {
    return this.deliveries.get(id) ?? null;
  }

  async findByOrderId(orderId: string): Promise<DeliveryAggregate | null> {
    for (const delivery of this.deliveries.values()) {
      if (delivery.props.orderId === orderId) return delivery;
    }
    return null;
  }

  async findNearbyPartners(
    location: { latitude: number; longitude: number },
    radiusKm: number,
  ): Promise<NearbyPartner[]> {
    const origin = new GeoPoint(location.latitude, location.longitude);
    return this.partners.filter((partner) =>
      origin.distanceKmTo(new GeoPoint(partner.latitude, partner.longitude)) <= radiusKm,
    );
  }

  async save(entity: DeliveryAggregate): Promise<void> {
    this.deliveries.set(entity.id, entity);
  }
}
