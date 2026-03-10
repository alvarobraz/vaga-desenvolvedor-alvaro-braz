import { Either, right } from '@/core/errors/either'
import { OrdersRepository } from '../repositories/orders-repository'

interface DeleteManyOrdersUseCaseRequest {
  orderIds: string[]
}

type DeleteManyOrdersUseCaseResponse = Either<null, null>

export class DeleteManyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderIds,
  }: DeleteManyOrdersUseCaseRequest): Promise<DeleteManyOrdersUseCaseResponse> {
    await this.ordersRepository.deleteMany(orderIds)

    return right(null)
  }
}
