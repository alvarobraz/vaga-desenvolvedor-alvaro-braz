import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { FetchClientsUseCase } from './fetch-clients'
import { makeClient } from 'test/factories/make-client'
import { Cpf } from '@/domain/enterprise/entities/value-objects/cpf'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: FetchClientsUseCase

describe('Fetch Clients', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new FetchClientsUseCase(inMemoryClientsRepository)
  })

  it('should be able to fetch paginated clients', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryClientsRepository.create(
        makeClient({
          name: `Client ${i}`,
          email: `client${i}@example.com`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clients).toHaveLength(2)
    expect(result.value?.clients[0].name).toBe('Client 21')
  })

  it('should be able to fetch clients filtered by name', async () => {
    await inMemoryClientsRepository.create(makeClient({ name: 'Álvaro Braz' }))
    await inMemoryClientsRepository.create(makeClient({ name: 'John Doe' }))

    const result = await sut.execute({
      page: 1,
      name: 'Álvaro',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clients).toHaveLength(1)
    expect(result.value?.clients[0].name).toBe('Álvaro Braz')
  })

  it('should be able to fetch clients filtered by cpf', async () => {
    const targetCpf = '80832875040'
    await inMemoryClientsRepository.create(
      makeClient({ cpf: Cpf.create(targetCpf) }),
    )
    await inMemoryClientsRepository.create(
      makeClient({ cpf: Cpf.create('95653853038') }),
    )

    const result = await sut.execute({
      page: 1,
      cpf: targetCpf,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clients).toHaveLength(1)
    expect(result.value?.clients[0].cpf.getValue()).toBe(targetCpf)
  })

  it('should be able to fetch clients filtered by email', async () => {
    const targetEmail = 'alvaro@example.com'

    await inMemoryClientsRepository.create(makeClient({ email: targetEmail }))
    await inMemoryClientsRepository.create(
      makeClient({ email: 'outro@email.com' }),
    )

    const result = await sut.execute({
      page: 1,
      email: 'alvaro',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clients).toHaveLength(1)
    expect(result.value?.clients[0].email).toBe(targetEmail)
  })
})
