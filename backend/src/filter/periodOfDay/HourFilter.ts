/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

interface HourFilter {

    filter(date:moment.Moment):boolean;
    getTimeIntervals():number[];
}

export = HourFilter;