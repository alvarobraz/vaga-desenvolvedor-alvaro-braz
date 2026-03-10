import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ClientsRepository } from '@/domain/application/repositories/clients-repository'
import { ClientPresenter } from '../../presenters/client-presenter'

@Controller('/me')
@UseGuards(JwtAuthGuard)
export class FetchMeController {
  constructor(private clientsRepository: ClientsRepository) {}

  @Get()
  async handle(@CurrentUser() user: TokenPayload) {
    const userId = user.sub

    const client = await this.clientsRepository.findById(userId)

    if (!client) {
      throw new UnauthorizedException('User not found.')
    }

    return {
      client: ClientPresenter.toHTTP(client),
    }
  }
}
