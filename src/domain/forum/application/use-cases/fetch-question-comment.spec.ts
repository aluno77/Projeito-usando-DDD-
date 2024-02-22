import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentUseCase } from './fetch-question-comment'
import { InMemoryCommentOnQuestionsRepository } from 'test/repositories/in-memory-comment-on-question-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryCommentOnQuestionsRepository: InMemoryCommentOnQuestionsRepository
let sut: FetchQuestionCommentUseCase

describe('Fetch question Comment', async () => {
  beforeEach(() => {
    inMemoryCommentOnQuestionsRepository =
      new InMemoryCommentOnQuestionsRepository()
    sut = new FetchQuestionCommentUseCase(inMemoryCommentOnQuestionsRepository)
  })

  it('should be able to fetch questions comments', async () => {
    await inMemoryCommentOnQuestionsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMemoryCommentOnQuestionsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMemoryCommentOnQuestionsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComment).toHaveLength(3)
  })

  it('should be able to fetch paginated question comment', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentOnQuestionsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComment).toHaveLength(2)
  })
})
