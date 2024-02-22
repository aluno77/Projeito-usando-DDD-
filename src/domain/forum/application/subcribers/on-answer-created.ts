import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/domain-handler'
import { AnswerCreatedEvent } from '../../enterprise/events/answer-created-event'
import { QuestionsRepository } from '../repositories/question-repository'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  // sendNewAnswerNotification = enviar Nova Resposta Notificação
  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )
    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
