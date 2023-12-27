import {Message} from "../message";

export const messageBuilder = () => ({
    buildMessage: (message: Partial<Message>): Message => ({
        id: message.id || 'message-id',
        text: message.text || 'Hello World',
        author: message.author || 'A',
        publishedAt: message.publishedAt || new Date('2023-12-26T16:39:00Z'),
        publicationTime: message.publicationTime || '1 minute ago'
    })
})
