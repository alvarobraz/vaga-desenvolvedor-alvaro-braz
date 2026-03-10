import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderItemProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
  quantity: number
  priceAtPurchase: number
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId() {
    return this.props.orderId
  }
  get productId() {
    return this.props.productId
  }
  get quantity() {
    return this.props.quantity
  }
  get priceAtPurchase() {
    return this.props.priceAtPurchase
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }

  static create(props: OrderItemProps, id?: UniqueEntityID) {
    return new OrderItem(props, id)
  }
}
