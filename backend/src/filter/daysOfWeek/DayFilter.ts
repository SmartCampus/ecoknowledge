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

    filter(date:Date) {
        var convertedDayOfWeek = (date.getDay() + 6) % 7;
        //  JS has following model : Sunday(0), Monday(1), ..., Saturday(6)
        //  and we want following model : Monday(0), Tuesday(1), ..., Sunday(6)

        return convertedDayOfWeek >= this.startDay
            && convertedDayOfWeek <= this.endDay;
    }

    getTimeIntervals():number[] {
        return [this.startDay, this.endDay];
    }
}

export = DayFilter;