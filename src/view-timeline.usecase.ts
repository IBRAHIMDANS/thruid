import {MessageRepository} from "./message.repository";
import {Message} from "./message";


export class ViewTimelineUsecase {
    constructor(private messageRepository: MessageRepository) {
    }

    async handle({user}: { user: string }): Promise<Message[]> {
        const messagesOfUser = await this.messageRepository.getAllOfUser(user)
        return [
            {
                text: messagesOfUser[1].text,
                author: messagesOfUser[1].author,
                publicationTime: '1 minutes ago'
            },
            {
                text: messagesOfUser[0].text,
                author: messagesOfUser[0].author,
                publicationTime: "2 minutes ago"
            }
        ]
    }

}
