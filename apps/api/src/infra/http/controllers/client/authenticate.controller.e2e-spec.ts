import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { ClientModel } from '@/infra/database/sequelize/models/client.model'
import { getModelToken } from '@nestjs/sequelize'

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await clientModel.create({
      id: '8610534c-6869-4503-99b3-577741366964',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      cpf: '24914535092',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
