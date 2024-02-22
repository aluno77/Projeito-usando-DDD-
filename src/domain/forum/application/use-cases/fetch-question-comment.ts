import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comment-repository'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string
  page: number
}
type FetchQuestionCommentUseCaseResponse = Either<
  null,
  {
    questionComment: QuestionComment[]
  }
>

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({
      questionComment,
    })
  }
}
