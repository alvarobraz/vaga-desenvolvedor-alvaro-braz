import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { EditClientUseCase } from '@/domain/application/use-cases/edit-client'

const editClientBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

type EditClientBodySchema = z.infer<typeof editClientBodySchema>

@Controller('/clients/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditClientController {
  constructor(private editClient: EditClientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editClientBodySchema))
    body: EditClientBodySchema,
    @Param('id') clientId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    if (user.role !== 'admin' && user.sub !== clientId) {
      throw new ForbiddenException(
        'You do not have permission to edit this client.',
      )
    }

    const { name, email } = body

    const result = await this.editClient.execute({
      clientId,
      name,
      email,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
