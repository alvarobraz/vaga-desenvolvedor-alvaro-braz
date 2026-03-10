import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'

export interface ProductsFilterParams {
  title?: string
  sku?: string
}

@Injectable()
export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findBySku(sku: string): Promise<Product | null>
  abstract findMany(
    params: PaginationParams,
    filter?: ProductsFilterParams,
  ): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
  abstract deleteMany(ids: string[]): Promise<void>
}
