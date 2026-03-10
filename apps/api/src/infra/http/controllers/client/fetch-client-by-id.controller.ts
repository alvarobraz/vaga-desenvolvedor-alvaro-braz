import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { ClientsRepository } from '@/domain/application/repositories/clients-repository'
import { ClientPresenter } from '../../presenters/client-presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

@Controller('/clients/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchClientByIdController {
  constructor(private clientsRepository: ClientsRepository) {}

  @Get()
  @Roles('admin')
  async handle(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    if (user.role !== 'admin' && user.sub !== id) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      )
    }

    const client = await this.clientsRepository.findById(id)

    if (!client) {
      throw new NotFoundException('Client not found.')
    }

    return {
      client: ClientPresenter.toHTTP(client),
    }
  }
}
