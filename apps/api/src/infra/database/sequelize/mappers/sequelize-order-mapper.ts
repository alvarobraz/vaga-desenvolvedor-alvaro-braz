import { Order, OrderStatus } from '@/domain/enterprise/entities/order'
import { OrderModel } from '../models/order.model'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SequelizeOrderItemMapper } from './sequelize-order-item-mapper'

export class SequelizeOrderMapper {
  static toDomain(raw: OrderModel): Order {
    return Order.create(
      {
        orderCode: raw.orderCode,
        clientId: new UniqueEntityID(raw.clientId),
        status: raw.status as OrderStatus,
        total: raw.total,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        items: raw.items
          ? raw.items.map(SequelizeOrderItemMapper.toDomain)
          : [],
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(order: Order) {
    return {
      id: order.id.toString(),
      orderCode: order.orderCode,
      clientId: order.clientId.toString(),
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items?.map(item => ({
        id: item.id.toString(),
        orderId: order.id.toString(),
        productId: item.productId.toString(),
        priceAtPurchase: item.priceAtPurchase,
        quantity: item.quantity,
      })),
    }
  }
}
