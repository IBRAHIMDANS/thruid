export type Message = {
    id?: string;
    text: string;
    author: string;
    publicationTime?: string;
    publishedAt?: Date;
}

export type PostMessage = Omit<Message, 'id' | 'author' | 'publicationTime' | 'publishedAt'> & {
    id?: string;
    author?: string;
    publicationTime?: string;
    publishedAt?: Date;
};

export type EditMessage = Omit<Message, 'author'> & {
    author?: string;
};
