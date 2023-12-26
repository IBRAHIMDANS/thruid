import {Message} from "./message";
import {MessageRepository} from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
    message: Map<string, Message> = new Map<string, Message>();

    save(_message: Message): Promise<void> {
        this._save(_message);
        return Promise.resolve()
    }

    getMessageById(id: string) {
        return this.message.get(id)!
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
