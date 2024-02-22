import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comment-repository'

interface FetchAnswerCommentUseCaseRequest {
  answerId: string
  page: number
}
type FetchAnswerCommentUseCaseResponse = Either<
  null,
  {
    answerComment: AnswerComment[]
  }
>

export class FetchAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComment,
    })
  }
}
