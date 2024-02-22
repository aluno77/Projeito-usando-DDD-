import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryCommentOnAnswerRepository } from 'test/repositories/in-memory-comment-on-answer-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryCommentOnAnswerRepository: InMemoryCommentOnAnswerRepository

let sut: CommentOnAnswerUseCase

describe('Comment on answer', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryCommentOnAnswerRepository = new InMemoryCommentOnAnswerRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryCommentOnAnswerRepository,
    )
  })
  // deve ser capaz de escolher a melhor resposta para a pergunta
  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'This is a comment answer',
    })

    expect(inMemoryCommentOnAnswerRepository.items[0].content).toEqual(
      'This is a comment answer',
    )
  })
})
