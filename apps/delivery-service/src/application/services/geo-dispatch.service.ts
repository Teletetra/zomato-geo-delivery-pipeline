import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryAggregate } from '../../domain/entities/delivery.aggregate';
import { DeliveryRepository, IDeliveryRepository } from '../../domain/repositories/delivery.repository';
import { DriverRepository, IDriverRepository } from '../../domain/repositories/driver.repository';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { DeliveryEventsPublisher, IDeliveryEventsPublisher } from '../ports/delivery-events.port';

@Injectable()
export class GeoDispatchService {
  constructor(
    @Inject(DeliveryRepository) private readonly deliveries: IDeliveryRepository,
    @Inject(DriverRepository) private readonly drivers: IDriverRepository,
    @Inject(DeliveryEventsPublisher) private readonly events: IDeliveryEventsPublisher,
  ) {}

  async createDelivery(input: {
    id: string;
    orderId: string;
    customerId: string;
    restaurantId: string;
    pickup: { latitude: number; longitude: number };
    drop: { latitude: number; longitude: number };
  }): Promise<DeliveryAggregate> {
    const existing = await this.deliveries.findByOrderId(input.orderId);
    if (existing) return existing;

    const delivery = DeliveryAggregate.create({
      id: input.id,
      orderId: input.orderId,
      customerId: input.customerId,
      restaurantId: input.restaurantId,
      pickupLocation: new GeoPoint(input.pickup.latitude, input.pickup.longitude),
      dropLocation: new GeoPoint(input.drop.latitude, input.drop.longitude),
    });

    await this.deliveries.save(delivery);
    return delivery;
  }

  async findAndAssignNearestPartner(deliveryId: string, radiusKm = 5): Promise<DeliveryAggregate> {
    const delivery = await this.deliveries.findById(deliveryId);
    if (!delivery) throw new NotFoundException(`Delivery ${deliveryId} not found`);

    const origin = delivery.props.pickupLocation;
    const partners = await this.drivers.getNearby(origin, radiusKm);
    const candidates = partners
      .filter((partner) => partner.available)
      .map((partner) => ({
        ...partner,
        distanceKm: origin.distanceKmTo(new GeoPoint(partner.latitude, partner.longitude)),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const nearest = candidates[0];
    if (!nearest) return delivery;

    delivery.assignPartner(nearest.driverId, new GeoPoint(nearest.latitude, nearest.longitude));
    await this.deliveries.save(delivery);
    await this.drivers.markAvailability(nearest.driverId, false);

    await this.events.publishAssigned({
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      orderId: delivery.props.orderId,
      deliveryPartnerId: nearest.driverId,
    });

    return delivery;
  }

  async updateStatus(deliveryId: string, status: Parameters<DeliveryAggregate['transitionTo']>[0]): Promise<DeliveryAggregate> {
    const delivery = await this.deliveries.findById(deliveryId);
    if (!delivery) throw new NotFoundException(`Delivery ${deliveryId} not found`);

    delivery.transitionTo(status);
    await this.deliveries.save(delivery);

    if (status === 'DELIVERED' || status === 'CANCELLED') {
      const partnerId = delivery.props.deliveryPartnerId;
      if (partnerId) await this.drivers.markAvailability(partnerId, true);
    }

    await this.events.publishStatusChanged({
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      orderId: delivery.props.orderId,
      status,
    });

    return delivery;
  }

  async get(deliveryId: string): Promise<DeliveryAggregate> {
    const delivery = await this.deliveries.findById(deliveryId);
    if (!delivery) throw new NotFoundException(`Delivery ${deliveryId} not found`);
    return delivery;
  }
}
