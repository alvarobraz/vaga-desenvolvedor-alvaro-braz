import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientModel } from './sequelize/models/client.model'
import { ClientsRepository } from '@/domain/application/repositories/clients-repository'
import { SequelizeClientsRepository } from './sequelize/repositories/sequelize-clients-repository'
import { ProductsRepository } from '@/domain/application/repositories/products-repository'
import { SequelizeProductsRepository } from './sequelize/repositories/sequelize-products-repository'
import { ProductModel } from './sequelize/models/product.model'
import { OrdersRepository } from '@/domain/application/repositories/orders-repository'
import { SequelizeOrdersRepository } from './sequelize/repositories/sequelize-order-repository'
import { OrderItemModel } from './sequelize/models/order-item.model'
import { OrderModel } from './sequelize/models/order.model'

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'docker',
      password: 'docker',
      database: 'signo-tech',
      models: [ClientModel, ProductModel, OrderModel, OrderItemModel],
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
      logging: false,
    }),
    SequelizeModule.forFeature([
      ClientModel,
      ProductModel,
      OrderModel,
      OrderItemModel,
    ]),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL,
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
  ],
  providers: [
    {
      provide: ClientsRepository,
      useClass: SequelizeClientsRepository,
    },
    {
      provide: ProductsRepository,
      useClass: SequelizeProductsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: SequelizeOrdersRepository,
    },
  ],
  exports: [ClientsRepository, ProductsRepository, OrdersRepository],
})
export class DatabaseModule {}
