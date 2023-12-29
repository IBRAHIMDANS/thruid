import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";
import {
    MessageCannotBeEmptyError,
    MessageCannotOnlyBeSpaceError,
    MessageTooLongError
} from "../application/domain/message";

describe('Feature: Edit a message', () => {
    let fixture: MessagingFixture;

    beforeEach(() => {
        fixture = createMessagingFixture();
    })

    describe('Rule: The edited a message', () => {
        test('A can edit her message to a text inferior to 280 characters', async () => {
            // Given A has published a message
            // When A edits her message
            // Then the message is updated

            const aMessageBuilder = messageBuilder()
                .withId('message-id')
                .withText('Hello Wrld')
                .authorBy('A')

            fixture.givenTheFollowingMessagesExist([
                aMessageBuilder.build()
            ])

            await fixture.whenUserEditAMessage({
                id: 'message-id',
                text: 'Hello World',
            })

            await fixture.thenMessageShouldBe(
                aMessageBuilder
                    .withText('Hello World')
                    .build()
            )
        })
        test('A cannot edit her message to a text superior to 280 characters', async () => {
            // Given A has published a message
            // When A edits her message to a text superior to 280 characters
            // Then an error is thrown

            const aMessageBuilder = messageBuilder()
                .withId('message-id')
                .withText('Hello World')
                .authorBy('A')

            fixture.givenTheFollowingMessagesExist([
                aMessageBuilder.build()
            ])

            await fixture.whenUserEditAMessage({
                id: 'message-id',
                text: 'a'.repeat(282),
            })

            fixture.thenAnErrorShouldBe(MessageTooLongError)
        })
        test('A cannot edit her message to an empty text', async () => {
            // Given A has published a message
            // When A edits her message to an empty text
            // Then an error is thrown

            const aMessageBuilder = messageBuilder()
                .withId('message-id')
                .withText('Hello World')
                .authorBy('A')

            fixture.givenTheFollowingMessagesExist([
                aMessageBuilder.build()
            ])

            await fixture.whenUserEditAMessage({
                id: 'message-id',
                text: '',
            })

            fixture.thenAnErrorShouldBe(MessageCannotBeEmptyError)
        })

        test('A cannot edit her message to a text with only spaces', async () => {
            // Given A has published a message
            // When A edits her message to a text with only spaces
            // Then an error is thrown

            const aMessageBuilder = messageBuilder()
                .withId('message-id')
                .withText('Hello World')
                .authorBy('A')

            fixture.givenTheFollowingMessagesExist([
                aMessageBuilder.build()
            ])

            await fixture.whenUserEditAMessage({
                id: 'message-id',
                text: ' '.repeat(100),
            })

            fixture.thenAnErrorShouldBe(MessageCannotOnlyBeSpaceError)
        })
    })
})
