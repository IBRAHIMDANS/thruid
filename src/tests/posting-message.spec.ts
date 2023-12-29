import {MessageCannotBeEmptyError, MessageCannotOnlyBeSpaceError, MessageText, MessageTooLongError} from "../message";
import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";


describe('Feature: Posting a message', () => {
    let fixture: MessagingFixture;
    beforeEach(() => {
        fixture = createMessagingFixture()
    })
    describe('Rule: A Message can contain a maximum of 280 characters', () => {
        test("A can post a message on her timeline", async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            fixture.givenNowIs(now)

            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A',
            })

            await fixture.thenMessageShouldBe({
                id: 'message-id',
                text: MessageText.of('Hello, world!'),
                author: 'A',
                publishedAt: now,
            })

        })
    })
    describe('Rule: A cannot post  Message exceding a maximum of 280 characteres', () => {
        test('A cannot post a message with more than 280 characters', async () => {

            const now = new Date("2023-12-26T16:28:00Z")


            fixture.givenNowIs(now)
            await fixture.whenUserPostsAMessage({
                author: 'A',
                id: 'message-id',
                text: 'a'.repeat(282),
            })

            fixture.thenAnErrorShouldBe(MessageTooLongError);

        })
    })
    describe('Rule: A cannot post empty Message', () => {
        test('A can post an empty message', async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            fixture.givenNowIs(now)

            await fixture.whenUserPostsAMessage(
                {
                    author: 'A',
                    id: 'message-id',
                    text: '',
                })

            fixture.thenAnErrorShouldBe(MessageCannotBeEmptyError)

        })
    })
    describe('Rule: A cannot post Message with only space ', () => {
        test('Rule: A cannot post a message with only spaces', async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            fixture.givenNowIs(now)

            const aMessageBuilderWithTextOnlySpaces = messageBuilder().withText(' '.repeat(100)).authorBy('A')

            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: ' '.repeat(100),
                author: 'A',
            })

            fixture.thenAnErrorShouldBe(MessageCannotOnlyBeSpaceError)

        })
    })
})
