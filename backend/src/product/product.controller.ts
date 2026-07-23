import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  create(
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll() {
    return this.productService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Cantidad de productos' })
  count() {
    return this.productService.count();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Productos con stock bajo' })
  findLowStock() {
    return this.productService.findLowStock();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos' })
  @ApiQuery({
    name: 'term',
    required: true,
  })
  search(
    @Query('term') term: string,
  ) {
    return this.productService.search(term);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Buscar por código de barras' })
  @ApiParam({
    name: 'barcode',
  })
  findByBarcode(
    @Param('barcode') barcode: string,
  ) {
    return this.productService.findByBarcode(barcode);
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Buscar por SKU' })
  @ApiParam({
    name: 'sku',
  })
  findBySku(
    @Param('sku') sku: string,
  ) {
    return this.productService.findBySku(sku);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar producto por ID' })
  @ApiParam({
    name: 'id',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(
      id,
      updateProductDto,
    );
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar stock' })
  updateStock(
    @Param('id') id: string,
    @Body('stock') stock: number,
  ) {
    return this.productService.updateStock(
      id,
      stock,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto (Soft Delete)' })
  remove(
    @Param('id') id: string,
  ) {
    return this.productService.remove(id);
  }
}