import { GeoPoint } from '../value-objects/geo-point.vo';

export type DeliveryStatus =
  | 'SEARCHING_PARTNER'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface DeliveryProps {
  orderId: string;
  customerId: string;
  restaurantId: string;
  pickupLocation: GeoPoint;
  dropLocation: GeoPoint;
  deliveryPartnerId?: string;
  partnerLocation?: GeoPoint;
  status: DeliveryStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export class DeliveryAggregate {
  private constructor(
    public readonly id: string,
    private state: DeliveryProps,
  ) {}

  static create(params: {
    id: string;
    orderId: string;
    customerId: string;
    restaurantId: string;
    pickupLocation: GeoPoint;
    dropLocation: GeoPoint;
  }): DeliveryAggregate {
    const now = new Date();
    return new DeliveryAggregate(params.id, {
      orderId: params.orderId,
      customerId: params.customerId,
      restaurantId: params.restaurantId,
      pickupLocation: params.pickupLocation,
      dropLocation: params.dropLocation,
      status: 'SEARCHING_PARTNER',
      version: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(id: string, props: DeliveryProps): DeliveryAggregate {
    return new DeliveryAggregate(id, props);
  }

  get props(): Readonly<DeliveryProps> {
    return { ...this.state };
  }

  assignPartner(partnerId: string, partnerLocation: GeoPoint): void {
    if (this.state.status !== 'SEARCHING_PARTNER') {
      throw new Error(`Cannot assign partner from ${this.state.status}`);
    }
    this.state.deliveryPartnerId = partnerId;
    this.state.partnerLocation = partnerLocation;
    this.state.status = 'ASSIGNED';
    this.bumpVersion();
  }

  transitionTo(next: DeliveryStatus): void {
    const allowed: Record<DeliveryStatus, DeliveryStatus[]> = {
      SEARCHING_PARTNER: ['ASSIGNED', 'CANCELLED'],
      ASSIGNED: ['PICKED_UP', 'CANCELLED'],
      PICKED_UP: ['OUT_FOR_DELIVERY', 'CANCELLED'],
      OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!allowed[this.state.status].includes(next)) {
      throw new Error(`Invalid delivery transition ${this.state.status} -> ${next}`);
    }
    this.state.status = next;
    this.bumpVersion();
  }

  private bumpVersion(): void {
    this.state.version += 1;
    this.state.updatedAt = new Date();
  }
}
