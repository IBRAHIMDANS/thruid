import {MessageCannotBeEmptyError, MessageCannotOnlyBeSpaceError, MessageTooLongError} from "../post-message.usecase";
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

            const aMessageBuilder = messageBuilder().withText('Hello, world!')
            await fixture.whenUserPostsAMessage(aMessageBuilder.build())

            await fixture.thenMessageShouldBe(aMessageBuilder.publishedAt(now).build())

        })
    })
    describe('Rule: A cannot post  Message exceding a maximum of 280 characteres', () => {
        test('A cannot post a message with more than 280 characters', async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            const aMessageBuilder = messageBuilder().withText('a'.repeat(282)).authorBy('A')

            fixture.givenNowIs(now)
            await fixture.whenUserPostsAMessage(aMessageBuilder.build())

            fixture.thenAnErrorShouldBe(MessageTooLongError);

        })
    })
    describe('Rule: A cannot post empty Message', () => {
        test('A can post an empty message', async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            fixture.givenNowIs(now)

            const aMessageBuilderWithEmptyMessage = messageBuilder().withId('message-id').withText('').authorBy('A')

            await fixture.whenUserPostsAMessage(aMessageBuilderWithEmptyMessage.build())

            fixture.thenAnErrorShouldBe(MessageCannotBeEmptyError)

        })
    })
    describe('Rule: A cannot post Message with only space ', () => {
        test('Rule: A cannot post a message with only spaces', async () => {

            const now = new Date("2023-12-26T16:28:00Z")

            fixture.givenNowIs(now)

            const aMessageBuilderWithTextOnlySpaces = messageBuilder().withText(' '.repeat(100)).authorBy('A')

            await fixture.whenUserPostsAMessage(aMessageBuilderWithTextOnlySpaces.build())

            fixture.thenAnErrorShouldBe(MessageCannotOnlyBeSpaceError)

        })
    })
})
