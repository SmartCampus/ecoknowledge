/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

import HourFilter = require('./HourFilter');

class DayTimeFilter implements HourFilter {

    private startHour:number;
    private endHour:number;

    constructor(startHour:number, endHour:number) {
        this.startHour = startHour;
        this.endHour = endHour;
    }

    filter(date:moment.Moment):boolean {
        var dateHours = date.hours();

        //console.log("date", date.format(), "s'est fait virée", !(dateHours >= this.startHour && dateHours <= this.endHour),  "dateHours", dateHours, "start", this.startHour, "end", this.endHour);

        return dateHours >= this.startHour && dateHours <= this.endHour;
    }

    getTimeIntervals():number[] {
        return [this.startHour, this.endHour];
    }
}

export = DayTimeFilter;