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

export class Message {
    constructor(
        private readonly _id: string,
        private _text: MessageText,
        private readonly _author: string,
        private readonly _publishedAt: Date
    ) {
    }

    get id(): string {
        return this._id;
    }

    get author(): string {
        return this._author;
    }

    get publishedAt(): Date {
        return this._publishedAt;
    }

    get text() {
        return this._text.value;
    }

    get data() {
        return {
            id: this.id,
            text: this.text,
            author: this.author,
            publishedAt: this.publishedAt,
        }
    }

    static fromData(data: Message['data']) {
        return new Message(
            data.id,
            MessageText.of(data.text),
            data.author,
            data.publishedAt
        )
    }

    editText(text: string) {
        this._text = MessageText.of(text)
    }
}


export type EditMessageCommand = {
    id: string,
    text: string
};

export type PostMessageCommand = {
    id: string;
    text: string;
    author: string;
};
