import { Either, right } from '@/core/errors/either'
import { Order, OrderStatus } from '@/domain/enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'

interface FetchOrdersUseCaseRequest {
  page: number
  orderCode?: number
  status?: OrderStatus
  clientId?: string
  startDate?: Date
  endDate?: Date
}

type FetchOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    filter: FetchOrdersUseCaseRequest,
  ): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findMany(
      { page: filter.page },
      {
        orderCode: filter.orderCode,
        status: filter.status,
        clientId: filter.clientId,
        startDate: filter.startDate,
        endDate: filter.endDate,
      },
    )

    return right({
      orders,
    })
  }
}
