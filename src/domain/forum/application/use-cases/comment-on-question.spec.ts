import { makeQuestion } from 'test/factories/make-question'
import { InMemoryCommentOnQuestionsRepository } from 'test/repositories/in-memory-comment-on-question-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryCommentOnQuestionsRepository: InMemoryCommentOnQuestionsRepository

let sut: CommentOnQuestionUseCase

describe('Comment on question', async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryCommentOnQuestionsRepository =
      new InMemoryCommentOnQuestionsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryCommentOnQuestionsRepository,
    )
  })
  // deve ser capaz de escolher a melhor resposta para a pergunta
  it('should be able to comment on question', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'This is a comment',
    })

    expect(inMemoryCommentOnQuestionsRepository.items[0].content).toEqual(
      'This is a comment',
    )
  })
})
