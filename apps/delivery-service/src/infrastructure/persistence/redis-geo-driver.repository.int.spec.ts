import { RedisGeoDriverRepository } from './redis-geo-driver.repository';

describe('RedisGeoDriverRepository integration', () => {
  let repository: RedisGeoDriverRepository;

  beforeAll(async () => {
    repository = new RedisGeoDriverRepository();
    await repository.onModuleInit();
  });

  afterAll(async () => {
    await repository.onModuleDestroy();
  });

  it('allows exactly one concurrent claim for a driver', async () => {
    await repository.upsertLocation({
      driverId: 'integration-driver-1',
      latitude: 28.4595,
      longitude: 77.0266,
      available: true,
      lastUpdatedAt: new Date().toISOString(),
    });

    const [first, second] = await Promise.all([
      repository.claimDriver('integration-driver-1', 'lease-a', 5000),
      repository.claimDriver('integration-driver-1', 'lease-b', 5000),
    ]);

    expect([first, second].filter(Boolean)).toHaveLength(1);

    const winner = first ? 'lease-a' : 'lease-b';
    expect(await repository.releaseDriver('integration-driver-1', winner)).toBe(true);

    const nearby = await repository.getNearby({ latitude: 28.4595, longitude: 77.0266 }, 1);
    expect(nearby.find((driver) => driver.driverId === 'integration-driver-1')?.available).toBe(true);
  });
});
