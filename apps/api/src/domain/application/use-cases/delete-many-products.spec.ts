import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { DeleteManyProductsUseCase } from './delete-many-products'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteManyProductsUseCase

describe('Delete Many Products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new DeleteManyProductsUseCase(inMemoryProductsRepository)
  })

  it('should be able to delete many products', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({}, new UniqueEntityID('p1')),
    )
    await inMemoryProductsRepository.create(
      makeProduct({}, new UniqueEntityID('p2')),
    )
    await inMemoryProductsRepository.create(
      makeProduct({}, new UniqueEntityID('p3')),
    )

    const result = await sut.execute({
      productIds: ['p1', 'p2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(1)
    expect(inMemoryProductsRepository.items[0].id.toString()).toBe('p3')
  })
})
