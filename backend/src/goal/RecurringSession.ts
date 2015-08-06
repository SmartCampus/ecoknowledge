/// <reference path="../../typings/moment/moment.d.ts" />

import moment = require('moment');
import RecurringWeek = require('./RecurringWeek');
import RecurringPeriod = require('./RecurringPeriod');
import RecurringDay = require('./RecurringDay');
import RecurringMonth = require('./RecurringMonth');
import BadArgumentException = require('../exceptions/BadArgumentException');

class RecurringSession {

    private recurringType:string = '';
    private mapRecurringTypeToObject:any = {
        'day': new RecurringDay(),
        'week': new RecurringWeek(),
        'month': new RecurringMonth()
    };

    private recurringPeriod:RecurringPeriod;

    constructor(recurringType:string) {
        if (!this.mapRecurringTypeToObject.hasOwnProperty(recurringType)) {
            throw new BadArgumentException('Can not build recurring session. Given recurring type is unknown : ' + recurringType);
        }

        this.recurringType = recurringType;
        this.recurringPeriod = this.mapRecurringTypeToObject[recurringType];
    }

    getDescription():string {
        return this.recurringType;
    }

    getNextSessionStart(now:moment.Moment) {
        return this.recurringPeriod.getNextSessionStart(now);
    }

    isInASession(now:moment.Moment) {
        return this.recurringPeriod.isInASession(now);
    }

    getCurrentSessionStart(now:moment.Moment) {
        return this.recurringPeriod.getCurrentSessionStart(now);
    }

    getCurrentSessionEnd(now:moment.Moment) {
        return this.recurringPeriod.getCurrentSessionEnd(now);
    }

    getNextSessionEnd(now:moment.Moment) {
        return this.recurringPeriod.getNextSessionEnd(now);
    }
}

export = RecurringSession;