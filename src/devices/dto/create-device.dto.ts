import { IsString, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsUUID()
  companyId: string;
} 