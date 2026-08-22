export class UserEntity {
  constructor(public readonly id: string, public props: Record<string, unknown> = {}) {}
}
