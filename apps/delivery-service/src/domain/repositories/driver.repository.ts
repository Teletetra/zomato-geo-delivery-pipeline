export const DriverRepository = Symbol('DriverRepository');

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  available: boolean;
  lastUpdatedAt: string;
}

export interface IDriverRepository {
  upsertLocation(location: DriverLocation): Promise<void>;
  getNearby(location: { latitude: number; longitude: number }, radiusKm: number): Promise<DriverLocation[]>;
  markAvailability(driverId: string, available: boolean): Promise<void>;
}
