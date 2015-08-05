/// <reference path="../../typings/moment/moment.d.ts" />

import moment = require('moment');
import RecurringPeriod = require('./RecurringPeriod');

class RecurringWeek implements RecurringPeriod {

    getNextSessionStart(now:moment.Moment):moment.Moment {
        //  return next monday
        return now.day(8).hours(0).minute(0).second(0).millisecond(0);
    }

    isInASession(now:moment.Moment) {
        return now.day() >= 1 && now.day() <= 5;
    }

    getCurrentSessionStart(now:moment.Moment):moment.Moment {
        //  Check if current time is in a session or not
        //  if not, return next monday
        //  ex : if now.day = saturday, currentSessionStart
        //  will be next monday
        if (!this.isInASession(now)) {
            return this.getNextSessionStart(now);
        }

        //  return previous monday
        return now.day(1).clone().hours(0).minute(0).second(0).millisecond(0);
    }

    getCurrentSessionEnd(now:moment.Moment):moment.Moment {
        if (!this.isInASession(now)) {
            return this.getNextSessionEnd(now);
        }

        return now.day(5).hour(23).minute(59).second(59).millisecond(999);
    }

    getNextSessionEnd(now:moment.Moment):moment.Moment {
        var result = now.day(12).hour(23).minute(59).second(59).millisecond(999)
        return result;
    }
}

export = RecurringWeek;