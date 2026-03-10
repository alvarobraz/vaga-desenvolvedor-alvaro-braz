import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { z } from 'zod'
import { EditProductUseCase } from '@/domain/application/use-cases/edit-product'
import { ProductAlreadyExistsError } from '@/domain/application/use-cases/errors/product-already-exists-error'
import { InvalidStockError } from '@/domain/application/use-cases/errors/invalid-stock-error'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editProductBodySchema = z.object({
  title: z.string(),
  sku: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
})

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@Controller('/products/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditProductController {
  constructor(private editProduct: EditProductUseCase) {}

  @Put()
  @Roles('admin')
  @HttpCode(204)
  async handle(
    @Param('id') productId: string,
    @Body(new ZodValidationPipe(editProductBodySchema))
    body: EditProductBodySchema,
  ) {
    const { title, sku, price, stock } = body

    const result = await this.editProduct.execute({
      productId,
      title,
      sku,
      price,
      stock,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message)
        case InvalidStockError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
