import {
    DateProvider,
    Message,
    MessageCannotBeEmptyError,
    MessageRepository,
    MessageTooLongError,
    PostMessageCommand,
    PostMessageUseCase
} from "../post-message.usecase";


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
        test('A cannot post a message with more than 280 characters', () => {

            const textWith281Characters = 'a'.repeat(282)

            givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            whenUserPostsAMessage({
                id: 'message-id',
                text: textWith281Characters,
                author: 'A'
            })

            thenAnErrorShouldBe(MessageTooLongError);
        })
    })
    describe('A can post empty messages', () => {
        test('A can post an empty message', () => {
            givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            whenUserPostsAMessage({
                id: 'message-id',
                text: '',
                author: 'A'
            })
            thenAnErrorShouldBe(MessageCannotBeEmptyError)
        })
    })
})

let message: Message;
let thrownError: Error;

class InMemoryMessageRepository implements MessageRepository {
    save(_message: Message): void {
        message = _message
    }
}

class StubDateProvider implements DateProvider {
    _now: Date;

    getNow(): Date {
        return this._now
    }
}

const inMemoryMessageRepository = new InMemoryMessageRepository()
const dateProvider = new StubDateProvider()

const postMessageUseCase = new PostMessageUseCase(
    inMemoryMessageRepository,
    dateProvider
)

function givenNowIs(_now: Date) {
    dateProvider._now = _now
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
    try {
        postMessageUseCase.handle(postMessageCommand);
    } catch (err) {
        thrownError = err;
    }
}


function thenPostedMessageShouldBe(expectedMessage: Message) {
    return expect(expectedMessage).toEqual(message)
}

function thenAnErrorShouldBe(expectedErrorClass: new () => Error) {
    expect(thrownError.name).toBe(expectedErrorClass.name);
}

