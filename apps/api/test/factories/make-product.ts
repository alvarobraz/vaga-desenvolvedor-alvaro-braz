import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product, ProductProps } from '@/domain/enterprise/entities/product'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      sku: 'SKU-DEFAULT-123',
      title: 'Default Product Title',
      price: 10000, // 100.00
      stock: 10,
      ...override,
    },
    id,
  )

  return product
}
