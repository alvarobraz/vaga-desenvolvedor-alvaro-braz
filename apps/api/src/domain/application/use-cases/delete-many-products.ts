import { Either, right } from '@/core/errors/either'
import { ProductsRepository } from '../repositories/products-repository'

interface DeleteManyProductsUseCaseRequest {
  productIds: string[]
}

type DeleteManyProductsUseCaseResponse = Either<null, null>

export class DeleteManyProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productIds,
  }: DeleteManyProductsUseCaseRequest): Promise<DeleteManyProductsUseCaseResponse> {
    await this.productsRepository.deleteMany(productIds)

    return right(null)
  }
}
