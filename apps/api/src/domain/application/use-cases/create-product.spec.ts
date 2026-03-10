import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'
import { makeProduct } from 'test/factories/make-product'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { InvalidStockError } from './errors/invalid-stock-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      title: 'Monitor 4K',
      sku: 'MON-4K-001',
      price: 250000,
      stock: 5,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0].sku).toBe('MON-4K-001')
  })

  it('should not be able to create a product with same SKU', async () => {
    const sku = 'DUPLICATED-SKU'
    await inMemoryProductsRepository.create(makeProduct({ sku }))

    const result = await sut.execute({
      title: 'Another Product',
      sku,
      price: 100,
      stock: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError)
  })

  it('should not be able to create a product with negative stock', async () => {
    const result = await sut.execute({
      title: 'Invalid Product',
      sku: 'INVALID-SKU',
      price: 1000,
      stock: -1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStockError)
  })
})
