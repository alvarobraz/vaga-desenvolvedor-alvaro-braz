import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientModel } from '@/infra/database/sequelize/models/client.model'
import { getModelToken } from '@nestjs/sequelize'
import { randomUUID } from 'node:crypto'

describe('Create Client (E2E)', () => {
  let app: INestApplication
  let clientModel: typeof ClientModel

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    clientModel = moduleRef.get<typeof ClientModel>(getModelToken(ClientModel))

    await app.init()
  })

  beforeEach(async () => {
    await clientModel.destroy({ where: {}, truncate: true, cascade: true })
  })

  test('[POST] /clients', async () => {
    const response = await request(app.getHttpServer()).post('/clients').send({
      name: 'Álvaro Braz',
      email: 'alvaro@example.com',
      password: 'password123',
      cpf: '12345678909',
    })

    expect(response.statusCode).toBe(201)

    const clientOnDatabase = await clientModel.findOne({
      where: { email: 'alvaro@example.com' },
    })

    expect(clientOnDatabase).toBeTruthy()
    expect(clientOnDatabase?.name).toBe('Álvaro Braz')

    expect(clientOnDatabase?.role).toBe('client')

    expect(clientOnDatabase?.password).not.toBe('password123')
    expect(clientOnDatabase?.password.length).toBeGreaterThan(20)
  })

  test('[POST] /clients (Conflict with existing email)', async () => {
    await clientModel.create({
      id: randomUUID(),
      name: 'Existing User',
      email: 'duplicate@example.com',
      password: 'hashed-password',
      cpf: '12345678909',
      role: 'client',
    })

    const response = await request(app.getHttpServer()).post('/clients').send({
      name: 'New User',
      email: 'duplicate@example.com',
      password: 'password123',
      cpf: '98765432100',
    })

    expect(response.statusCode).toBe(409)
  })
})
