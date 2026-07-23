import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export abstract class PrismaRepository {
  constructor(
    protected readonly prisma: PrismaService,
  ) {}

  protected async transaction<T>(
    callback: Parameters<PrismaService['$transaction']>[0],
  ): Promise<T> {
    return this.prisma.$transaction(callback) as Promise<T>;
  }
}