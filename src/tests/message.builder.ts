import {Message, MessageText} from "../message";

export const messageBuilder = (
    {
        id = 'message-id',
        author = 'A',
        text = 'Hello World',
        publishedAt = new Date('2023-12-26T16:39:00Z'),
    }: {
        id?: string;
        author?: string;
        text?: string;
        publishedAt?: Date;
    } = {}
) => {
    const message = {
        id,
        author,
        text,
        publishedAt
    };

    return {
        withId(id: string) {
            return messageBuilder({...message, id})
        },
        withText(text: string) {
            return messageBuilder({...message, text})
        },
        authorBy(author: string) {
            return messageBuilder({...message, author})
        },
        publishedAt(publishedAt: Date) {
            return messageBuilder({...message, publishedAt})
        },
        build(): Message {
            return {
                id: message.id,
                text: MessageText.of(message.text),
                author: message.author,
                publishedAt: message.publishedAt
            }
        }
    }
}
