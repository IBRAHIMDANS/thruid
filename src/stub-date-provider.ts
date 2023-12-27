import {DateProvider} from "./post-message.usecase";

export class StubDateProvider implements DateProvider {
    _now: Date;

    getNow(): Date {
        return this._now
    }
}
