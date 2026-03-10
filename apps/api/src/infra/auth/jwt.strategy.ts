import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['admin', 'client']),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const jwtSecret = config.get('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    })
  }

  async validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
