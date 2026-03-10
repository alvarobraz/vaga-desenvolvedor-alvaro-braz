import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/env/env'
import { AuthModule } from './infra/auth/auth.module'
import { HttpModule } from './infra/http/http.module'
import { DatabaseModule } from './infra/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: obj => envSchema.parse(obj),
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
})
export class AppModule {}
