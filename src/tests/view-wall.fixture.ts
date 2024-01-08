import {MessageRepository} from "../application/message.repository";
import {FolloweeRepository} from "../application/followee.repository";
import {StubDateProvider} from "../infra/stub-date-provider";
import {ViewWallUseCase} from "../application/usecases/view-wall.usecase";

export const createViewWallFixture = ({
                                          messageRepository,
                                          followeeRepository,
                                      }: {
    messageRepository: MessageRepository;
    followeeRepository: FolloweeRepository;
}) => {
    let wall: { author: string; text: string; publicationTime: string }[];
    const dateProvider = new StubDateProvider();
    const viewWallUseCase = new ViewWallUseCase(
        messageRepository,
        followeeRepository,
        dateProvider
    );
    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserSeesTheWallOf(user: string) {
            wall = await viewWallUseCase.handle({user});
        },
        thenUserShouldSee(
            expectedWall: { author: string; text: string; publicationTime: string }[]
        ) {
            expect(wall).toEqual(expectedWall);
        },
    };
}

export type ViewWallFixture = ReturnType<typeof createViewWallFixture>;
