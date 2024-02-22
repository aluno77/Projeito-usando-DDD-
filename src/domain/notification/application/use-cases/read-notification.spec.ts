import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationRepository

let sut: ReadNotificationUseCase

describe('Read Notification', async () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to Read notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should be able to red a notification from another answer', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
