import { Either, right } from '@/core/errors/either'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientsRepository } from '../repositories/clients-repository'
import { Injectable } from '@nestjs/common'

interface FetchClientsUseCaseRequest {
  page: number
  name?: string
  email?: string
  cpf?: string
}

type FetchClientsUseCaseResponse = Either<
  null,
  {
    clients: Client[]
  }
>

@Injectable()
export class FetchClientsUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    page,
    name,
    email,
    cpf,
  }: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
    const clients = await this.clientsRepository.findMany(
      { page },
      { name, email, cpf },
    )

    return right({
      clients,
    })
  }
}
