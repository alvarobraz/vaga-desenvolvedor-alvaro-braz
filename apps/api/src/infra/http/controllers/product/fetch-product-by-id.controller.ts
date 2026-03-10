import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchProductByIdUseCase } from '@/domain/application/use-cases/fetch-product-by-id'
import { ProductPresenter } from '../../presenters/product-presenter'

@Controller('/products/:id')
@UseGuards(JwtAuthGuard)
export class FetchProductByIdController {
  constructor(private fetchProductById: FetchProductByIdUseCase) {}

  @Get()
  async handle(@Param('id') productId: string) {
    const result = await this.fetchProductById.execute({
      productId,
    })

    if (result.isLeft()) {
      throw new NotFoundException('Product not found')
    }

    const { product } = result.value

    return {
      product: ProductPresenter.toHTTP(product),
    }
  }
}
