import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryCommentOnQuestionsRepository } from 'test/repositories/in-memory-comment-on-question-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let inMemoryCommentOnQuestionsRepository: InMemoryCommentOnQuestionsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryCommentOnQuestionsRepository =
      new InMemoryCommentOnQuestionsRepository()

    sut = new DeleteQuestionCommentUseCase(inMemoryCommentOnQuestionsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryCommentOnQuestionsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryCommentOnQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryCommentOnQuestionsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
