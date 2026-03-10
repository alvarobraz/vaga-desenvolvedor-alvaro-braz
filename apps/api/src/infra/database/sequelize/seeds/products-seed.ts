import { ProductModel } from '../models/product.model'
import { randomUUID } from 'node:crypto'

export async function seedProducts() {
  const productsToCreate = []

  for (let i = 1; i <= 30; i++) {
    productsToCreate.push({
      id: randomUUID(),
      sku: `SKU-PROD-${String(i).padStart(3, '0')}`,
      title: `Produto de Teste #${i}`,
      price: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
      stock: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  try {
    await ProductModel.bulkCreate(productsToCreate, {
      ignoreDuplicates: true,
    })
    console.log('30 produtos criados com sucesso!')
  } catch (error) {
    console.error('Erro ao criar seed de produtos:', error)
  }
}
