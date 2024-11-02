
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { OnAnswerCreated } from './on-answer-created'
import { makeAnswer } from 'test/repositories/factories/make-answer'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('On Answer Created', () => {
   beforeEach(() => {
      inMemoryAnswerAttachmentsRepository =
         new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository = new InMemoryAnswersRepository(
         inMemoryAnswerAttachmentsRepository,
      )
   })

   it('should  send a notification when an answer is created', async () => {
      const _onAnswerCreated = new OnAnswerCreated()

      const answer = makeAnswer()

      inMemoryAnswersRepository.create(answer)
   })
})