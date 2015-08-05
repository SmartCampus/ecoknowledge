/// <reference path="../../typings/node/node.d.ts" />

import PeriodOfDayFilter = require('./PeriodOfDayFilter');
import DayOfWeekFilter = require('./DayOfWeekFilter');
import Clock = require('../Clock');

var moment = require('moment-timezone');

class Filter {
    private dayFilter:DayOfWeekFilter;
    private hourFilter:PeriodOfDayFilter[] = [];

    /**
     *
     * @param daysOfWeek
     *      Can be 'all', 'week-end' or 'working-week'
     * @param periodOfDayFilters
     *      Can be 'all', 'morning', 'afternoon' or 'night'
     */
    constructor(daysOfWeek:string, periodOfDayFilters:string[]) {
        this.dayFilter = new DayOfWeekFilter(daysOfWeek);

        for (var currentPeriodOfDayFilterIndex = 0 ; currentPeriodOfDayFilterIndex < periodOfDayFilters.length ; currentPeriodOfDayFilterIndex++) {
            var currentPeriodOfDayFilter = periodOfDayFilters[currentPeriodOfDayFilterIndex];
            var currentFilter:PeriodOfDayFilter = new PeriodOfDayFilter(currentPeriodOfDayFilter);
            this.hourFilter.push(currentFilter);
        }
    }

    apply(data:any):any[] {
        var result:any[] = [];

        for (var currentPairOfDateAndValueIndex in data) {
            var currentPairOfDateAndValue = data[currentPairOfDateAndValueIndex];

            var currentDateDesc:string = currentPairOfDateAndValue.date;
            var currentValue:number = currentPairOfDateAndValue.value;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);

            var date = moment.tz(currentDateInSecondsSinceEPOCH, Clock.getTimeZone());

            var applyResult = true;

            for (var currentPeriodOfDayFilterIndex in this.hourFilter) {
                var currentPeriodOfDayFilter = this.hourFilter[currentPeriodOfDayFilterIndex];
                applyResult = applyResult && currentPeriodOfDayFilter.apply(date);
            }

            if (this.dayFilter.apply(date) && applyResult) {
                result.push({
                    "date": currentDateDesc,
                    "value": currentValue
                });
            }
        }

        return result;
    }

    getDataInJSON():any {
        var result:string[] = [];

        for (var currentPeriodOfDayFilterIndex in this.hourFilter) {
            var currentPeriodOfDayFilter = this.hourFilter[currentPeriodOfDayFilterIndex];
            result.push(currentPeriodOfDayFilter.getFilterName());
        }
        return {
            dayOfWeekFilter: this.dayFilter.getFilterName(),
            periodOfDayFilter: result
        }
    }
}

export = Filter;