import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { TokenPayload } from './jwt.strategy'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    const payload = user as TokenPayload

    const hasRole = requiredRoles.includes(payload.role)

    if (!hasRole) {
      throw new ForbiddenException('Access restricted to administrators.')
    }

    return hasRole
  }
}
