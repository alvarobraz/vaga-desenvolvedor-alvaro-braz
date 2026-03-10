import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { UpdateOrderStatusUseCase } from './update-order-status'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: UpdateOrderStatusUseCase

describe('Update Order Status', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new UpdateOrderStatusUseCase(inMemoryOrdersRepository)
  })

  it('should be able to update an order status', async () => {
    const order = makeOrder({ status: 'OPEN' }, new UniqueEntityID('order-1'))

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: 'order-1',
      status: 'PAID',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].status).toBe('PAID')
    expect(inMemoryOrdersRepository.items[0].updatedAt).toBeInstanceOf(Date)
  })

  it('should not be able to update a non-existing order', async () => {
    const result = await sut.execute({
      orderId: 'non-existing-id',
      status: 'CANCELED',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
