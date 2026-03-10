import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { OrderModel } from './order.model'
import { ProductModel } from './product.model'

@Table({
  tableName: 'order_items',
  timestamps: false,
})
export class OrderItemModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'order_id',
  })
  declare orderId: string

  @BelongsTo(() => OrderModel)
  declare order: OrderModel

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'product_id',
  })
  declare productId: string

  @BelongsTo(() => ProductModel)
  declare product: ProductModel

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'price_at_purchase',
  })
  declare priceAtPurchase: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number
}
