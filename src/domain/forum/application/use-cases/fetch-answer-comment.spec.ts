import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryCommentOnAnswerRepository } from 'test/repositories/in-memory-comment-on-answer-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment'

let inMemoryCommentOnAnswerRepository: InMemoryCommentOnAnswerRepository
let sut: FetchAnswerCommentUseCase

describe('Fetch answer Comment', async () => {
  beforeEach(() => {
    inMemoryCommentOnAnswerRepository = new InMemoryCommentOnAnswerRepository()
    sut = new FetchAnswerCommentUseCase(inMemoryCommentOnAnswerRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryCommentOnAnswerRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )
    await inMemoryCommentOnAnswerRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )
    await inMemoryCommentOnAnswerRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComment).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comment', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentOnAnswerRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComment).toHaveLength(2)
  })
})
