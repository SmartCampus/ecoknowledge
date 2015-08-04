/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

import HourFilter = require('./HourFilter');

class NightTimeFilter implements HourFilter {

    private startHour:number;
    private endHour:number;

    constructor(startHour:number, endHour:number) {
        this.startHour = startHour;
        this.endHour = endHour;
    }

    filter(date:moment.Moment):boolean {
        var dateHours = date.hours();

        return (dateHours >= this.startHour && dateHours <= 23) ||
            dateHours <= this.endHour;
    }

    getTimeIntervals():number[] {
        return [this.startHour, this.endHour];
    }
}

export = NightTimeFilter;