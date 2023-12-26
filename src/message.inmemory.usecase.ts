import {Message, MessageRepository} from "./post-message.usecase";

export class InMemoryMessageRepository implements MessageRepository {
    message: Message;

    save(_message: Message): void {
        this.message = _message
    }
}
