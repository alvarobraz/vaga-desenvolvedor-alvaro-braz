import { Product } from '@/domain/enterprise/entities/product'
import { ProductModel } from '../models/product.model'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class SequelizeProductMapper {
  static toDomain(raw: ProductModel): Product {
    return Product.create(
      {
        sku: raw.sku,
        title: raw.title,
        price: raw.price,
        stock: raw.stock,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(product: Product) {
    return {
      id: product.id.toString(),
      sku: product.sku,
      title: product.title,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
