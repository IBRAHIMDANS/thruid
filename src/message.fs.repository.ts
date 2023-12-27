import * as path from 'path';
import {Message} from "./message";
import {MessageRepository} from "./message.repository";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {
    private readonly messagePath = path.join(__dirname, 'message.json');

    async save(message: Message) {
        const messages = await this.getMessages();
        messages.push(message);
        return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
    }

    async getAllOfUser(user: string): Promise<Message[]> {
        const messages = await this.getMessages();
        return messages.filter(message => message.author === user);
    }

    private async getMessages(): Promise<Message[]> {
        try {
            const data = await fs.promises.readFile(this.messagePath, 'utf-8');
            const messages = JSON.parse(data.toString()) as Message[];
            return messages.map(message => ({
                id: message.id,
                text: message.text,
                author: message.author,
                publishedAt: new Date(message.publishedAt)
            }));
        } catch (e) {
            console.error(e)
            return [];
        }
    }
}
