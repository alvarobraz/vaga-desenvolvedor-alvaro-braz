import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/enterprise/entities/order'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      orderCode: Math.floor(Math.random() * 1000),
      clientId: new UniqueEntityID(),
      status: 'OPEN',
      total: 0,
      ...override,
    },
    id,
  )

  return order
}
