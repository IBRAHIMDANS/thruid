import {Message} from "./message";

export interface MessageRepository {
    save(message: Message): Promise<void>;

    getMessageById(id: string): Promise<Message>;

    getAllOfUser(user: string): Promise<Message[]>;
}
