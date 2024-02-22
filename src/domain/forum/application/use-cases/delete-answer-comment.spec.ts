import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryCommentOnAnswerRepository } from 'test/repositories/in-memory-comment-on-answer-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let inMemoryCommentOnAnswerRepository: InMemoryCommentOnAnswerRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryCommentOnAnswerRepository = new InMemoryCommentOnAnswerRepository()

    sut = new DeleteAnswerCommentUseCase(inMemoryCommentOnAnswerRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryCommentOnAnswerRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryCommentOnAnswerRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryCommentOnAnswerRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
