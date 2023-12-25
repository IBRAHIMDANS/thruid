import {DateProvider, Message, MessageRepository, PostMessageUseCase} from "../post-message.usecase";
import {PostMessageCommand} from "../post-message.usecase";

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

let message: Message = {
    id: 'message-id',
    text: 'Hello, world!',
    author: 'A',
    publishedAt: new Date("2023-12-25T12:00:00.000Z")
}

let now: Date;

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
    postMessageUseCase.handle(postMessageCommand)
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
    return expect(expectedMessage).toEqual(message)
}
