/* eslint-disable prettier/prettier */
import { QuestionAttachment } from './../../src/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

// deleteManyByQuestionId = excluir muitos por ID de pergunta

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
