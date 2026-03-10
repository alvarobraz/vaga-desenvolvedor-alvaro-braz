import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ProductProps {
  sku: string
  title: string
  price: number
  stock: number
  createdAt: Date
  updatedAt?: Date
}

export class Product extends Entity<ProductProps> {
  get sku() {
    return this.props.sku
  }
  get title() {
    return this.props.title
  }
  get price() {
    return this.props.price
  }
  get stock() {
    return this.props.stock
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  set sku(sku: string) {
    this.props.sku = sku
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set price(price: number) {
    this.props.price = price
    this.touch()
  }

  set stock(stock: number) {
    this.props.stock = stock
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProductProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
