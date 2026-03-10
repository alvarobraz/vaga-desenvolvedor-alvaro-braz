import {
  Body,
  Controller,
  Post,
  ConflictException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateClientUseCase } from '@/domain/application/use-cases/create-client'
import { ClientAlreadyExistsError } from '@/domain/application/use-cases/errors/client-already-exists-error'

const createClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string().min(6),
})

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('/clients')
export class CreateClientController {
  constructor(private createClientUseCase: CreateClientUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientBodySchema) {
    const { name, email, cpf, password } = body

    const result = await this.createClientUseCase.execute({
      name,
      email,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ClientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new Error('Unexpected error')
      }
    }

    return {
      message: 'Client created successfully',
    }
  }
}
