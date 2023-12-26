import * as path from 'path';
import {Message} from "./message";
import {MessageRepository} from "./message.repository";
import * as fs from "fs";

export class FileSystemMessageRepository implements MessageRepository {

    save(message: Message) {
        let messagePath = path.join(__dirname, 'message.json');
        return fs.promises.writeFile(messagePath, JSON.stringify(message));
    }

    getAllOfUser(user: string): Promise<Message[]> {
        return Promise.resolve([]);
    }
}
