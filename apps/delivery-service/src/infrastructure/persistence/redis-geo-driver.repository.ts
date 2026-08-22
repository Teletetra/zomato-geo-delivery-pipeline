import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { DriverLocation, IDriverRepository } from '../../domain/repositories/driver.repository';

const GEO_KEY = 'zomato:drivers:geo';
const META_KEY = (driverId: string) => `zomato:driver:${driverId}`;

@Injectable()
export class RedisGeoDriverRepository implements IDriverRepository, OnModuleInit, OnModuleDestroy {
  private readonly redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

  async onModuleInit(): Promise<void> {
    const seeds: DriverLocation[] = [
      { driverId: 'partner-101', latitude: 28.4595, longitude: 77.0266, available: true, lastUpdatedAt: new Date().toISOString() },
      { driverId: 'partner-102', latitude: 28.4708, longitude: 77.0219, available: true, lastUpdatedAt: new Date().toISOString() },
    ];
    for (const driver of seeds) await this.upsertLocation(driver);
  }

  async upsertLocation(location: DriverLocation): Promise<void> {
    await this.redis.geoadd(GEO_KEY, location.longitude, location.latitude, location.driverId);
    await this.redis.hset(META_KEY(location.driverId), {
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      available: location.available ? '1' : '0',
      lastUpdatedAt: location.lastUpdatedAt,
    });
  }

  async getNearby(location: { latitude: number; longitude: number }, radiusKm: number): Promise<DriverLocation[]> {
    const ids = await this.redis.georadius(GEO_KEY, location.longitude, location.latitude, radiusKm, 'km');
    const results: DriverLocation[] = [];
    for (const id of ids) {
      const meta = await this.redis.hgetall(META_KEY(String(id)));
      if (!meta.latitude) continue;
      results.push({
        driverId: String(id),
        latitude: Number(meta.latitude),
        longitude: Number(meta.longitude),
        available: meta.available === '1',
        lastUpdatedAt: meta.lastUpdatedAt,
      });
    }
    return results;
  }

  async markAvailability(driverId: string, available: boolean): Promise<void> {
    await this.redis.hset(META_KEY(driverId), 'available', available ? '1' : '0', 'lastUpdatedAt', new Date().toISOString());
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
