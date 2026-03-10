import { Either, left, right } from '@/core/errors/either'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { InvalidStockError } from './errors/invalid-stock-error'
import { Injectable } from '@nestjs/common'

interface EditProductUseCaseRequest {
  productId: string
  title: string
  sku: string
  price: number
  stock: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | ProductAlreadyExistsError | InvalidStockError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    title,
    sku,
    price,
    stock,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (stock < 0) {
      return left(new InvalidStockError())
    }

    const productWithSameSku = await this.productsRepository.findBySku(sku)

    if (productWithSameSku && !productWithSameSku.id.equals(product.id)) {
      return left(new ProductAlreadyExistsError(sku))
    }

    product.title = title
    product.sku = sku
    product.price = price
    product.stock = stock

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
