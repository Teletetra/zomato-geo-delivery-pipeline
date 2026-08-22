export class GeoPoint {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {
    if (latitude < -90 || latitude > 90) throw new Error('Invalid latitude');
    if (longitude < -180 || longitude > 180) throw new Error('Invalid longitude');
  }

  distanceKmTo(other: GeoPoint): number {
    const earthRadiusKm = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(other.latitude - this.latitude);
    const dLon = toRad(other.longitude - this.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(this.latitude)) *
        Math.cos(toRad(other.latitude)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
  }
}
