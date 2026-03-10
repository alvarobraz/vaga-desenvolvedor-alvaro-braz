import { UseCaseError } from '@/core/errors/use-case-error'

export class InsufficientStockError extends Error implements UseCaseError {
  constructor(productTitle: string) {
    super(`Product "${productTitle}" has insufficient stock.`)
  }
}
