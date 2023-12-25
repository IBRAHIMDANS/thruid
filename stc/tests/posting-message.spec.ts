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

function givenNowIs(date: Date) {
    // ...
}

function whenUserPostsAMessage(postMessageCommand: { id: string; text: string; author: string; }) {
    // ...
}

function thenPostedMessageShouldBe(expectedMessage: { id: string; text: string; author: string; publishedAt: Date; }) {
    return expect(true).toBe(false)
}
