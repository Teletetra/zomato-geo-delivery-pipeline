export class OrderEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
