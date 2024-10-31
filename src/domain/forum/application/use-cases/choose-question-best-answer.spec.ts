import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { makeQuestion } from 'test/repositories/factories/make-question'
import { makeAnswer } from 'test/repositories/factories/make-answer'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
   beforeEach(() => {
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
      inMemoryAnswersRepository = new InMemoryAnswersRepository()

      sut = new ChooseQuestionBestAnswerUseCase(
         inMemoryQuestionsRepository,
         inMemoryAnswersRepository,
      )
   })

   it('should be able to choose the question best answer', async () => {
      const question = makeQuestion()

      const answer = makeAnswer({
         questionId: question.id,
      })

      await inMemoryQuestionsRepository.create(question)
      await inMemoryAnswersRepository.create(answer)

      await sut.execute({
         answerId: answer.id.toString(),
         authorId: question.authorId.toString(),
      })

      expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
   })

   it('should not be able to to choose another user question best answer', async () => {
      const question = makeQuestion({
         authorId: new UniqueEntityID('author-1'),
      })

      const answer = makeAnswer({
         questionId: question.id,
      })

      await inMemoryQuestionsRepository.create(question)
      await inMemoryAnswersRepository.create(answer)

      const result = await sut.execute({
         answerId: answer.id.toString(),
         authorId: 'author-2',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
   })
})