import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { GeoDispatchService } from '../../../application/services/geo-dispatch.service';

class CreateDeliveryDto {
  @IsString() id!: string;
  @IsString() orderId!: string;
  @IsString() customerId!: string;
  @IsString() restaurantId!: string;
  pickup!: { latitude: number; longitude: number };
  drop!: { latitude: number; longitude: number };
}

class AssignNearestDto {
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(50)
  radiusKm?: number;
}

class UpdateStatusDto {
  @IsString() status!: 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
}

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly dispatch: GeoDispatchService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.dispatch.createDelivery(dto);
  }

  @Post(':id/assign-nearest')
  assignNearest(@Param('id') id: string, @Body() dto: AssignNearestDto) {
    return this.dispatch.findAndAssignNearestPartner(id, dto.radiusKm ?? 5);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.dispatch.updateStatus(id, dto.status);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.dispatch.get(id);
  }
}
