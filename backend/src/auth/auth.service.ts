import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const users = await this.prisma.user.count();

    // ==================================================
    // INSTALACIÓN INICIAL (No existe ningún usuario)
    // ==================================================
    if (users === 0) {
      let company = await this.prisma.company.findFirst({
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (!company) {
        company = await this.prisma.company.create({
          data: {
            name: 'STOCK360',
            fantasyName: 'STOCK360 ERP',
            isActive: true,
          },
        });
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
          role: UserRole.SUPER_ADMIN,
          companyId: company.id,
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
        message: 'Administrador inicial creado correctamente.',
        company,
        user,
      };
    }

    // ==================================================
    // REGISTRO NORMAL
    // ==================================================

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
        role: dto.role ?? UserRole.VENDEDOR,
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'El usuario está deshabilitado.',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos.',
      );
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      message: 'Login correcto.',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }
}