/// <reference path="../../typings/node/node.d.ts" />

import PeriodOfDayFilter = require('./PeriodOfDayFilter');
import DayOfWeekFilter = require('./DayOfWeekFilter');
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

    apply(values:any):any[] {
        var result:number[] = [];

        for (var currentValueIndex in values) {
            var currentPairOfDateAndValue = values[currentValueIndex];

            var currentDateDesc:string = currentPairOfDateAndValue.date;
            var currentValue:number = currentPairOfDateAndValue.value;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);
            var currentDate:Date = new Date(currentDateInSecondsSinceEPOCH);

            var date = moment(currentDateDesc).tz('Europe/Paris');

            console.log("DATE",currentDate);

            if (this.dayFilter.apply(currentDate) && this.hourFilter.apply(currentDate)) {
                result.push(currentValue);
            }
        }

        return result;
    }
}

export = Filter;