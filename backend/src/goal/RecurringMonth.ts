/// <reference path="../../typings/moment/moment.d.ts" />

import moment = require('moment');
import RecurringPeriod = require('./RecurringPeriod');

class RecurringMonth implements RecurringPeriod {

    getNextSessionStart(now:moment.Moment):moment.Moment {
        var endOfMonth = now.add(1, 'months');
        return endOfMonth.date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    }

    isInASession(now:moment.Moment) {
        //  We are always in a month ...
        return true;
    }

    getCurrentSessionStart(now:moment.Moment):moment.Moment {
        //  return previous monday
        return now.startOf('month').hours(0).minutes(0).seconds(0).milliseconds(0);
    }

    getCurrentSessionEnd(now:moment.Moment):moment.Moment {
        return now.endOf('month').hours(23).minutes(59).seconds(59).milliseconds(999)
    }

    getNextSessionEnd(now:moment.Moment):moment.Moment {
        return this.getCurrentSessionEnd(this.getNextSessionStart(now));
    }
}

export = RecurringMonth;