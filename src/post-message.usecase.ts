import {MessageRepository} from "./message.repository";
import {
    MessageCannotBeEmptyError,
    MessageCannotOnlyBeSpaceError,
    MessageText,
    MessageTooLongError,
    PostMessageCommand
} from "./message";


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
        const messageText = MessageText.of(postMessageCommand.text);

        await this.messageRepository.save({
            id: postMessageCommand.id,
            text: messageText,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}

