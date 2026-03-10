import { Either, left, right } from '@/core/errors/either'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { InvalidStockError } from './errors/invalid-stock-error'
import { Injectable } from '@nestjs/common'

interface CreateProductUseCaseRequest {
  sku: string
  title: string
  price: number
  stock: number
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    sku,
    title,
    price,
    stock,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    if (stock < 0) {
      return left(new InvalidStockError())
    }

    const productWithSameSku = await this.productsRepository.findBySku(sku)

    if (productWithSameSku) {
      return left(new ProductAlreadyExistsError(sku))
    }

    const product = Product.create({
      sku,
      title,
      price,
      stock,
    })

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
