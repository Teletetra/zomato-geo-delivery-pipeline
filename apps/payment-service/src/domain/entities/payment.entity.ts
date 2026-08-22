export class PaymentEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
