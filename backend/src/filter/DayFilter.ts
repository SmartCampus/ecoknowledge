import Filter = require('../Filter');

/**
 * DayFilter - filter dates by days of week</br>
 * Note for dev : </br>
 * <b>Warning</b>
 * JS work that way : Sunday(0), Monday(1), ... Saturday(6).
 * What we want to do is that monday is 0 and sunday is 6, so we want
 * to apply minus 1 and modulo 7 operator. But JS modulo operator won't
 * work on negative number ! So we have to convert date by doing (numb + 6 ) % 7
 */
class DayFilter implements Filter {

    private daysOfWeek:string;

    /**
     *
     * @type {{week: {start: number, end: number}, week-end: {start: number, end: number}, working-week: {start: number, end: number}}}
     */
    private mapDayToDayOfWeek:any = {
        'week': {
            'start':0,
            'end':6
        },
        'week-end': {
            'start':5,
            'end':6
        },
        'working-week':{
            'start':0,
            'end':4
        }
    };

    constructor(timeOfDay:string) {
        this.daysOfWeek = timeOfDay;
    }

    apply(values:any[]) {
        var result:any[] = [];

        for(var currentValueIndex in values) {
            var currentValue = values[currentValueIndex];

            var currentDateDesc:string = currentValue.date;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);
            var currentDate:Date = new Date(currentDateInSecondsSinceEPOCH);

            var convertedDayOfWeek = (currentDate.getDay() + 6) % 7;
            //  JS has following model : Sunday(0), Monday(1), ..., Saturday(6)
            //  and we want following model : Monday(0), Tuesday(1), ..., Sunday(6)

            if(convertedDayOfWeek>= this.mapDayToDayOfWeek[this.daysOfWeek].start
                && convertedDayOfWeek < this.mapDayToDayOfWeek[this.daysOfWeek].end) {
                result.push(currentValue.value);
            }
        }

        return result;
    }

}

export = DayFilter;