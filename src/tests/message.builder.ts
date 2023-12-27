import {Message} from "../message";

export const messageBuilder = (
    {
        id = 'message-id',
        author = 'A',
        text = 'Hello World',
        publishedAt = new Date('2023-12-26T16:39:00Z'),
        publicationTime = 'less than a minute ago'
    } = {} as Message
) => {
    const message = {
        id,
        author,
        text,
        publishedAt,
        publicationTime
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
        publicationTime(publicationTime: string) {
            return messageBuilder({...message, publicationTime})
        },
        build(): Message {
            return {
                id: message.id,
                text: message.text,
                author: message.author,
                publishedAt: message.publishedAt,
                publicationTime: message.publicationTime
            }
        }
    }
}
