import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteManyOrdersUseCase } from './delete-many-orders'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteManyOrdersUseCase

describe('Delete Many Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new DeleteManyOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete many orders', async () => {
    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityID('order-1')),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityID('order-2')),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityID('order-3')),
    )

    const result = await sut.execute({
      orderIds: ['order-1', 'order-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items[0].id.toString()).toBe('order-3')
  })
})
