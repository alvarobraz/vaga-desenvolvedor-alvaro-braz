import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { OrderItemModel } from '../models/order-item.model'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class SequelizeOrderItemMapper {
  static toDomain(raw: OrderItemModel): OrderItem {
    return OrderItem.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        productId: new UniqueEntityID(raw.productId),
        priceAtPurchase: raw.priceAtPurchase,
        quantity: raw.quantity,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
