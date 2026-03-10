import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import { ClientModel } from './client.model'
import { OrderItemModel } from './order-item.model'

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: 'order_code',
  })
  declare orderCode: number

  @ForeignKey(() => ClientModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'client_id',
  })
  declare clientId: string

  @BelongsTo(() => ClientModel)
  declare client: ClientModel

  @Column({
    type: DataType.ENUM('OPEN', 'PAID', 'CANCELED', 'SHIPPED'),
    allowNull: false,
    defaultValue: 'OPEN',
  })
  declare status: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare total: number

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[]

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt: Date

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date
}
