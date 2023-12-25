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

export class MessageTooLongError extends Error {
    constructor(message = 'Message too long') {
        super(message);
        this.name = 'MessageTooLongError';
    }
}

export class MessageCannotBeEmptyError extends Error {
    constructor(message = 'Message cannot be empty') {
        super(message);
        this.name = 'MessageCannotBeEmptyError';
    }
}

export class PostMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider,
    ) {
    }

    handle(postMessageCommand: PostMessageCommand): void {

        if (postMessageCommand.text.length === 0) {
            throw new MessageCannotBeEmptyError();
        }

        if (postMessageCommand.text.length > 280) {
            throw new MessageTooLongError();
        }

        this.messageRepository.save({
            id: postMessageCommand.id,
            text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}
