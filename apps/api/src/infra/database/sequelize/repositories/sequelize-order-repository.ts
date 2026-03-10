import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/enterprise/entities/order'
import {
  OrdersRepository,
  OrdersFilterParams,
} from '@/domain/application/repositories/orders-repository'
import { SequelizeOrderMapper } from '../mappers/sequelize-order-mapper'
import { OrderItemModel } from '../models/order-item.model'
import { OrderModel } from '../models/order.model'

@Injectable()
export class SequelizeOrdersRepository implements OrdersRepository {
  constructor(
    @InjectModel(OrderModel)
    private orderModel: typeof OrderModel,
    @InjectModel(OrderItemModel)
    private orderItemModel: typeof OrderItemModel,
    private sequelize: Sequelize,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.orderModel.findByPk(id, {
      include: [OrderItemModel],
    })

    if (!order) return null

    return SequelizeOrderMapper.toDomain(order)
  }

  async findMany(
    { page }: PaginationParams,
    filter?: OrdersFilterParams,
  ): Promise<Order[]> {
    const where: any = {}

    if (filter?.orderCode) where.orderCode = filter.orderCode
    if (filter?.status) where.status = filter.status
    if (filter?.clientId) where.clientId = filter.clientId

    if (filter?.startDate || filter?.endDate) {
      where.createdAt = {}
      if (filter.startDate) where.createdAt[Op.gte] = filter.startDate
      if (filter.endDate) where.createdAt[Op.lte] = filter.endDate
    }

    const orders = await this.orderModel.findAll({
      where,
      include: [OrderItemModel],
      limit: 20,
      offset: (page - 1) * 20,
      order: [['createdAt', 'DESC']],
    })

    return orders.map(SequelizeOrderMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = SequelizeOrderMapper.toPersistence(order)

    await this.sequelize.transaction(async t => {
      await this.orderModel.create(data, { transaction: t })

      if (data.items && data.items.length > 0) {
        await this.orderItemModel.bulkCreate(data.items, { transaction: t })
      }
    })
  }

  async save(order: Order): Promise<void> {
    const data = SequelizeOrderMapper.toPersistence(order)

    await this.orderModel.update(data, {
      where: { id: data.id },
    })
  }

  async delete(order: Order): Promise<void> {
    await this.orderModel.destroy({
      where: { id: order.id.toString() },
    })
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.orderModel.destroy({
      where: { id: { [Op.in]: ids } },
    })
  }
}
