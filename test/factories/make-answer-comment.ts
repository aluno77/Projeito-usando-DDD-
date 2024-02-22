/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker'

import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answer = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return answer
}
