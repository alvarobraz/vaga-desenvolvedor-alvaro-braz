import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateProductUseCase } from '@/domain/application/use-cases/create-product'
import { ProductAlreadyExistsError } from '@/domain/application/use-cases/errors/product-already-exists-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const createProductBodySchema = z.object({
  sku: z.string(),
  title: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @Roles('admin')
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createProductBodySchema))
    body: CreateProductBodySchema,
  ) {
    const { sku, title, price, stock } = body

    const result = await this.createProduct.execute({
      sku,
      title,
      price,
      stock,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
