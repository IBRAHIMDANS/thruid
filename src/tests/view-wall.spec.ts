import {createFollowingFixture, FollowingFixture} from "./following.fixture";
import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {MessageRepository} from "../application/message.repository";
import {FolloweeRepository} from "../application/followee.repository";
import {StubDateProvider} from "../infra/stub-date-provider";
import {ViewWallUseCase} from "../application/usecases/view-wall.usecase";
import {messageBuilder} from "./message.builder";

describe("Feature: View Wall", () => {
        let messagingFixture: MessagingFixture;
        let followingFixture: FollowingFixture;
        let fixture: Fixture;
        beforeEach(() => {
            messagingFixture = createMessagingFixture();
            followingFixture = createFollowingFixture();
            fixture = createFixture({
                messageRepository: messagingFixture.messageRepository,
                followeeRepository: followingFixture.followeeRepository,
            });
        });
        describe('Rule : All the messages from the user and her followees should be appear in reverse chronological order', () => {
            test("Scenario 1: C has subscribes to A and B timelines and tgus ca view an aggregated ist of all subscriptions", async () => {
                fixture.givenNowIs(new Date("2023-02-09T15:15:30.000Z"));
                messagingFixture.givenTheFollowingMessagesExist(
                    [
                        messageBuilder()
                            .authorBy("A")
                            .withId("m1")
                            .withText("I love the weather today")
                            .publishedAt(new Date("2023-02-09T15:00:30.000Z"))
                            .build(),
                        messageBuilder()
                            .authorBy("B")
                            .withId("m2")
                            .withText("Damn! We lost!")
                            .publishedAt(new Date("2023-02-09T15:01:00.000Z"))
                            .build(),
                        messageBuilder()
                            .authorBy("A")
                            .withId("m3")
                            .withText("Hey! I'm sick today :(")
                            .publishedAt(new Date("2023-02-09T15:01:00.000Z"))
                            .build(),
                        messageBuilder()
                            .authorBy("C")
                            .withId("m4")
                            .withText("I'm in New York today! Anyone wants to have a coffee?")
                            .publishedAt(new Date("2023-02-09T15:15:00.000Z"))
                            .build(),
                    ]
                );
                followingFixture.givenUserFollowees({
                    user: "C",
                    followees: ["A"],
                });
                await fixture.whenUserSeesTheWallOf("C");

                fixture.thenUserShouldSee([
                    {
                        author: "C",
                        text: "I'm in New York today! Anyone wants to have a coffee?",
                        publicationTime: "less than a minute ago",
                    },
                    {
                        author: "A",
                        text: "Hey! I'm sick today :(",
                        publicationTime: "14 minutes ago",
                    },
                    {
                        author: "A",
                        text: "I love the weather today",
                        publicationTime: "15 minutes ago",
                    }
                ])
            })
        })
    }
)
const createFixture = ({
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
};

type Fixture = ReturnType<typeof createFixture>;
