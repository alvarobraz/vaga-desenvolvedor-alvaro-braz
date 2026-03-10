import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUseCase } from './authenticate'
import { makeClient } from 'test/factories/make-client'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(
      inMemoryClientsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'wrong@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const client = makeClient({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
