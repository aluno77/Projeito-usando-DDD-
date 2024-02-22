import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

export class Estudent extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Estudent(props, id)

    return student
  }
}
