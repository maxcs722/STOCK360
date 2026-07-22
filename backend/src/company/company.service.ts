import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCompanyDto) {
    if (dto.rut) {
      const exists = await this.prisma.company.findUnique({
        where: {
          rut: dto.rut,
        },
      });

      if (exists) {
        throw new ConflictException(
          'Ya existe una empresa con ese RUT.',
        );
      }
    }

    return this.prisma.company.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company || !company.isActive) {
      throw new NotFoundException(
        'Empresa no encontrada.',
      );
    }

    return company;
  }

  async update(
    id: string,
    dto: UpdateCompanyDto,
  ) {
    await this.findOne(id);

    return this.prisma.company.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.company.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}