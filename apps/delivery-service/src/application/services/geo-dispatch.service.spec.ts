import { GeoDispatchService } from './geo-dispatch.service';
import { InMemoryDeliveryRepository } from '../../infrastructure/persistence/in-memory-delivery.repository';
import { InMemoryDriverRepository } from '../../infrastructure/persistence/in-memory-driver.repository';
import { IDeliveryEventsPublisher } from '../ports/delivery-events.port';

describe('GeoDispatchService', () => {
  const publisher: IDeliveryEventsPublisher = {
    publishAssigned: jest.fn().mockResolvedValue(undefined),
    publishStatusChanged: jest.fn().mockResolvedValue(undefined),
  };

  it('assigns only one delivery to a driver under concurrent claims', async () => {
    const drivers = new InMemoryDriverRepository();
    const deliveries = new InMemoryDeliveryRepository();
    const service = new GeoDispatchService(deliveries, drivers, publisher);

    await Promise.all([
      service.createDelivery({
        id: 'delivery-1', orderId: 'order-1', customerId: 'customer-1', restaurantId: 'restaurant-1',
        pickup: { latitude: 28.4595, longitude: 77.0266 }, drop: { latitude: 28.50, longitude: 77.05 },
      }),
      service.createDelivery({
        id: 'delivery-2', orderId: 'order-2', customerId: 'customer-2', restaurantId: 'restaurant-1',
        pickup: { latitude: 28.4595, longitude: 77.0266 }, drop: { latitude: 28.51, longitude: 77.06 },
      }),
    ]);

    const [first, second] = await Promise.all([
      service.findAndAssignNearestPartner('delivery-1'),
      service.findAndAssignNearestPartner('delivery-2'),
    ]);

    expect(first.props.deliveryPartnerId).toBeTruthy();
    expect(second.props.deliveryPartnerId).toBeTruthy();
    expect(first.props.deliveryPartnerId).not.toBe(second.props.deliveryPartnerId);
  });

  it('releases a driver after terminal delivery state', async () => {
    const drivers = new InMemoryDriverRepository();
    const deliveries = new InMemoryDeliveryRepository();
    const service = new GeoDispatchService(deliveries, drivers, publisher);

    await service.createDelivery({
      id: 'delivery-3', orderId: 'order-3', customerId: 'customer-3', restaurantId: 'restaurant-1',
      pickup: { latitude: 28.4595, longitude: 77.0266 }, drop: { latitude: 28.50, longitude: 77.05 },
    });
    const delivery = await service.findAndAssignNearestPartner('delivery-3');
    const driverId = delivery.props.deliveryPartnerId!;

    await service.updateStatus('delivery-3', 'PICKED_UP');
    await service.updateStatus('delivery-3', 'OUT_FOR_DELIVERY');
    await service.updateStatus('delivery-3', 'DELIVERED');

    const nearby = await drivers.getNearby({ latitude: 28.4595, longitude: 77.0266 }, 1);
    expect(nearby.find((driver) => driver.driverId === driverId)?.available).toBe(true);
  });
});
