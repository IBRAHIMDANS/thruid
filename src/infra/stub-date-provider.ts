import {DateProvider} from "../application/date-provider";

export class StubDateProvider implements DateProvider {
    _now: Date;

    getNow(): Date {
        return this._now
    }
}
