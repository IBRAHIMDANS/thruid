import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";


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
                {
                    id: 'message-id-1',
                    text: 'Hello World 1',
                    author: 'A',
                    publishedAt: new Date('2023-12-26T16:39:00Z')
                },
                {
                    id: 'message-id-2',
                    text: 'Hello World 2',
                    author: 'A',
                    publishedAt: new Date('2023-12-26T16:38:00Z')
                },
                {
                    id: 'message-id-5',
                    text: 'Hello World 5',
                    author: 'A',
                    publishedAt: new Date('2023-12-26T16:40:00Z')
                },
                {
                    id: 'message-id-3',
                    text: 'Hello World, it\'s M',
                    author: 'M',
                    publishedAt: new Date('2023-12-26T16:30:00Z')
                },
                {
                    id: 'message-id-4',
                    text: 'Hello World',
                    author: 'B',
                    publishedAt: new Date('2023-12-26T16:35:00Z')
                }
            ])
            fixture.givenNowIs(new Date('2023-12-26T16:40:00Z'))
            await fixture.whenUserViewsHerTimeline("A")
            fixture.thenASeesTheFollowingMessagesInReverseChronologicalOrder([
                {
                    text: 'Hello World 5',
                    author: 'A',
                    publicationTime: 'less than a minute ago'
                },
                {
                    text: 'Hello World 1',
                    author: 'A',
                    publicationTime: '1 minute ago'
                },
                {
                    text: 'Hello World 2',
                    author: 'A',
                    publicationTime: '2 minutes ago'
                },
            ])
        })
    })

})
