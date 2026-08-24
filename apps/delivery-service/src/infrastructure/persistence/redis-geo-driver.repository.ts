import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { DriverLocation, IDriverRepository } from '../../domain/repositories/driver.repository';

const GEO_KEY = 'zomato:drivers:geo';
const META_KEY = (driverId: string) => `zomato:driver:${driverId}`;
const LEASE_KEY = (driverId: string) => `zomato:driver:lease:${driverId}`;

const CLAIM_SCRIPT = `
local available = redis.call('HGET', KEYS[1], 'available')
if available ~= '1' then return 0 end
if redis.call('SET', KEYS[2], ARGV[1], 'NX', 'PX', ARGV[2]) then
  redis.call('HSET', KEYS[1], 'available', '0', 'lastUpdatedAt', ARGV[3])
  return 1
end
return 0
`;

const RELEASE_SCRIPT = `
if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('DEL', KEYS[1])
redis.call('HSET', KEYS[2], 'available', '1', 'lastUpdatedAt', ARGV[2])
return 1
`;

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

  async claimDriver(driverId: string, leaseId: string, leaseMs = 15_000): Promise<boolean> {
    const result = await this.redis.eval(
      CLAIM_SCRIPT,
      2,
      META_KEY(driverId),
      LEASE_KEY(driverId),
      leaseId,
      String(leaseMs),
      new Date().toISOString(),
    );
    return Number(result) === 1;
  }

  async markAvailability(driverId: string, available: boolean): Promise<void> {
    if (available) {
      await this.redis.del(LEASE_KEY(driverId));
    }
    await this.redis.hset(META_KEY(driverId), 'available', available ? '1' : '0', 'lastUpdatedAt', new Date().toISOString());
  }

  async releaseDriver(driverId: string, leaseId: string): Promise<boolean> {
    const result = await this.redis.eval(
      RELEASE_SCRIPT,
      2,
      LEASE_KEY(driverId),
      META_KEY(driverId),
      leaseId,
      new Date().toISOString(),
    );
    return Number(result) === 1;
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
