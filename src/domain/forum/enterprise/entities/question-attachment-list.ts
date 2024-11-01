
import { QuestionAttachment } from './question-attachment'
import { WatchedList } from './watched-list'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
   compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
      return a.attachmentId === b.attachmentId
   }
}