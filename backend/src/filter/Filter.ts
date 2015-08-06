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
        var result:any = {};

        //console.log("Le Filtre a recu", JSON.stringify(data));

        for (var currentSensorName in data) {
            var correctValues:any[] = [];
            var arrayOfValues = data[currentSensorName].values;

            //console.log("Array of values", arrayOfValues);

            for(var currentPairOfDateAndValueIndex in arrayOfValues) {

                var currentPairOfDateAndValue = arrayOfValues[currentPairOfDateAndValueIndex];

                //console.log("Current pair date/valeur", currentPairOfDateAndValue);

                var currentDateDesc:string = currentPairOfDateAndValue.date;
                var currentValue:number = currentPairOfDateAndValue.value;

                var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);

                //console.log("CURRENT MILLIS", currentDateInSecondsSinceEPOCH);

                var date = Clock.getMoment(currentDateInSecondsSinceEPOCH);

                //console.log("DATE A FILTER?", date.format());

                var applyResult = false;

                //console.log("____________________________");

                for (var currentPeriodOfDayFilterIndex in this.hourFilter) {
                    var currentPeriodOfDayFilter = this.hourFilter[currentPeriodOfDayFilterIndex];
                    applyResult = applyResult || currentPeriodOfDayFilter.apply(date);
                }

                //console.log("FILTER HOUR :", applyResult);

                if (this.dayFilter.apply(date) && applyResult) {
                   // console.log("DAY FILTER PASSED");
                    correctValues.push({
                        "date": currentDateDesc,
                        "value": currentValue
                    });
                }
                else {
                    //console.log("DAY FILTER NOT PASSED");
                }
                //console.log("____________________________");

            }

            var correctValuesContainer:any = {};
            correctValuesContainer.values = correctValues;
            result[currentSensorName] = correctValuesContainer;
        }

        //console.log("DONC ON GARDE", result);

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