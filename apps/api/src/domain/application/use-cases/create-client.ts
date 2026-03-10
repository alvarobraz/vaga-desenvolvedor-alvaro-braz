import { Injectable } from '@nestjs/common'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientsRepository } from '../repositories/clients-repository'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'
import { Cpf } from '@/domain/enterprise/entities/value-objects/cpf'
import { Either, left, right } from '@/core/errors/either'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateClientUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
}

type CreateClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

@Injectable()
export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const cpfVo = Cpf.create(cpf)

    const clientWithSameCpf = await this.clientsRepository.findByCpf(
      cpfVo.getValue(),
    )

    if (clientWithSameCpf) {
      return left(new ClientAlreadyExistsError(cpf))
    }

    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if (clientWithSameEmail) {
      return left(new ClientAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      cpf: cpfVo,
      email,
      password: hashedPassword,
      role: 'client',
    })

    await this.clientsRepository.create(client)

    return right({
      client,
    })
  }
}
