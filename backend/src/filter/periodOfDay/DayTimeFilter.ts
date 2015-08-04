import HourFilter = require('./HourFilter');

class DayTimeFilter implements HourFilter {

    private startHour:number;
    private endHour:number;

    constructor(startHour:number, endHour:number) {
        this.startHour = startHour;
        this.endHour = endHour;
    }

    filter(date:Date):boolean {
        var dateHours = date.getHours();
        return dateHours >= this.startHour && dateHours <= this.endHour;
    }

    getTimeIntervals():number[] {
        return [this.startHour, this.endHour];
    }
}

export = DayTimeFilter;