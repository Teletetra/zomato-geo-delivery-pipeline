export interface RestaurantProps {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  isOpen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RestaurantEntity {
  private constructor(private readonly props: RestaurantProps) {}

  static create(props: Omit<RestaurantProps, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): RestaurantEntity {
    if (!props.name?.trim()) throw new Error('Restaurant name is required');
    if (!props.address?.trim()) throw new Error('Restaurant address is required');
    return new RestaurantEntity({
      id: props.id ?? crypto.randomUUID(),
      name: props.name.trim(),
      description: props.description ?? null,
      address: props.address.trim(),
      isOpen: props.isOpen ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: RestaurantProps): RestaurantEntity { return new RestaurantEntity(props); }
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get address() { return this.props.address; }
  get isOpen() { return this.props.isOpen; }
  toPrimitives(): RestaurantProps { return { ...this.props }; }

  rename(name: string) {
    if (!name?.trim()) throw new Error('Restaurant name is required');
    this.props.name = name.trim(); this.props.updatedAt = new Date();
  }
  updateDetails(input: { description?: string | null; address?: string }) {
    if (input.address !== undefined && !input.address.trim()) throw new Error('Address cannot be empty');
    if (input.description !== undefined) this.props.description = input.description;
    if (input.address !== undefined) this.props.address = input.address.trim();
    this.props.updatedAt = new Date();
  }
  setOpen(open: boolean) { this.props.isOpen = open; this.props.updatedAt = new Date(); }
}
