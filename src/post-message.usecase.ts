import {MessageRepository} from "./message.repository";
import {MessageText, PostMessageCommand} from "./message";

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

        const messageText = MessageText.of(postMessageCommand.text);

        await this.messageRepository.save({
            id: postMessageCommand.id,
            text: messageText,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}

