import { Either, left, right } from '@/core/errors/either'
import { Order, OrderStatus } from '@/domain/enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface UpdateOrderStatusUseCaseRequest {
  orderId: string
  status: OrderStatus
}

type UpdateOrderStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    status,
  }: UpdateOrderStatusUseCaseRequest): Promise<UpdateOrderStatusUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.status = status

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
