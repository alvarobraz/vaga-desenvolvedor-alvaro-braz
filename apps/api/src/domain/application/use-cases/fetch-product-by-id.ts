import { Either, left, right } from '@/core/errors/either'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchProductByIdUseCaseRequest {
  productId: string
}

type FetchProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class FetchProductByIdUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: FetchProductByIdUseCaseRequest): Promise<FetchProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    return right({
      product,
    })
  }
}
