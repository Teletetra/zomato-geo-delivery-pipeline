import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

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
export class RedisDriverClaimRepository implements OnModuleDestroy {
  private readonly redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

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
