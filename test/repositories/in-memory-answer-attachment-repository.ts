/* eslint-disable prettier/prettier */
import { AnswerAttachment } from './../../src/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []
  

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }

  // deleteManyByAnswerId = excluir muitos por ID de pergunta

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    this.items = answerAttachments
  }
}
