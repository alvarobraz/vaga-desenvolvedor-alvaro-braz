import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { UpdateOrderStatusUseCase } from '@/domain/application/use-cases/update-order-status'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const updateOrderStatusBodySchema = z.object({
  status: z.enum(['OPEN', 'PAID', 'CANCELED']),
})

type UpdateOrderStatusBodySchema = z.infer<typeof updateOrderStatusBodySchema>

@Controller('/orders/:id/status')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateOrderStatusController {
  constructor(private updateOrderStatus: UpdateOrderStatusUseCase) {}

  @Patch()
  @Roles('admin')
  @HttpCode(204)
  async handle(
    @Param('id') orderId: string,
    @Body(new ZodValidationPipe(updateOrderStatusBodySchema))
    body: UpdateOrderStatusBodySchema,
  ) {
    const { status } = body

    const result = await this.updateOrderStatus.execute({
      orderId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
