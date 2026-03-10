import { Client } from '@/domain/enterprise/entities/client'
import { ClientModel } from '../models/client.model'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Cpf } from '@/domain/enterprise/entities/value-objects/cpf'

export class SequelizeClientMapper {
  static toDomain(raw: ClientModel): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as 'admin' | 'client',
        cpf: Cpf.create(raw.cpf),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(client: Client) {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
      role: client.role,
      cpf: client.cpf.getValue(),
    }
  }
}
