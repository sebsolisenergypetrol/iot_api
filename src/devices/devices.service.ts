import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async findAll(companyId: string): Promise<Device[]> {
    return this.devicesRepository.find({ where: { company: { id: companyId } }, relations: ['company'] });
  }

  async findOne(id: string, companyId: string): Promise<Device | undefined> {
    const device = await this.devicesRepository.findOne({ where: { id, company: { id: companyId } }, relations: ['company'] });
    return device || undefined;
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.devicesRepository.create({
      name: createDeviceDto.name,
      company: { id: createDeviceDto.companyId } as Company,
    });
    return this.devicesRepository.save(device);
  }
} 