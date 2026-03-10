import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import {
  ClientsRepository,
  FindManyFilters,
} from '@/domain/application/repositories/clients-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientModel } from '../models/client.model'
import { SequelizeClientMapper } from '../mappers/sequelize-client-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { WhereOptions, Op } from 'sequelize'

@Injectable()
export class SequelizeClientsRepository implements ClientsRepository {
  constructor(
    @InjectModel(ClientModel)
    private clientModel: typeof ClientModel,
  ) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.clientModel.findByPk(id)

    if (!client) {
      return null
    }

    return SequelizeClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({
      where: { email },
    })

    if (!client) {
      return null
    }

    return SequelizeClientMapper.toDomain(client)
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({
      where: { cpf },
    })

    if (!client) {
      return null
    }

    return SequelizeClientMapper.toDomain(client)
  }

  async findMany(
    { page }: PaginationParams,
    { name, email, cpf }: FindManyFilters,
  ) {
    const where: WhereOptions = {}

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` }
    }

    if (email) {
      where.email = email
    }

    if (cpf) {
      where.cpf = cpf
    }

    const clients = await ClientModel.findAll({
      where,
      limit: 20,
      offset: (page - 1) * 20,
      order: [['created_at', 'DESC']],
    })

    return clients.map(SequelizeClientMapper.toDomain)
  }

  async create(client: Client): Promise<void> {
    const data = SequelizeClientMapper.toPersistence(client)
    await this.clientModel.create(data)
  }

  async save(client: Client): Promise<void> {
    const data = SequelizeClientMapper.toPersistence(client)
    await this.clientModel.update(data, {
      where: { id: client.id.toString() },
    })
  }

  async delete(client: Client): Promise<void> {
    await this.clientModel.destroy({
      where: { id: client.id.toString() },
    })
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.clientModel.destroy({
      where: { id: ids },
    })
  }
}
