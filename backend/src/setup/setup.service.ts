import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SetupService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async install() {
    const companyCount = await this.prisma.company.count();
    const userCount = await this.prisma.user.count();

    if (companyCount > 0 || userCount > 0) {
      throw new BadRequestException(
        'El sistema ya fue instalado.',
      );
    }

    const company = await this.prisma.company.create({
      data: {
        name: 'STOCK360',
        fantasyName: 'STOCK360 ERP',
        isActive: true,
      },
    });

    const passwordHash = await bcrypt.hash(
      'Admin123*',
      12,
    );

    const user = await this.prisma.user.create({
      data: {
        name: 'Administrador',
        lastName: 'Sistema',
        email: 'admin@stock360.cl',
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        companyId: company.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      message: 'STOCK360 instalado correctamente.',
      company,
      user,
      credentials: {
        email: 'admin@stock360.cl',
        password: 'Admin123*',
      },
    };
  }
}