/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />
import HourFilter = require('./periodOfDay/HourFilter');
import DayTimeFilter = require('./periodOfDay/DayTimeFilter');
import NightTimeFilter = require('./periodOfDay/NightTimeFilter');

import BadArgumentException = require('../exceptions/BadArgumentException');
import moment = require('moment');

class PeriodOfDayFilter {

    private timeOfDay:string;
    private internalFilter:HourFilter;

    private mapTimeOfDayToHours:any = {
        'all': new DayTimeFilter(0, 23),
        'morning': new DayTimeFilter(8, 11),
        'afternoon': new DayTimeFilter(12, 18),
        'night': new NightTimeFilter(19, 7)
    };

    constructor(timeOfDay:string) {
        if (!this.mapTimeOfDayToHours.hasOwnProperty(timeOfDay)) {
            throw new BadArgumentException('Specified period of day unknown  : ' + timeOfDay);
        }

        this.timeOfDay = timeOfDay;
        this.internalFilter = this.mapTimeOfDayToHours[timeOfDay];
    }

    apply(date:moment.Moment) {
        return this.internalFilter.filter(date);
    }

    getInternalFilter():any {
        return this.internalFilter;
    }

    getFilterTimeIntervals():number[] {
        return this.internalFilter.getTimeIntervals();
    }

    setInternalFilter(filter) {
        this.internalFilter = filter
    }

    getFilterName():string {
        return this.timeOfDay;
    }
}

export = PeriodOfDayFilter;