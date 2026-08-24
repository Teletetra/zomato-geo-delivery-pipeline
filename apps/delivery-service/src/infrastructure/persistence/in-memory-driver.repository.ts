import { Injectable } from '@nestjs/common';
import { GeoPoint } from '../../domain/value-objects/geo-point.vo';
import { DriverLocation, IDriverRepository } from '../../domain/repositories/driver.repository';

@Injectable()
export class InMemoryDriverRepository implements IDriverRepository {
  private readonly drivers = new Map<string, DriverLocation>();
  private readonly leases = new Map<string, string>();

  constructor() {
    for (const driver of [
      { driverId: 'partner-101', latitude: 28.4595, longitude: 77.0266, available: true },
      { driverId: 'partner-102', latitude: 28.4708, longitude: 77.0219, available: true },
      { driverId: 'partner-103', latitude: 28.4358, longitude: 77.0032, available: false },
    ]) {
      this.drivers.set(driver.driverId, { ...driver, lastUpdatedAt: new Date().toISOString() });
    }
  }

  async upsertLocation(location: DriverLocation): Promise<void> {
    this.drivers.set(location.driverId, location);
  }

  async getNearby(location: { latitude: number; longitude: number }, radiusKm: number): Promise<DriverLocation[]> {
    const origin = new GeoPoint(location.latitude, location.longitude);
    return [...this.drivers.values()].filter((driver) => {
      const point = new GeoPoint(driver.latitude, driver.longitude);
      return origin.distanceKmTo(point) <= radiusKm;
    });
  }

  async claimDriver(driverId: string, leaseId: string): Promise<boolean> {
    const current = this.drivers.get(driverId);
    if (!current || !current.available || this.leases.has(driverId)) return false;
    this.leases.set(driverId, leaseId);
    this.drivers.set(driverId, { ...current, available: false, lastUpdatedAt: new Date().toISOString() });
    return true;
  }

  async markAvailability(driverId: string, available: boolean): Promise<void> {
    const current = this.drivers.get(driverId);
    if (!current) return;
    if (available) this.leases.delete(driverId);
    this.drivers.set(driverId, { ...current, available, lastUpdatedAt: new Date().toISOString() });
  }

  async releaseDriver(driverId: string, leaseId: string): Promise<boolean> {
    if (this.leases.get(driverId) !== leaseId) return false;
    this.leases.delete(driverId);
    await this.markAvailability(driverId, true);
    return true;
  }
}
