/// <reference path="../../typings/node/node.d.ts" />

import PeriodOfDayFilter = require('./PeriodOfDayFilter');
import DayOfWeekFilter = require('./DayOfWeekFilter');
import Clock = require('../Clock');

var moment = require('moment-timezone');

class Filter {
    private dayFilter:DayOfWeekFilter;
    private hourFilter:PeriodOfDayFilter;

    /**
     *
     * @param daysOfWeek
     *      Can be 'all', 'week-end' or 'working-week'
     * @param periodOfDay
     *      Can be 'all', 'morning', 'afternoon' or 'night'
     */
    constructor(daysOfWeek:string, periodOfDay:string) {
        this.dayFilter = new DayOfWeekFilter(daysOfWeek);
        this.hourFilter = new PeriodOfDayFilter(periodOfDay);
    }

    apply(data:any):any[] {
        var result:any[] = [];

        for (var currentPairOfDateAndValueIndex in data) {
            var currentPairOfDateAndValue = data[currentPairOfDateAndValueIndex];

            var currentDateDesc:string = currentPairOfDateAndValue.date;
            var currentValue:number = currentPairOfDateAndValue.value;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);

            var date = moment.tz(currentDateInSecondsSinceEPOCH, Clock.getTimeZone());

            if (this.dayFilter.apply(date) && this.hourFilter.apply(date)) {

                result.push({
                    "date":currentDateDesc,
                    "value":currentValue
                });
            }
        }

        return result;
    }

    getDataInJSON():any {
        return {
            dayOfWeekFilter: this.dayFilter.getFilterName(),
            periodOfDayFilter: this.hourFilter.getFilterName()
        }
    }
}

export = Filter;