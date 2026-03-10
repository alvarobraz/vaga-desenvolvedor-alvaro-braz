import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { FetchProductByIdUseCase } from './fetch-product-by-id'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchProductByIdUseCase

describe('Get Product By ID', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchProductByIdUseCase(inMemoryProductsRepository)
  })

  it('should be able to get a product by id', async () => {
    const newProduct = makeProduct({}, new UniqueEntityID('product-1'))

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      productId: 'product-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.product.title).toBe(newProduct.title)
    }
  })

  it('should not be able to get a non-existing product', async () => {
    const result = await sut.execute({
      productId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
