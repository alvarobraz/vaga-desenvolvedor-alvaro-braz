import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderItem } from './order-item'

export type OrderStatus = 'OPEN' | 'PAID' | 'CANCELED'

export interface OrderProps {
  orderCode: number
  clientId: UniqueEntityID
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get orderCode() {
    return this.props.orderCode
  }
  get clientId() {
    return this.props.clientId
  }
  get items() {
    return this.props.items
  }
  get status() {
    return this.props.status
  }
  get total() {
    return this.props.total
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status' | 'items'>,
    id?: UniqueEntityID,
  ) {
    return new Order(
      {
        ...props,
        items: props.items ?? [],
        status: props.status ?? 'OPEN',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
