import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FetchProductsUseCase } from '@/domain/application/use-cases/fetch-products'
import { ProductPresenter } from '../../presenters/product-presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  title: z.string().optional(),
  sku: z.string().optional(),
})

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class FetchProductsController {
  constructor(private fetchProducts: FetchProductsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(queryParamsSchema)) query: QueryParamsSchema,
  ) {
    const { page, title, sku } = query

    const result = await this.fetchProducts.execute({
      page,
      title,
      sku,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const products = result.value.products

    return {
      products: products.map(ProductPresenter.toHTTP),
    }
  }
}
