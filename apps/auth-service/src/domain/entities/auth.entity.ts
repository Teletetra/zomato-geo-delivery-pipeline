export class AuthEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
