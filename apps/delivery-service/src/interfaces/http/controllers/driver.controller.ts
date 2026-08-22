import { Body, Controller, Patch, Query } from '@nestjs/common';
import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { DriverRepository, IDriverRepository } from '../../../domain/repositories/driver.repository';
import { Inject } from '@nestjs/common';

class DriverLocationDto {
  @IsString() driverId!: string;
  @IsNumber() @Min(-90) @Max(90) latitude!: number;
  @IsNumber() @Min(-180) @Max(180) longitude!: number;
  @IsBoolean() available!: boolean;
  @IsString() lastUpdatedAt!: string;
}

@Controller('drivers')
export class DriverController {
  constructor(@Inject(DriverRepository) private readonly drivers: IDriverRepository) {}

  @Patch('location')
  async updateLocation(@Body() dto: DriverLocationDto) {
    await this.drivers.upsertLocation(dto);
    return { ok: true };
  }

  @Patch('availability')
  async updateAvailability(@Query('driverId') driverId: string, @Query('available') available: string) {
    await this.drivers.markAvailability(driverId, available === 'true');
    return { ok: true };
  }
}
