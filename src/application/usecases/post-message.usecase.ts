import {Message, PostMessageCommand} from "../domain/message";
import {MessageRepository} from "../message.repository";
import {DateProvider} from "../date-provider";


export class PostMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider,
    ) {
    }

    async handle(postMessageCommand: PostMessageCommand): Promise<void> {

        await this.messageRepository.save(Message.fromData({
            id: postMessageCommand.id,
                text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
        )
    }
}

