import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryGateway } from './telemetry.gateway';
import { Reading } from './reading.entity';
import { Device } from '../devices/device.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Reading, Device]), JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [TelemetryService, TelemetryGateway],
  exports: [TelemetryService],
})
export class TelemetryModule {} 