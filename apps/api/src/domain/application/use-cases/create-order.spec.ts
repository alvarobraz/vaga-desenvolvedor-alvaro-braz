import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateOrderUseCase } from './create-order'
import { makeClient } from 'test/factories/make-client'
import { makeProduct } from 'test/factories/make-product'
import { InsufficientStockError } from './errors/insufficient-stock-error'
import { InMemoryOrdersRepository } from '@test/repositories/in-memory-orders-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryClientsRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to create an order', async () => {
    const client = makeClient()
    await inMemoryClientsRepository.create(client)

    const product = makeProduct({ price: 10000, stock: 10 }) // 100.00
    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      clientId: client.id.toString(),
      items: [{ productId: product.id.toString(), quantity: 2 }],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.total).toBe(20000)
    }
    expect(inMemoryProductsRepository.items[0].stock).toBe(8)
  })

  it('should not be able to create an order with insufficient stock', async () => {
    const client = makeClient()
    await inMemoryClientsRepository.create(client)

    const product = makeProduct({ stock: 1 })
    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      clientId: client.id.toString(),
      items: [{ productId: product.id.toString(), quantity: 5 }],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InsufficientStockError)
  })
})
