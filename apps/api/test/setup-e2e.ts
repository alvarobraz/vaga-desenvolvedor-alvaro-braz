import { config } from 'dotenv'
import { envSchema } from '@/infra/env/env'
import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '@/infra/database/sequelize/models/client.model'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const schemaId = `test_worker_${process.env.VITEST_WORKER_ID || 1}`

beforeAll(async () => {
  const sequelize = new Sequelize(env.DATABASE_URL, {
    models: [ClientModel],
    logging: false,
    schema: schemaId,
    dialectOptions: {
      prependSearchPath: true,
    },
  })

  await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`)

  await sequelize.sync({ force: true })
  await sequelize.close()

  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  process.env.DATABASE_URL = url.toString()
})

afterAll(async () => {
  const sequelize = new Sequelize(env.DATABASE_URL, { logging: false })
  await sequelize.query(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await sequelize.close()
})
