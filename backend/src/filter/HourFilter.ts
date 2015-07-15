import Filter = require('../Filter');

class HourFilter implements Filter {

    private timeOfDay:string;

    private mapTimeOfDayToHours:any = {
        'morning': {
            'start':8,
            'end':12
        },
        'afternoon': {
            'start':12,
            'end':18
        },
        'night':{
            'start':18,
            'end':8
        }
    };

    constructor(timeOfDay:string) {
        this.timeOfDay = timeOfDay;
    }

    apply(values:any[]) {
        var result:any[] = [];

        for(var currentValueIndex in values) {
            var currentValue = values[currentValueIndex];

            var currentDateDesc:string = currentValue.date;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);
            var currentDate:Date = new Date(currentDateInSecondsSinceEPOCH*1000);

            var date:Date = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getMonth(), currentDate.getUTCDay(),
            currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()));

            if(date.getHours() >= this.mapTimeOfDayToHours[this.timeOfDay].start
            && date.getHours() < this.mapTimeOfDayToHours[this.timeOfDay].end) {
                result.push(currentValue.value);
            }
        }

        return result;
    }

}

export = HourFilter;