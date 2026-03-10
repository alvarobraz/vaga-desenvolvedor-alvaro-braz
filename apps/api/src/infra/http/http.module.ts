import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateClientController } from './controllers/client/create-client.controller'
import { CreateClientUseCase } from '@/domain/application/use-cases/create-client'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/client/authenticate.controller'
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate'
import { FetchMeController } from './controllers/client/fetch-me.controller'
import { FetchClientsController } from './controllers/client/fetch-clients.controller'
import { FetchClientsUseCase } from '@/domain/application/use-cases/fetch-clients'
import { FetchClientByIdController } from './controllers/client/fetch-client-by-id.controller'
import { EditClientController } from './controllers/client/edit-client.controller'
import { EditClientUseCase } from '@/domain/application/use-cases/edit-client'
import { CreateProductController } from './controllers/product/create-product.controller'
import { CreateProductUseCase } from '@/domain/application/use-cases/create-product'
import { FetchProductsController } from './controllers/product/fetch-products.controller'
import { FetchProductsUseCase } from '@/domain/application/use-cases/fetch-products'
import { FetchProductByIdController } from './controllers/product/fetch-product-by-id.controller'
import { FetchProductByIdUseCase } from '@/domain/application/use-cases/fetch-product-by-id'
import { EditProductController } from './controllers/product/edit-product.controller'
import { EditProductUseCase } from '@/domain/application/use-cases/edit-product'
import { CreateOrderController } from './controllers/order/create-order.controller'
import { CreateOrderUseCase } from '@/domain/application/use-cases/create-order'
import { FetchOrdersController } from './controllers/order/fetch-orders.controller'
import { FetchOrdersUseCase } from '@/domain/application/use-cases/fetch-orders'
import { UpdateOrderStatusController } from './controllers/order/update-order-status.controller'
import { UpdateOrderStatusUseCase } from '@/domain/application/use-cases/update-order-status'
import { DeleteProductController } from './controllers/product/delete-product.controller'
import { DeleteProductUseCase } from '@/domain/application/use-cases/delete-product'
import { DeleteClientController } from './controllers/client/delete-client.controller'
import { DeleteClientUseCase } from '@/domain/application/use-cases/delete-client'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateClientController,
    AuthenticateController,
    FetchMeController,
    FetchClientsController,
    FetchClientByIdController,
    EditClientController,
    CreateProductController,
    FetchProductsController,
    FetchProductByIdController,
    EditProductController,
    CreateOrderController,
    FetchOrdersController,
    UpdateOrderStatusController,
    DeleteProductController,
    DeleteClientController,
  ],
  providers: [
    CreateClientUseCase,
    AuthenticateUseCase,
    FetchClientsUseCase,
    EditClientUseCase,
    CreateProductUseCase,
    FetchProductsUseCase,
    FetchProductByIdUseCase,
    EditProductUseCase,
    CreateOrderUseCase,
    FetchOrdersUseCase,
    UpdateOrderStatusUseCase,
    DeleteProductUseCase,
    DeleteClientUseCase,
  ],
})
export class HttpModule {}
