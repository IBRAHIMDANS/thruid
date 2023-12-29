import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";


describe('Feature: View Timeline', () => {
    let fixture: MessagingFixture;

    beforeEach(() => {
        fixture = createMessagingFixture();
    })

    describe('Rule: Messages are shown in reverse chronological order', () => {
        test('A can view the 3 messages she published in her timeline', async () => {
            // Given A has published 3 messages
            // When A views her timeline
            // Then A sees the 3 messages in reverse chronological order

            fixture.givenTheFollowingMessagesExist([
                messageBuilder().authorBy("M").withId('message-id-0').withText('Hello World 0').publishedAt(new Date('2023-12-26T16:30:00Z')).build(),
                messageBuilder().authorBy("A").withId('message-id-1').withText('Hello World 1').publishedAt(new Date('2023-12-26T16:38:00Z')).build(),
                messageBuilder().authorBy("A").withId('message-id-2').withText('Hello World 2').publishedAt(new Date('2023-12-26T16:39:00Z')).build(),
                messageBuilder().authorBy("B").withId('message-id-3').withText('Hello World 3').publishedAt(new Date('2023-12-26T16:40:30Z')).build(),
                messageBuilder().authorBy("A").withId('message-id-4').withText('Hello World 4').publishedAt(new Date('2023-12-26T16:40:00Z')).build(),
                messageBuilder().authorBy("B").withId('message-id-5').withText('Hello World 5').publishedAt(new Date('2023-12-26T16:45:00Z')).build(),
            ])
            fixture.givenNowIs(new Date('2023-12-26T16:40:00Z'))
            await fixture.whenUserViewsHerTimeline("A")
            fixture.thenASeesTheFollowingMessagesInReverseChronologicalOrder([
                {
                    text: 'Hello World 4',
                    author: 'A',
                    publicationTime: 'less than a minute ago'
                },
                {
                    text: 'Hello World 2',
                    author: 'A',
                    publicationTime: '1 minute ago'
                },
                {
                    text: 'Hello World 1',
                    author: 'A',
                    publicationTime: '2 minutes ago'
                },
            ])
        })
    })

})
