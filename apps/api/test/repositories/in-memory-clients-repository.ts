import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  ClientsRepository,
  FindManyFilters,
} from '@/domain/application/repositories/clients-repository'
import { Client } from '@/domain/enterprise/entities/client'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async findById(id: string) {
    const client = this.items.find(item => item.id.toString() === id)
    if (!client) return null
    return client
  }

  async findByCpf(cpf: string) {
    const client = this.items.find(item => item.cpf.getValue() === cpf)
    if (!client) return null
    return client
  }

  async findByEmail(email: string) {
    const client = this.items.find(item => item.email === email)
    if (!client) return null
    return client
  }

  async findMany({ page }: PaginationParams, filter?: FindManyFilters) {
    const clients = this.items
      .filter(item => {
        if (filter?.name && !item.name.includes(filter.name)) return false
        if (filter?.email && !item.email.includes(filter.email)) return false
        if (filter?.cpf && item.cpf.getValue() !== filter.cpf) return false
        return true
      })
      .slice((page - 1) * 20, page * 20)

    return clients
  }

  async create(client: Client) {
    this.items.push(client)
  }

  async save(client: Client) {
    const itemIndex = this.items.findIndex(item => item.id === client.id)
    this.items[itemIndex] = client
  }

  async delete(client: Client) {
    const itemIndex = this.items.findIndex(item => item.id === client.id)
    this.items.splice(itemIndex, 1)
  }

  async deleteMany(ids: string[]) {
    this.items = this.items.filter(item => !ids.includes(item.id.toString()))
  }
}
