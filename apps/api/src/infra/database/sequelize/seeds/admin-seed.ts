import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ClientsRepository } from '@/domain/application/repositories/clients-repository'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'
import { Client } from '@/domain/enterprise/entities/client'
import { Cpf } from '@/domain/enterprise/entities/value-objects/cpf'

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule)

  const clientsRepository = app.get(ClientsRepository)
  const hashGenerator = app.get(HashGenerator)

  const email = 'admin@example.com'
  const cpf = '07994321054'

  const exists = await clientsRepository.findByEmail(email)

  if (exists) {
    await app.close()
    return
  }

  const hashedPassword = await hashGenerator.hash('1234567')

  const admin = Client.create({
    name: 'Admin',
    email,
    cpf: Cpf.create(cpf),
    password: hashedPassword,
    role: 'admin',
  })

  await clientsRepository.create(admin)

  await app.close()
}

run()
