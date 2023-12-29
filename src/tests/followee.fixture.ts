import {InMemoryFolloweeRepository} from "../infra/followee.inmemory.usecase";
import {FollowUserCommand, FollowUserUseCase} from "../application/usecases/follow-user.usecase";

export const createFolloweeFixture = () => {
    const followeeRepository = new InMemoryFolloweeRepository();
    const followUserUseCase = new FollowUserUseCase(followeeRepository);

    return {
        // Given
        givenUserFollowees(
            {followees, user}: { user: string; followees: string[]; }
        ) {
            followeeRepository.givenExistingFollowees(
                followees.map((followee) => ({
                    user,
                    followee,
                }))
            );
        },

        // When
        async whenUserFollows(followUserCommand: FollowUserCommand) {
            await followUserUseCase.handle(followUserCommand);
        },

        // Then
        async thenUserFolloweesAre(userFollowees: {
            user: string;
            followees: string[];
        }) {
            const actualFollowees = followeeRepository.getFolloweesOf(
                userFollowees.user
            );
            expect(actualFollowees).toEqual(userFollowees.followees);

        }

    }
}

export type FolloweeFixture = ReturnType<typeof createFolloweeFixture>;
