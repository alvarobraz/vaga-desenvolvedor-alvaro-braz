import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../models/product.model'
import { seedProducts } from './products-seed'
import 'dotenv/config'

async function run() {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    models: [ProductModel],
    logging: false,
  })

  await seedProducts()
  await sequelize.close()
}

run()
