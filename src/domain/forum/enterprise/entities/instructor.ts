import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstrutorProps {
  name: string
}

export class Instrutor extends Entity<InstrutorProps> {
  static create(props: InstrutorProps, id?: UniqueEntityId) {
    const instructor = new Instrutor(props, id)

    return instructor
  }
}
