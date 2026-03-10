import { Either, right } from '@/core/errors/either'
import { ClientsRepository } from '../repositories/clients-repository'

interface DeleteManyClientsUseCaseRequest {
  clientIds: string[]
}

type DeleteManyClientsUseCaseResponse = Either<null, null>

export class DeleteManyClientsUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    clientIds,
  }: DeleteManyClientsUseCaseRequest): Promise<DeleteManyClientsUseCaseResponse> {
    await this.clientsRepository.deleteMany(clientIds)

    return right(null)
  }
}
