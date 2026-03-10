import { Either, right } from '@/core/errors/either'
import { Product } from '@/domain/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { Injectable } from '@nestjs/common'

interface FetchProductsUseCaseRequest {
  page: number
  title?: string
  sku?: string
}

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
    title,
    sku,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany(
      { page },
      { title, sku },
    )

    return right({
      products,
    })
  }
}
