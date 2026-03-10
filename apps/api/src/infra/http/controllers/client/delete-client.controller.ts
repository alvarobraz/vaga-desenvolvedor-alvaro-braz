import {
  Controller,
  Delete,
  HttpCode,
  Param,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common'
import { DeleteClientUseCase } from '@/domain/application/use-cases/delete-client'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

@Controller('/clients/:id')
@UseGuards(JwtAuthGuard)
export class DeleteClientController {
  constructor(private deleteClient: DeleteClientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') clientId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    if (user.role !== 'admin' && user.sub !== clientId) {
      throw new ForbiddenException(
        'You do not have permission to delete this client.',
      )
    }

    const result = await this.deleteClient.execute({
      clientId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
