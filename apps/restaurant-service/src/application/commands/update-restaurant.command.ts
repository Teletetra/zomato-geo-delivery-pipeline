export class UpdateRestaurantCommand { constructor(public readonly id: string, public readonly input: { name?: string; description?: string | null; address?: string }) {} }
