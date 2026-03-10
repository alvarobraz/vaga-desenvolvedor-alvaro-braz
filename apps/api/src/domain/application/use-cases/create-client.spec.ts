import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { CreateClientUseCase } from './create-client'
import { makeClient } from 'test/factories/make-client'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let sut: CreateClientUseCase

describe('Create Client', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateClientUseCase(inMemoryClientsRepository, fakeHasher)
  })

  it('should be able to create a client', async () => {
    const result = await sut.execute({
      name: 'Álvaro Braz',
      cpf: '12345678909',
      email: 'alvaro@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientsRepository.items[0].name).toBe('Álvaro Braz')
    expect(inMemoryClientsRepository.items[0].password).toBe(
      'password123-hashed',
    )
    expect(inMemoryClientsRepository.items[0].cpf.getValue()).toBe(
      '12345678909',
    )

    expect(inMemoryClientsRepository.items[0].role).toBe('client')
  })

  it('should not be able to create a client with same CPF', async () => {
    const cleanCpf = '12345678909'

    const previousClient = makeClient({
      cpf: (
        await import('@/domain/enterprise/entities/value-objects/cpf')
      ).Cpf.create(cleanCpf),
    })

    await inMemoryClientsRepository.create(previousClient)

    const result = await sut.execute({
      name: 'Outro Nome',
      cpf: cleanCpf,
      email: 'outro@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
  })

  it('should not be able to create a client with same email', async () => {
    const email = 'johndoe@example.com'

    await inMemoryClientsRepository.create(makeClient({ email }))

    const result = await sut.execute({
      name: 'Another Name',
      cpf: '98765432100',
      email,
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
    if (result.value instanceof ClientAlreadyExistsError) {
      expect(result.value.message).toContain(email)
    }
  })
})
