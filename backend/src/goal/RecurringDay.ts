/// <reference path="../../typings/moment/moment.d.ts" />

import moment = require('moment');
import RecurringPeriod = require('./RecurringPeriod');

class RecurringDay implements RecurringPeriod {

    getNextSessionStart(now:moment.Moment):moment.Moment {
        //  Check if we are Monday, Tuesday, Wednesday or Friday
        //  and return next day
        if (now.day() >= 0 && now.day() <= 4) {
            return now.add(1, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
        }

        //  NOTE : previous if must include 'sunday' case
        //  Moment.js seems to handle sunday case
        //  incorrectly since, now.day(8) must go to the next
        //  monday in any cases

        //  Or return Monday
        return now.day(8).hours(0).minutes(0).seconds(0).milliseconds(0);
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
        return now.hours(0).minutes(0).seconds(0).milliseconds(0);
    }

    getCurrentSessionEnd(now:moment.Moment):moment.Moment {
        if(!this.isInASession(now)) {
            return this.getNextSessionEnd(now);
        }

        return now.hours(23).minutes(59).seconds(59).milliseconds(999);
    }

    getNextSessionEnd(now:moment.Moment):moment.Moment {
        //  Check if we are Monday, Tuesday, Wednesday or Friday
        //  and return next day
        if (now.day() >= 0 && now.day() <= 4) {
            return now.add(1, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
        }

        //  NOTE : previous if must include 'sunday' case
        //  Moment.js seems to handle sunday case
        //  incorrectly since, now.day(8) must go to the next
        //  monday in any cases

        //  Or return Monday
        return now.day(8).hours(23).minutes(59).seconds(59).milliseconds(999);
    }
}

export = RecurringDay;