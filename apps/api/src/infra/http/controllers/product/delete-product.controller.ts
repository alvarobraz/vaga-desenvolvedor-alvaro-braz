import {
  Controller,
  Delete,
  HttpCode,
  Param,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { DeleteProductUseCase } from '@/domain/application/use-cases/delete-product'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

@Controller('/products/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProductUseCase) {}

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  async handle(@Param('id') productId: string) {
    const result = await this.deleteProduct.execute({
      productId,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException()
    }
  }
}
