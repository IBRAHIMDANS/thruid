import {Message} from "./message";
import {MessageRepository} from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
    message: Map<string, Message> = new Map<string, Message>();

    save(_message: Message): Promise<void> {
        this._save(_message);
        return Promise.resolve()
    }

    getMessageById(id: string): Promise<Message> {
        if (!this.message.has(id)) {
            return Promise.reject(`Message with id ${id} not found`)
        }
        return Promise.resolve(this.message.get(id) as Message)
    }

    givenExistingMessages(messages: Message[]) {
        return messages.forEach(this._save.bind(this))
    }

    getAllOfUser(user: string): Promise<Message[]> {
        return Promise.resolve(Array.from(this.message.values()).filter(message => message.author === user));
    }

    private _save(message: Message) {
        this.message.set(message.id, message)
    }
}
