import { UseCaseError } from '@/core/errors/use-case-error'

export class ProductAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Product with SKU "${identifier}" already exists.`)
  }
}
