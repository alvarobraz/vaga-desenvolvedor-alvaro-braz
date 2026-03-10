import { Either, left, right } from '@/core/errors/either'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'
import { Injectable } from '@nestjs/common'

interface EditClientUseCaseRequest {
  clientId: string
  name?: string
  email?: string
}

type EditClientUseCaseResponse = Either<
  ResourceNotFoundError | ClientAlreadyExistsError,
  {
    client: Client
  }
>

@Injectable()
export class EditClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
    name,
    email,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    if (email) {
      const clientWithSameEmail =
        await this.clientsRepository.findByEmail(email)

      if (clientWithSameEmail && !clientWithSameEmail.id.equals(client.id)) {
        return left(new ClientAlreadyExistsError(email))
      }

      client.email = email
    }

    if (name) {
      client.name = name
    }

    await this.clientsRepository.save(client)

    return right({
      client,
    })
  }
}
