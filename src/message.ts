export class MessageTooLongError extends Error {
    constructor(message = 'Message too long') {
        super(message);
        this.name = 'MessageTooLongError';
    }
}

export class MessageCannotOnlyBeSpaceError extends Error {
    constructor(message = 'Message cannot only be space') {
        super(message);
        this.name = 'MessageCannotOnlyBeSpaceError';
    }
}

export class MessageCannotBeEmptyError extends Error {
    constructor(message = 'Message cannot be empty') {
        super(message);
        this.name = 'MessageCannotBeEmptyError';
    }
}

export class MessageText {
    private constructor(readonly value: string) {
    }

    static of(text: string) {
        if (text.length === 0) {
            throw new MessageCannotBeEmptyError();
        }
        if (text.trim().length === 0) {
            throw new MessageCannotOnlyBeSpaceError();
        }
        if (text.length > 280) {
            throw new MessageTooLongError();
        }

        return new MessageText(text);
    }
}

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

export type EditMessageCommand = {
    id: string,
    text: string
};

export type PostMessageCommand = {
    id?: string,
    text: string;
    author: string;
};
