import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import {
   SendNotificationUseCase,
   SendNotificationUseCaseRequest,
   SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { makeQuestion } from 'test/repositories/factories/make-question'
import { makeAnswer } from 'test/repositories/factories/make-answer'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

describe('On Question Best Answer Chosen', () => {
   beforeEach(() => {
      inMemoryQuestionAttachmentsRepository =
         new InMemoryQuestionAttachmentsRepository()
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
         inMemoryQuestionAttachmentsRepository,
      )
      inMemoryAnswerAttachmentsRepository =
         new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository = new InMemoryAnswersRepository(
         inMemoryAnswerAttachmentsRepository,
      )
      inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
      sendNotificationUseCase = new SendNotificationUseCase(
         inMemoryNotificationsRepository,
      )

      // Muda de SpyInstance para Mock
      sendNotificationUseCase.execute = vi.fn()

      new OnQuestionBestAnswerChosen(
         inMemoryAnswersRepository,
         sendNotificationUseCase,
      )
   })

   it('should send a notification when topic has new best answer chosen', async () => {
      const question = makeQuestion()
      const answer = makeAnswer({ questionId: question.id })

      inMemoryQuestionsRepository.create(question)
      inMemoryAnswersRepository.create(answer)

      question.bestAnswerId = answer.id

      inMemoryQuestionsRepository.save(question)

      await waitFor(() => {
         expect(sendNotificationUseCase.execute).toHaveBeenCalled()
      })
   })
})
