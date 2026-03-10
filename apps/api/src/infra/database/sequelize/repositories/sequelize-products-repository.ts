import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '@/domain/enterprise/entities/product'
import {
  ProductsRepository,
  ProductsFilterParams,
} from '@/domain/application/repositories/products-repository'
import { SequelizeProductMapper } from '../mappers/sequelize-product-mapper'
import { ProductModel } from '../models/product.model'

@Injectable()
export class SequelizeProductsRepository implements ProductsRepository {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.productModel.findByPk(id)

    if (!product) {
      return null
    }

    return SequelizeProductMapper.toDomain(product)
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.productModel.findOne({
      where: { sku },
    })

    if (!product) {
      return null
    }

    return SequelizeProductMapper.toDomain(product)
  }

  async findMany(
    { page }: PaginationParams,
    filter?: ProductsFilterParams,
  ): Promise<Product[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (filter?.title) {
      where.title = { [Op.iLike]: `%${filter.title}%` }
    }

    if (filter?.sku) {
      where.sku = filter.sku
    }

    const products = await this.productModel.findAll({
      where,
      limit: 20,
      offset: (page - 1) * 20,
      order: [['createdAt', 'DESC']],
    })

    return products.map(SequelizeProductMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = SequelizeProductMapper.toPersistence(product)

    await this.productModel.create(data)
  }

  async save(product: Product): Promise<void> {
    const data = SequelizeProductMapper.toPersistence(product)

    await this.productModel.update(data, {
      where: { id: data.id },
    })
  }

  async delete(product: Product): Promise<void> {
    await this.productModel.destroy({
      where: { id: product.id.toString() },
    })
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.productModel.destroy({
      where: {
        id: { [Op.in]: ids },
      },
    })
  }
}
