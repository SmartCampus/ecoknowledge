/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

class DayFilter {
    private startDay:number;
    private endDay:number;

    /**
     * StartDay parameter must be <= at endDay parameter
     * @param startDay
     *      <b>NOT in JS format </b>: Monday(0), Tuesday(1), ..., Sunday(6)
     * @param endDay
     *      <b>NOT in JS format </b>: Monday(0), Tuesday(1), ..., Sunday(6)
     */
    constructor(startDay:number, endDay:number) {
        this.startDay = startDay;
        this.endDay = endDay;
    }

    filter(date:moment.Moment) {

        return date.day() >= this.startDay
            && date.day() <= this.endDay;
    }

    getTimeIntervals():number[] {
        return [this.startDay, this.endDay];
    }
}

export = DayFilter;