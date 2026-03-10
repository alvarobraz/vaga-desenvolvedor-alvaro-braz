import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Client } from '../../enterprise/entities/client'

export interface FindManyFilters {
  name?: string
  email?: string
  cpf?: string
}

@Injectable()
export abstract class ClientsRepository {
  abstract findById(id: string): Promise<Client | null>
  abstract findByCpf(cpf: string): Promise<Client | null>
  abstract findByEmail(email: string): Promise<Client | null>
  abstract findMany(
    params: PaginationParams,
    filter?: FindManyFilters,
  ): Promise<Client[]>
  abstract create(client: Client): Promise<void>
  abstract save(client: Client): Promise<void>
  abstract delete(client: Client): Promise<void>
  abstract deleteMany(ids: string[]): Promise<void>
}
