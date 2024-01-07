import {createFollowingFixture, FollowingFixture} from "./following.fixture";
import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";
import {createViewWallFixture, ViewWallFixture} from "./view-wall.fixture";

describe("Feature: View Wall", () => {
        let messagingFixture: MessagingFixture;
        let followingFixture: FollowingFixture;
        let viewWallFixture: ViewWallFixture;

        beforeEach(() => {
            messagingFixture = createMessagingFixture();
            followingFixture = createFollowingFixture();
            viewWallFixture = createViewWallFixture({
                messageRepository: messagingFixture.messageRepository,
                followeeRepository: followingFixture.followeeRepository,
            });
        });

        describe('Rule : All the messages from the user and her followees should be appear in reverse chronological order', () => {
            test("Scenario 1: C has subscribes to A and B timelines and tgus ca view an aggregated ist of all subscriptions", async () => {
                viewWallFixture.givenNowIs(new Date("2023-02-09T15:15:30.000Z"));
                messagingFixture.givenTheFollowingMessagesExist(
                    [
                        messageBuilder()
                            .authorBy("A")
                            .withId("m1")
                            .withText("Hello world ")
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
                await viewWallFixture.whenUserSeesTheWallOf("C");

                viewWallFixture.thenUserShouldSee([
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
                        text: "Hello world ",
                        publicationTime: "15 minutes ago",
                    }
                ])
            })
        })

    }
)
