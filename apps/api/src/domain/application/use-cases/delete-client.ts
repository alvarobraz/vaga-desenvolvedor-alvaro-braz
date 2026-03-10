import { Either, left, right } from '@/core/errors/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteClientUseCaseRequest {
  clientId: string
}

type DeleteClientUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
  }: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    await this.clientsRepository.delete(client)

    return right(null)
  }
}
