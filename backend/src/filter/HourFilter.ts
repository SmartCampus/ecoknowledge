import Filter = require('../Filter');

class HourFilter implements Filter {

    private timeOfDay:string;
    private internalFilter:Filter;


    private mapTimeOfDayToHours:any = {
        'morning': {
            'start': 8,
            'end': 12
        },
        'afternoon': {
            'start': 12,
            'end': 18
        },
        'night': {
            'start': 18,
            'end': 8
        }
    };

    constructor(timeOfDay:string) {
        this.timeOfDay = timeOfDay;
    }

    apply(values:any[]) {
        var result:any[] = [];

        for (var currentValueIndex in values) {

            var currentValue = values[currentValueIndex];

            var currentDateDesc:string = currentValue.date;

            var currentDateInSecondsSinceEPOCH = parseInt(currentDateDesc);
            var currentDate:Date = new Date(currentDateInSecondsSinceEPOCH);

            console.log("CURRENT DATE.GETHOURS", currentDate.getHours(), "VS", this.mapTimeOfDayToHours[this.timeOfDay].start, "AND", this.mapTimeOfDayToHours[this.timeOfDay].end);
            if (currentDate.getHours() >= this.mapTimeOfDayToHours[this.timeOfDay].start
                && currentDate.getHours() < this.mapTimeOfDayToHours[this.timeOfDay].end) {
                result.push(currentValue.value);
            }
        }

        return result;
    }

}

export = HourFilter;