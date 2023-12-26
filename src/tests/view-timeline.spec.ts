import {Message} from "../message";
import {InMemoryMessageRepository} from "../message.inmemory.usecase";
import {ViewTimelineUsecase} from "../view-timeline.usecase";
import {StubDateProvider} from "../stub-date-provider";


describe('Feature: View Timeline', () => {
    let fixture: Fixture;

    beforeEach(() => {
        fixture = createFixture();
    })

    describe('Rule: Messages are shown in reverse chronological order', () => {
        test('A can view the 2 messages she published in her timeline', async () => {
            // Given A has published 2 messages
            // When A views her timeline
            // Then A sees the 2 messages in reverse chronological order

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
            await fixture.whenAViewsHerTimeline("A")
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

const createFixture = () => {
    let timeline: Message[] = [];
    const messageRepository = new InMemoryMessageRepository();
    const dateProvider = new StubDateProvider();
    const viewTimelineUerCase = new ViewTimelineUsecase(messageRepository, dateProvider)
    return {
        givenTheFollowingMessagesExist(messages: Message[]) {
            return messageRepository.givenExistingMessages(messages)
        },
        givenNowIs(now: Date) {
            dateProvider._now = now;
        },
        async whenAViewsHerTimeline(user: string) {
            timeline = await viewTimelineUerCase.handle({user})
        },
        thenASeesTheFollowingMessagesInReverseChronologicalOrder(expectedTimeline: Message[]) {
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}
type Fixture = ReturnType<typeof createFixture>;
