import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Company } from '../companies/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['company'] });
    return user || undefined;
  }

  async findAllByCompany(companyId: string): Promise<User[]> {
    return this.usersRepository.find({ where: { company: { id: companyId } }, relations: ['company'] });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hash,
      role: createUserDto.role,
      company: { id: createUserDto.companyId } as Company,
    });
    const saved = await this.usersRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }
} 