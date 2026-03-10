import { Either, left, right } from '@/core/errors/either'
import { Order } from '@/domain/enterprise/entities/order'
import { OrderItem } from '@/domain/enterprise/entities/order-item'
import { OrdersRepository } from '../repositories/orders-repository'
import { ClientsRepository } from '../repositories/clients-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InsufficientStockError } from './errors/insufficient-stock-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  clientId: string
  items: {
    productId: string
    quantity: number
  }[]
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | InsufficientStockError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private clientsRepository: ClientsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    clientId,
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const orderId = new UniqueEntityID()
    const orderItems: OrderItem[] = []
    let totalInCents = 0

    for (const item of items) {
      const product = await this.productsRepository.findById(item.productId)

      if (!product) {
        return left(new ResourceNotFoundError())
      }

      if (product.stock < item.quantity) {
        return left(new InsufficientStockError(product.title))
      }

      const orderItem = OrderItem.create({
        orderId,
        productId: product.id,
        priceAtPurchase: product.price,
        quantity: item.quantity,
      })

      product.stock -= item.quantity
      await this.productsRepository.save(product)

      orderItems.push(orderItem)
      totalInCents += product.price * item.quantity
    }

    const order = Order.create(
      {
        orderCode: Math.floor(Math.random() * 1000000),
        clientId: new UniqueEntityID(clientId),
        status: 'OPEN',
        total: totalInCents,
        items: orderItems,
      },
      orderId,
    )

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
