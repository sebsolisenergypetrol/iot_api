import { Controller, Get, Req, UseGuards, Post, Body, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  @Roles('admin')
  async findAll(@Req() req) {
    const companyId = req.user.companyId;
    return this.usersService.findAllByCompany(companyId);
  }

  @Post()
  @Roles('admin')
  async create(@Req() req, @Body() dto: CreateUserDto) {
    // Only allow creating users in the admin's company
    if (dto.companyId !== req.user.companyId) {
      throw new ForbiddenException('Cannot create user in another company');
    }
    return this.usersService.create(dto);
  }
} 