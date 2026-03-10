import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { EditClientUseCase } from './edit-client'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: EditClientUseCase

describe('Edit Client', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new EditClientUseCase(inMemoryClientsRepository)
  })

  it('should be able to edit a client', async () => {
    const newClient = makeClient(
      { name: 'Old Name' },
      new UniqueEntityID('client-1'),
    )

    await inMemoryClientsRepository.create(newClient)

    const result = await sut.execute({
      clientId: 'client-1',
      name: 'New Name',
      email: 'newemail@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientsRepository.items[0].name).toBe('New Name')
    expect(inMemoryClientsRepository.items[0].updatedAt).toBeInstanceOf(Date)
  })

  it('should not be able to edit a non-existing client', async () => {
    const result = await sut.execute({
      clientId: 'non-existing-id',
      name: 'Any Name',
      email: 'any@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a client with an email already taken by another client', async () => {
    const clientA = makeClient({ email: 'client-a@example.com' })
    await inMemoryClientsRepository.create(clientA)

    const clientB = makeClient({ email: 'client-b@example.com' })
    await inMemoryClientsRepository.create(clientB)

    const result = await sut.execute({
      clientId: clientB.id.toString(),
      name: 'Client B Updated Name',
      email: 'client-a@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
  })

  it('should be able to edit a client name keeping the same email', async () => {
    const client = makeClient({ email: 'same-email@example.com' })
    await inMemoryClientsRepository.create(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      name: 'Updated Name',
      email: 'same-email@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientsRepository.items[0].name).toBe('Updated Name')
  })
})
