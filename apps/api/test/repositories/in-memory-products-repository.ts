import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  ProductsRepository,
  ProductsFilterParams,
} from '@/domain/application/repositories/products-repository'
import { Product } from '@/domain/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string) {
    const product = this.items.find(item => item.id.toString() === id)
    if (!product) return null
    return product
  }

  async findBySku(sku: string) {
    const product = this.items.find(item => item.sku === sku)
    if (!product) return null
    return product
  }

  async findMany({ page }: PaginationParams, filter?: ProductsFilterParams) {
    const products = this.items
      .filter(item => {
        if (filter?.title && !item.title.includes(filter.title)) return false
        if (filter?.sku && !item.sku.includes(filter.sku)) return false
        return true
      })
      .slice((page - 1) * 20, page * 20)

    return products
  }

  async create(product: Product) {
    this.items.push(product)
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex(item => item.id === product.id)
    this.items[itemIndex] = product
  }

  async delete(product: Product) {
    const itemIndex = this.items.findIndex(item => item.id === product.id)
    this.items.splice(itemIndex, 1)
  }

  async deleteMany(ids: string[]) {
    this.items = this.items.filter(item => !ids.includes(item.id.toString()))
  }
}
