import {StubDateProvider} from "../stub-date-provider";

import {InMemoryMessageRepository} from "../message.inmemory.usecase";
import {PostMessageUseCase} from "../post-message.usecase";
import {ViewTimelineUsecase} from "../view-timeline.usecase";
import {EditMessageUseCase} from "../edit-message.usecase";

import {EditMessageCommand, Message, PostMessageCommand} from "../message";


export const createMessagingFixture = () => {
    let thrownError: Error;
    let timeline: {
        author: string;
        text: string;
        publicationTime: string;
    }[] = [];

    const dateProvider = new StubDateProvider()

    const messageRepository = new InMemoryMessageRepository()


    // USE CASES
    const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
    const viewTimelineUerCase = new ViewTimelineUsecase(messageRepository, dateProvider)
    const editMessageUseCase = new EditMessageUseCase(messageRepository)

    return {
        //Given
        givenNowIs(now: Date) {
            dateProvider._now = now
        },
        givenTheFollowingMessagesExist(messages: Message[]) {
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
            timeline = await viewTimelineUerCase.handle(user)
        },
        async whenUserEditAMessage(editMessageCommand: EditMessageCommand) {

            try {
                await editMessageUseCase.handle(editMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        // Then
        async thenMessageShouldBe(expectedMessage: Message) {
            const message = await messageRepository.getMessageById(expectedMessage.id)
            return expect(expectedMessage).toEqual(message)
        },
        thenAnErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError.name).toBe(expectedErrorClass.name);
        },
        thenASeesTheFollowingMessagesInReverseChronologicalOrder(expectedTimeline: {
            author: string;
            text: string;
            publicationTime: string;
        }[]) {
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
