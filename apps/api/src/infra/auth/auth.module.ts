import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvModule } from '../env/env.module' // Certifique-se de ter esse módulo
import { EnvService } from '../env/env.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const secret = env.get('JWT_SECRET')

        return {
          secret,
          signOptions: { algorithm: 'HS256', expiresIn: '1d' },
        }
      },
    }),
  ],
  providers: [JwtStrategy, EnvService],
  exports: [JwtModule],
})
export class AuthModule {}
