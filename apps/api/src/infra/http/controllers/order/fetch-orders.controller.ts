import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FetchOrdersUseCase } from '@/domain/application/use-cases/fetch-orders'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '../../presenters/order-presenter'

const fetchOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  orderCode: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  status: z.enum(['OPEN', 'PAID', 'CANCELED']).optional(),
  clientId: z.string().uuid().optional(),
  startDate: z.string().pipe(z.coerce.date()).optional(),
  endDate: z.string().pipe(z.coerce.date()).optional(),
})

type FetchOrdersQuerySchema = z.infer<typeof fetchOrdersQuerySchema>

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class FetchOrdersController {
  constructor(private fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(fetchOrdersQuerySchema))
    query: FetchOrdersQuerySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { page, orderCode, status, clientId, startDate, endDate } = query

    let targetClientId = clientId

    if (user.role !== 'admin') {
      if (clientId && clientId !== user.sub) {
        throw new ForbiddenException('You can only access your own orders.')
      }
      targetClientId = user.sub
    }

    const result = await this.fetchOrders.execute({
      page,
      orderCode,
      status,
      clientId: targetClientId,
      startDate,
      endDate,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
