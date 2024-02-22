/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker'

import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId,
) {
  const question = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return question
}
