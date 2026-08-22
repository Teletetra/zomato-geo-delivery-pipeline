import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateRestaurantDto { @IsString() @IsNotEmpty() name!: string; @IsString() @IsNotEmpty() address!: string; @IsString() @IsOptional() description?: string; @IsBoolean() @IsOptional() isOpen?: boolean; }
