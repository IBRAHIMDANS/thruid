import {createFolloweeFixture, FolloweeFixture} from "./followee.fixture";

describe("Feature: Following User", () => {

    let fixture: FolloweeFixture;

    beforeEach(() => {
        fixture = createFolloweeFixture()
    })
    test("Scenario: A can follow B another user", async () => {
        // Given A is logged in
        // And B is a user
        // When A follows B
        // Then A is following B

        fixture.givenUserFollowees({
            user: "A",
            followees: ["C"]
        })

        await fixture.whenUserFollows({
            user: "A",
            userToFollow: "B"
        })

        fixture.thenUserFolloweesAre({
            user: "A",
            followees: ["C", "B"]
        })
    })

})
