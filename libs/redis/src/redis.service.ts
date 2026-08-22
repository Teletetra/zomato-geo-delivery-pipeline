import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly store = new Map<string, { value: string; expiresAt?: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    this.store.set(key, { value: JSON.stringify(value), expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
  }
}
