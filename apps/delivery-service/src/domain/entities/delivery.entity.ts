export class DeliveryEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
