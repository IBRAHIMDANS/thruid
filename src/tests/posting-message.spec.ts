import {MessageCannotBeEmptyError, MessageCannotOnlyBeSpaceError, MessageTooLongError} from "../post-message.usecase";
import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";


describe('Feature: Posting a message', () => {
    let fixture: MessagingFixture;
    beforeEach(() => {
        fixture = createMessagingFixture()
    })
    describe('Rule: A Message can contain a maximum of 280 characters', () => {
        test("A can post a message on her timeline", async () => {
            fixture.givenNowIs(new Date("2023-12-26T16:28:00Z"))
            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A'
            })
            fixture.thenMessageShouldBe({
                id: 'message-id',
                text: 'Hello, world!',
                author: 'A',
                publishedAt: new Date('2023-12-26T16:28:00Z')
            })
        })
    })
    describe('Rule: A cannot post  Message exceding a maximum of 280 characteres', () => {
        test('A cannot post a message with more than 280 characters', async () => {

            const textWith281Characters = 'a'.repeat(282)

            fixture.givenNowIs(new Date("2023-12-26T16:28:00Z"))
            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: textWith281Characters,
                author: 'A'
            })

            fixture.thenAnErrorShouldBe(MessageTooLongError);
        })
    })
    describe('Rule: A cannot post empty Message', () => {
        test('A can post an empty message', async () => {
            fixture.givenNowIs(new Date("2023-12-26T16:28:00Z"))
            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: '',
                author: 'A'
            })
            fixture.thenAnErrorShouldBe(MessageCannotBeEmptyError)
        })
    })
    describe('Rule: A cannot post Message with only space ', () => {
        test('Rule: A cannot post a message with only spaces', async () => {
            fixture.givenNowIs(new Date("2023-12-26T16:28:00Z"))
            await fixture.whenUserPostsAMessage({
                id: 'message-id',
                text: '         ',
                author: 'A'
            })
            fixture.thenAnErrorShouldBe(MessageCannotOnlyBeSpaceError)
        })
    })
})
