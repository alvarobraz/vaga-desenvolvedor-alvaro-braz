import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FetchClientsUseCase } from '@/domain/application/use-cases/fetch-clients'
import { ClientPresenter } from '../../presenters/client-presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const queryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  name: z.string().optional(),
  email: z.string().optional(),
  cpf: z.string().optional(),
})

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class FetchClientsController {
  constructor(private fetchClients: FetchClientsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(queryParamsSchema)) query: QueryParamsSchema,
  ) {
    const { page, name, email, cpf } = query

    const result = await this.fetchClients.execute({
      page,
      name,
      email,
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { clients } = result.value

    return {
      clients: clients.map(ClientPresenter.toHTTP),
    }
  }
}
