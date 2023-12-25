describe('Feature: Posting a message', () => {
    describe('Rule: A Message can contain a maximum of 280 characters', () => {
        test("A can post a message on her timeline", () => {
            givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            whenUserPostsAMessage({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A'
            })
            thenPostedMessageShouldBe({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A',
                publishedAt: new Date("2023-12-25T12:00:00.000Z")
            })
        })
    })
})
let message: { id: string; text: string; author: string; publishedAt: Date; } = {
    id: 'message-id',
    text: 'Hello, world!',
    author: 'A',
    publishedAt: new Date("2023-12-25T12:00:00.000Z")
}
let now: Date;

function givenNowIs(_now: Date) {
    now = _now
}

function whenUserPostsAMessage(postMessageCommand: { id: string; text: string; author: string; }) {
    message = {
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: now
    }
}

function thenPostedMessageShouldBe(expectedMessage: { id: string; text: string; author: string; publishedAt: Date; }) {
    return expect(expectedMessage).toEqual(message)
}
