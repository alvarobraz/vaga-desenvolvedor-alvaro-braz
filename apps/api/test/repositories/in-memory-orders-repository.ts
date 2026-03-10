import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  OrdersFilterParams,
  OrdersRepository,
} from '@/domain/application/repositories/orders-repository'
import { Order } from '@/domain/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find(item => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findMany({ page }: PaginationParams, filter?: OrdersFilterParams) {
    const orders = this.items
      .filter(item => {
        if (filter?.status && item.status !== filter.status) return false

        if (filter?.clientId && item.clientId.toString() !== filter.clientId)
          return false

        if (filter?.orderCode && item.orderCode !== filter.orderCode)
          return false

        if (filter?.startDate && item.createdAt < filter.startDate) return false

        if (filter?.endDate && item.createdAt > filter.endDate) return false

        return true
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex(item => item.id.equals(order.id))

    this.items[itemIndex] = order
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex(item => item.id.equals(order.id))

    this.items.splice(itemIndex, 1)
  }

  async deleteMany(ids: string[]) {
    this.items = this.items.filter(item => !ids.includes(item.id.toString()))
  }
}
