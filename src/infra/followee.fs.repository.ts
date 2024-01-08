import * as path from 'path';

import {Followee, FolloweeRepository} from "../application/followee.repository";

export class FolloweeFsRepository implements FolloweeRepository {
    constructor(private readonly followeePath = path.join(__dirname, 'followee.json')) {
    }

    saveFollowee(followee: Followee): Promise<void> {
        throw new Error('Method not implemented.');
    }


    async getFolloweesOf(user: string): Promise<string[]> {
        return [];
    }

    private addFollowee(followee: Followee) {
        // const existingFollowees = this.followeesByUser.get(followee.user) ?? [];
        // existingFollowees.push(followee.followee);
        // this.followeesByUser.set(followee.user, existingFollowees);
    }

}
