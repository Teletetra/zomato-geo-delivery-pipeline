export class NotificationEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
