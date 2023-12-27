import {StubDateProvider} from "../stub-date-provider";
import {InMemoryMessageRepository} from "../message.inmemory.usecase";
import {PostMessageCommand, PostMessageUseCase} from "../post-message.usecase";
import {EditMessage, Message, PostMessage} from "../message";
import {ViewTimelineUsecase} from "../view-timeline.usecase";

export const createMessagingFixture = () => {
    const dateProvider = new StubDateProvider()
    const messageRepository = new InMemoryMessageRepository()
    const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
    let thrownError: Error;
    let timeline: Message[] = [];
    const viewTimelineUerCase = new ViewTimelineUsecase(messageRepository, dateProvider)

    return {
        //Given
        givenNowIs(now: Date) {
            dateProvider._now = now
        },
        givenTheFollowingMessagesExist(messages: PostMessage[]) {
            return messageRepository.givenExistingMessages(messages)
        },
        //When
        async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageUseCase.handle(postMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        async whenUserViewsHerTimeline(user: string) {
            timeline = await viewTimelineUerCase.handle({user})
        },
        async whenUserEditAMessage(message: EditMessage) {

        },
        // Then
        thenMessageShouldBe(expectedMessage: Message) {
            return expect(expectedMessage).toEqual(messageRepository.getMessageById(expectedMessage.id))
        },
        thenAnErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError.name).toBe(expectedErrorClass.name);
        },
        thenASeesTheFollowingMessagesInReverseChronologicalOrder(expectedTimeline: Message[]) {
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
