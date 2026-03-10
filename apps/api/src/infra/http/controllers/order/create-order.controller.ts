import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateOrderUseCase } from '@/domain/application/use-cases/create-order'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { InsufficientStockError } from '@/domain/application/use-cases/errors/insufficient-stock-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

const createOrderBodySchema = z.object({
  clientId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createOrderBodySchema))
    body: CreateOrderBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { clientId, items } = body

    if (user.role !== 'admin' && user.sub !== clientId) {
      throw new ForbiddenException(
        'You can only create orders for your own account.',
      )
    }

    const result = await this.createOrder.execute({
      clientId,
      items,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InsufficientStockError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { order } = result.value

    return {
      orderId: order.id.toString(),
      orderCode: order.orderCode,
    }
  }
}
