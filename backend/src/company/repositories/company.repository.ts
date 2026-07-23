import { Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';

import { IRepository } from '../../common/database/repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanyRepository
  implements
    IRepository<
      Prisma.CompanyCreateInput,
      Prisma.CompanyUpdateInput,
      Company
    >
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

  findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }

  update(
    id: string,
    data: Prisma.CompanyUpdateInput,
  ): Promise<Company> {
    return this.prisma.company.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string): Promise<Company> {
    return this.prisma.company.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  count(): Promise<number> {
    return this.prisma.company.count();
  }
}