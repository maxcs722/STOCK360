import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: dto.companyId,
      },
    });

    if (!company) {
      throw new BadRequestException(
        'La empresa indicada no existe.',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'El correo ya está registrado.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role,
        companyId: dto.companyId,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    return {
      message: 'Usuario registrado correctamente.',
      user,
    };
  }
}