import {MessageRepository} from "../message.repository";
import {DateProvider} from "../date-provider";

const ONE_MINUTE_IN_MILLISECONDS = 1000 * 60;

export class ViewTimelineUsecase {
    constructor(
        private messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
    ) {
    }

    async handle(user: string): Promise<{
        author: string;
        text: string;
        publicationTime: string;
    }[]> {
        const messagesOfUser = await this.messageRepository.getAllOfUser(user)
        messagesOfUser.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

        return messagesOfUser.map(message => ({
            text: message.text,
            author: message.author,
            publicationTime: this.publicationTime(message.publishedAt)
        }))
    }

    publicationTime(publishedAt: Date) {
        const now = this.dateProvider.getNow()
        const diffInMilliseconds = now.getTime() - publishedAt.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / ONE_MINUTE_IN_MILLISECONDS);

        if (diffInMinutes < 1) {
            return 'less than a minute ago';
        } else {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }
    }
}