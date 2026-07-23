import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

import { IRepository } from '../../common/database/repository.interface';
import { PrismaRepository } from '../../common/database/prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductRepository
  extends PrismaRepository
  implements
    IRepository<
      Prisma.ProductCreateInput,
      Prisma.ProductUpdateInput,
      Product
    >
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        sku,
      },
    });
  }

  findByBarcode(barcode: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        barcode,
      },
    });
  }

  search(term: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            sku: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            barcode: {
              contains: term,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  update(
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  updateStock(
    id: string,
    stock: number,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        stock,
      },
    });
  }

  delete(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  count(): Promise<number> {
    return this.prisma.product.count({
      where: {
        isActive: true,
      },
    });
  }

  findLowStock(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: this.prisma.product.fields.minStock,
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }
}