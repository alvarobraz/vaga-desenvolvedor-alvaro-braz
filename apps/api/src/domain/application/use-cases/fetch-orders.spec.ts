import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'
import { makeOrder } from '@test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch paginated orders', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrdersRepository.create(makeOrder())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(2)
  })

  it('should be able to filter orders by status', async () => {
    await inMemoryOrdersRepository.create(makeOrder({ status: 'OPEN' }))
    await inMemoryOrdersRepository.create(makeOrder({ status: 'PAID' }))

    const result = await sut.execute({
      page: 1,
      status: 'PAID',
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders[0].status).toBe('PAID')
  })

  it('should be able to filter orders by clientId', async () => {
    const clientId = new UniqueEntityID('client-1')

    await inMemoryOrdersRepository.create(makeOrder({ clientId }))
    await inMemoryOrdersRepository.create(
      makeOrder({ clientId: new UniqueEntityID('client-2') }),
    )

    const result = await sut.execute({
      page: 1,
      clientId: 'client-1',
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders[0].clientId.toString()).toBe('client-1')
  })

  it('should be able to filter orders by date range', async () => {
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2026, 0, 1),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2026, 0, 15),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2026, 1, 1),
      }),
    )

    const result = await sut.execute({
      page: 1,
      startDate: new Date(2026, 0, 10),
      endDate: new Date(2026, 0, 20),
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders[0].createdAt).toEqual(new Date(2026, 0, 15))
  })

  it('should be able to filter orders by orderCode', async () => {
    await inMemoryOrdersRepository.create(makeOrder({ orderCode: 123456 }))
    await inMemoryOrdersRepository.create(makeOrder({ orderCode: 654321 }))

    const result = await sut.execute({
      page: 1,
      orderCode: 123456,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders[0].orderCode).toBe(123456)
  })
})
