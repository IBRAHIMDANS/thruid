import {
    DateProvider,
    Message,
    MessageCannotBeEmptyError,
    MessageCannotOnlyBeSpaceError,
    MessageRepository,
    MessageTooLongError,
    PostMessageCommand,
    PostMessageUseCase
} from "../post-message.usecase";


describe('Feature: Posting a message', () => {
    let fixture: Fixture;
    beforeEach(() => {
        fixture = createFixture()
    })
    describe('Rule: A Message can contain a maximum of 280 characters', () => {
        test("A can post a message on her timeline", () => {
            fixture.givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A'
            })
            fixture.thenPostedMessageShouldBe({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A',
                publishedAt: new Date("2023-12-25T12:00:00.000Z")
            })
        })
    })
    describe('Rule: A cannot post  Message exceding a maximum of 280 characteres', () => {
        test('A cannot post a message with more than 280 characters', () => {

            const textWith281Characters = 'a'.repeat(282)

            fixture.givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: textWith281Characters,
                author: 'A'
            })

            fixture.thenAnErrorShouldBe(MessageTooLongError);
        })
    })
    describe('Rule: A cannot post empty Message', () => {
        test('A can post an empty message', () => {
            fixture.givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: '',
                author: 'A'
            })
            fixture.thenAnErrorShouldBe(MessageCannotBeEmptyError)
        })
    })
    describe('Rule: A cannot post Message with only space ', () => {
        test('Rule: A cannot post a message with only spaces', () => {
            fixture.givenNowIs(new Date("2023-12-25T12:00:00.000Z"))
            fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: '         ',
                author: 'A'
            })
            fixture.thenAnErrorShouldBe(MessageCannotOnlyBeSpaceError)
        })
    })
})


class InMemoryMessageRepository implements MessageRepository {
    message: Message;

    save(_message: Message): void {
        this.message = _message
    }
}

class StubDateProvider implements DateProvider {
    _now: Date;

    getNow(): Date {
        return this._now
    }
}


const createFixture = () => {
    const dateProvider = new StubDateProvider()
    const messageRepository = new InMemoryMessageRepository()
    const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
    let thrownError: Error;
    return {
        givenNowIs: (now: Date) => {
            dateProvider._now = now
        },
        whenUserPostsAMessage: (postMessageCommand: PostMessageCommand) => {
            try {
                postMessageUseCase.handle(postMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        thenPostedMessageShouldBe(expectedMessage: Message) {
            return expect(expectedMessage).toEqual(messageRepository.message)
        },
        thenAnErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError.name).toBe(expectedErrorClass.name);
        }
    }
}
type Fixture = ReturnType<typeof createFixture>
