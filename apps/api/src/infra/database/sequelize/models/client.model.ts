import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript'
import { OrderModel } from './order.model'

@Table({
  tableName: 'clients',
  timestamps: true,
  underscored: true,
})
export class ClientModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false, unique: true })
  declare email: string

  @Column({ allowNull: false })
  declare password: string

  @Column({
    type: DataType.ENUM('admin', 'client'),
    defaultValue: 'client',
    allowNull: false,
  })
  declare role: string

  @Column({ allowNull: false })
  declare cpf: string

  @HasMany(() => OrderModel, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  declare orders: OrderModel[]
}
