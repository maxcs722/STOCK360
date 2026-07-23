import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { InstallDto } from './dto/install.dto';

@Injectable()
export class SetupService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async install(dto: InstallDto) {
    const companyCount = await this.prisma.company.count();
    const userCount = await this.prisma.user.count();

    if (companyCount > 0 || userCount > 0) {
      throw new BadRequestException(
        'El sistema ya fue instalado.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          fantasyName: dto.fantasyName,
          isActive: true,
        },
      });

      const passwordHash = await bcrypt.hash(dto.password, 12);

      const user = await tx.user.create({
        data: {
          name: dto.adminName,
          lastName: dto.adminLastName,
          email: dto.adminEmail.toLowerCase(),
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
        },
      });

      return {
        message: 'Sistema instalado correctamente.',
        company,
        user,
      };
    });
  }
}