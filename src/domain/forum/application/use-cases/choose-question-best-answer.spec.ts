import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from './../../../../../test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Chosse question best answer', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository()

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  // deve ser casa de escolher a melhor resposta para a pergunta
  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  // não deve ser possível escolher a resposta de apostas de outra pergunta do usuário
  it('should not be able to choose another user question bets answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityId('author-1') })

    const answer = makeAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
