import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidStockError extends Error implements UseCaseError {
  constructor() {
    super('Stock cannot be less than 0.')
  }
}
