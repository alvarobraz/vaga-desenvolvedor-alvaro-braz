import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

@Table({
  tableName: 'products',
  timestamps: true,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare sku: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare price: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare stock: number

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
