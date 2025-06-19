import { Controller, Get, Param, Req, UseGuards, Post, Body, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @Roles('admin', 'user')
  async findAll(@Req() req) {
    const companyId = req.user.companyId;
    return this.devicesService.findAll(companyId);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string, @Req() req) {
    const companyId = req.user.companyId;
    const device = await this.devicesService.findOne(id, companyId);
    if (!device) {
      return { statusCode: 404, message: 'Device not found' };
    }
    return device;
  }

  @Post()
  @Roles('admin')
  async create(@Req() req, @Body() dto: CreateDeviceDto) {
    if (dto.companyId !== req.user.companyId) {
      throw new ForbiddenException('Cannot create device in another company');
    }
    return this.devicesService.create(dto);
  }
} 