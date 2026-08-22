import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class UpdateRestaurantDto { @IsString() @IsOptional() name?: string; @IsString() @IsOptional() description?: string; @IsString() @IsOptional() address?: string; @IsBoolean() @IsOptional() isOpen?: boolean; }
