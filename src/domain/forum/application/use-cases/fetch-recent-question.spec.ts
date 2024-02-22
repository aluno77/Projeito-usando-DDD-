import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionUseCase } from './fetch-recent-question'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionUseCase

describe('Fetch recent question', async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )

    sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    vi.setSystemTime(new Date(2023, 0, 20))

    await inMemoryQuestionsRepository.create(makeQuestion({}))

    vi.setSystemTime(new Date(2023, 0, 18))

    await inMemoryQuestionsRepository.create(makeQuestion({}))

    vi.setSystemTime(new Date(2023, 0, 23))

    await inMemoryQuestionsRepository.create(makeQuestion({}))

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
