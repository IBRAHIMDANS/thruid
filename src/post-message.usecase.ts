import {MessageRepository} from "./message.repository";
import {Message, MessageCannotBeEmptyError, MessageCannotOnlyBeSpaceError, MessageTooLongError} from "./message";


export type PostMessageCommand = Omit<Message, 'publishedAt'>;


export interface DateProvider {
    getNow(): Date;
}


export class PostMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider,
    ) {
    }

    async handle(postMessageCommand: PostMessageCommand): Promise<void> {

        if (postMessageCommand.text.length === 0) {
            throw new MessageCannotBeEmptyError();
        }
        if (postMessageCommand.text.trim().length === 0) {
            throw new MessageCannotOnlyBeSpaceError();
        }
        if (postMessageCommand.text.length > 280) {
            throw new MessageTooLongError();
        }

        await this.messageRepository.save({
            id: postMessageCommand.id,
            text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}

