import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { EditProductUseCase } from './edit-product'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { InvalidStockError } from './errors/invalid-stock-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new EditProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to edit a product', async () => {
    const newProduct = makeProduct(
      { title: 'Old Title', price: 100 },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      productId: 'product-1',
      title: 'New Title',
      sku: 'NEW-SKU-001',
      price: 200,
      stock: 50,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0].title).toBe('New Title')
    expect(inMemoryProductsRepository.items[0].price).toBe(200)
    expect(inMemoryProductsRepository.items[0].updatedAt).toBeInstanceOf(Date)
  })

  it('should not be able to edit a product with an SKU already taken', async () => {
    await inMemoryProductsRepository.create(makeProduct({ sku: 'SKU-01' }))
    const productToEdit = makeProduct(
      { sku: 'SKU-02' },
      new UniqueEntityID('p2'),
    )
    await inMemoryProductsRepository.create(productToEdit)

    const result = await sut.execute({
      productId: 'p2',
      title: 'Any Title',
      sku: 'SKU-01',
      price: 100,
      stock: 10,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError)
  })

  it('should not be able to edit a product with negative stock', async () => {
    const product = makeProduct({}, new UniqueEntityID('p1'))
    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: 'p1',
      title: 'Any Title',
      sku: 'SKU-ANY',
      price: 100,
      stock: -5,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStockError)
  })
})
