import {Message} from "./message";

const ONE_MINUTE_IN_MS: number = 60_000;

export class Timeline {
    constructor(
        private readonly messages: Message[],
        private readonly now: Date,
    ) {
    }

    get data() {
        this.messages.sort((msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime());

        return this.messages.map((msg) => ({
            author: msg.author,
            text: msg.text,
            publicationTime: this.publicationTime(msg.publishedAt),
        }));
    }

    private publicationTime(publishedAt: Date) {
        const diffInMilliseconds = this.now.getTime() - publishedAt.getTime();
        const minutes = Math.floor(diffInMilliseconds / ONE_MINUTE_IN_MS);

        if (minutes < 1) {
            return 'less than a minute ago';
        } else {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
    }
}
