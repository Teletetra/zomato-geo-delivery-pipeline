export class CreateRestaurantCommand { constructor(public readonly input: { name: string; description?: string; address: string; isOpen?: boolean }) {} }
