import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  create(createProductDto: CreateProductDto) {
    const data: Prisma.ProductCreateInput = {
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      internalCode: createProductDto.internalCode,
      name: createProductDto.name,
      description: createProductDto.description,
      brand: createProductDto.brand,
      model: createProductDto.model,
      unit: createProductDto.unit ?? 'UN',
      cost: createProductDto.cost,
      price: createProductDto.price,
      stock: createProductDto.stock ?? 0,
      minStock: createProductDto.minStock ?? 0,
      imageUrl: createProductDto.imageUrl,
      isActive: createProductDto.isActive ?? true,

      company: {
        connect: {
          id: createProductDto.companyId,
        },
      },

      category: {
        connect: {
          id: createProductDto.categoryId,
        },
      },

      ...(createProductDto.supplierId && {
        supplier: {
          connect: {
            id: createProductDto.supplierId,
          },
        },
      }),
    };

    return this.productRepository.create(data);
  }

  findAll() {
    return this.productRepository.findAll();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findBySku(sku: string) {
    const product = await this.productRepository.findBySku(sku);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findByBarcode(barcode: string) {
    const product = await this.productRepository.findByBarcode(barcode);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  search(term: string) {
    return this.productRepository.search(term);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    await this.findOne(id);

    return this.productRepository.update(id, updateProductDto);
  }

  async updateStock(
    id: string,
    stock: number,
  ) {
    await this.findOne(id);

    return this.productRepository.updateStock(id, stock);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.productRepository.delete(id);
  }

  count() {
    return this.productRepository.count();
  }

  findLowStock() {
    return this.productRepository.findLowStock();
  }
}