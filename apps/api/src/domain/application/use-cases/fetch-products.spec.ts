import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { FetchProductsUseCase } from './fetch-products'
import { makeProduct } from 'test/factories/make-product'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchProductsUseCase

describe('Fetch Products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchProductsUseCase(inMemoryProductsRepository)
  })

  it('should be able to fetch paginated products', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({
          title: `Product ${i}`,
          sku: `SKU-${i}`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
    expect(result.value?.products[0].title).toBe('Product 21')
  })

  it('should be able to fetch products filtered by title', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ title: 'Mouse Gamer' }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ title: 'Teclado Mecânico' }),
    )

    const result = await sut.execute({
      page: 1,
      title: 'Gamer',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(1)
    expect(result.value?.products[0].title).toBe('Mouse Gamer')
  })

  it('should be able to fetch products filtered by SKU', async () => {
    await inMemoryProductsRepository.create(makeProduct({ sku: 'ABC-123' }))
    await inMemoryProductsRepository.create(makeProduct({ sku: 'XYZ-789' }))

    const result = await sut.execute({
      page: 1,
      sku: 'ABC',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(1)
    expect(result.value?.products[0].sku).toBe('ABC-123')
  })
})
