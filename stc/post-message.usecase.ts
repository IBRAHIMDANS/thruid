export type Message = {
    id: string;
    text: string;
    author: string;
    publishedAt: Date;
}

export type PostMessageCommand = Omit<Message, 'publishedAt'>;

export interface  MessageRepository {
    save(message: Message): void;
}
export interface DateProvider {
    getNow(): Date;
}
export class PostMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider,
    ) {
    }

    handle(postMessageCommand: PostMessageCommand): void {
        this.messageRepository.save({
            id: postMessageCommand.id,
            text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}
