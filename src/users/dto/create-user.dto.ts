import { IsEmail, IsString, IsUUID, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['admin', 'user'])
  role: string;

  @IsUUID()
  companyId: string;
} 