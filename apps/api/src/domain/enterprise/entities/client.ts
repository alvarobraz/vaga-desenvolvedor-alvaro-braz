import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Cpf } from './value-objects/cpf'

export type UserRole = 'admin' | 'client'

export interface ClientProps {
  name: string
  cpf: Cpf
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt?: Date
}

export class Client extends Entity<ClientProps> {
  get name() {
    return this.props.name
  }
  get cpf() {
    return this.props.cpf
  }
  get email() {
    return this.props.email
  }
  get password() {
    return this.props.password
  }
  get role() {
    return this.props.role
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  set role(role: UserRole) {
    this.props.role = role
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ClientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const client = new Client(
      {
        ...props,
        role: props.role ?? 'client',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return client
  }
}
