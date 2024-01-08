import {createFollowingFixture, FollowingFixture} from "./following.fixture";

describe("Feature: Following User", () => {

    let fixture: FollowingFixture;

    beforeEach(() => {
        fixture = createFollowingFixture()
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
