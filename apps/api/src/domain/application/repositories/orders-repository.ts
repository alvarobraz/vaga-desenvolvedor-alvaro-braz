import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order, OrderStatus } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'

export interface OrdersFilterParams {
  orderCode?: number
  status?: OrderStatus
  clientId?: string
  startDate?: Date
  endDate?: Date
}

@Injectable()
export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(
    params: PaginationParams,
    filter?: OrdersFilterParams,
  ): Promise<Order[]>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract deleteMany(ids: string[]): Promise<void>
}
