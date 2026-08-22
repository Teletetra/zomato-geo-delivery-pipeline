import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class GeoPointDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

export class CreateDeliveryHttpDto {
  @IsString() id!: string;
  @IsString() orderId!: string;
  @IsString() customerId!: string;
  @IsString() restaurantId!: string;
  pickup!: GeoPointDto;
  drop!: GeoPointDto;
}

export class AssignNearestHttpDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(50)
  radiusKm = 5;
}
