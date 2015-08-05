/// <reference path="../../typings/moment/moment.d.ts" />

import moment = require('moment');

interface RecurringPeriod {
    getNextSessionStart(now:moment.Moment):moment.Moment;
    isInASession(now:moment.Moment):boolean;
    getCurrentSessionStart(now:moment.Moment):moment.Moment;
    getCurrentSessionEnd(now:moment.Moment):moment.Moment;
    getNextSessionEnd(now:moment.Moment):moment.Moment;
}

export = RecurringPeriod;