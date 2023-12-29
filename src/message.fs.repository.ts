import * as path from 'path';
import {Message, MessageText} from "./message";
import {MessageRepository} from "./message.repository";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {
    constructor(private readonly messagePath = path.join(__dirname, 'message.json')) {
    }


    async save(message: Message) {
        const messages = await this.getMessages();
        const existingMessageIdx = messages.findIndex(msg => msg.id === message.id);
        if (existingMessageIdx !== -1) {
            messages[existingMessageIdx] = message;
        } else {
            messages.push(message);
        }
        return fs.promises.writeFile(this.messagePath, JSON.stringify(
            messages.map(message => ({
                id: message.id,
                text: message.text.value,
                author: message.author,
                publishedAt: message.publishedAt
            }))));
    }

    async getAllOfUser(user: string): Promise<Message[]> {
        const messages = await this.getMessages();
        return messages.filter(message => message.author === user);
    }

    private async getMessages(): Promise<Message[]> {
        try {
            const data = await fs.promises.readFile(this.messagePath, 'utf-8');
            const messages = JSON.parse(data.toString()) as {
                id: string,
                text: string,
                author: string,
                publishedAt: string
            }[];
            return messages.map(message => ({
                id: message.id,
                text: MessageText.of(message.text),
                author: message.author,
                publishedAt: new Date(message.publishedAt)
            }));
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    async getMessageById(id: string): Promise<Message> {
        const messages = await this.getMessages();

        if (!messages.some(message => message.id === id)) {
            return Promise.reject(`Message with id ${id} not found`)
        }
        return Promise.resolve(messages.find(message => message.id === id) as Message)

    }
}
