import DayFilter = require('./daysOfWeek/DayFilter');

import BadArgumentException = require('../exceptions/BadArgumentException');

/**
 * DayFilter - filter dates by days of week</br>
 * Note for dev : </br>
 * <b>Warning</b>
 * JS work that way : Sunday(0), Monday(1), ... Saturday(6).
 * What we want to do is that monday is 0 and sunday is 6, so we want
 * to apply minus 1 and modulo 7 operator. But JS modulo operator won't
 * work on negative number ! So we have to convert date by doing (numb + 6 ) % 7
 */
class DayOfWeekFilter {

    private daysOfWeek:string;
    private internalFilter:DayFilter;

    /**
     *
     * @type {{all: DayFilter (0, 6), week-end: DayFilter(5, 6), working-week: DayFilter(0, 4)}}
     */
    private mapDayToDayOfWeek:any = {
        'all': new DayFilter(0, 6),
        'week-end': new DayFilter(5, 6),
        'working-week': new DayFilter(0, 4)
    };

    constructor(daysOfWeek:string) {
        if (!this.mapDayToDayOfWeek.hasOwnProperty(daysOfWeek)) {
            throw new BadArgumentException('Specified daysOfWeek unknown  : ' + daysOfWeek);
        }

        this.daysOfWeek = daysOfWeek;
        this.internalFilter = this.mapDayToDayOfWeek[daysOfWeek];
    }

    apply(date:Date) {
        return this.internalFilter.filter(date);
    }

    getInternalFilter():any {
        return this.internalFilter;
    }

    getFilterTimeIntervals():number[] {
        return this.internalFilter.getTimeIntervals();
    }
}

export = DayOfWeekFilter;