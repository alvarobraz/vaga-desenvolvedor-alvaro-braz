import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client, ClientProps } from '@/domain/enterprise/entities/client'
import { Cpf } from '@/domain/enterprise/entities/value-objects/cpf'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
) {
  const client = Client.create(
    {
      name: 'John Doe',
      cpf: Cpf.create('12345678909'),
      email: 'johndoe@example.com',
      password: 'password123',
      role: 'client',
      ...override,
    },
    id,
  )

  return client
}
