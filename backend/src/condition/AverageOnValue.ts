import GoalExpression = require('./expression/GoalExpression');
import Condition = require('./Condition');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');

class AverageOnValue extends Condition {

    private oldTimeBox:TimeBox;
    private newTimeBox:TimeBox;

    constructor(id:string, condition:GoalExpression, thresholdRate:number,
                startDate:Date, dateOfCreation:Date, endDate:Date,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0) {

        super(id, condition, thresholdRate, startDate, dateOfCreation, endDate,
            percentageAchieved, percentageOfTimeElapsed);

        this.oldTimeBox = new TimeBox(startDate, dateOfCreation);
        this.newTimeBox = new TimeBox(dateOfCreation, endDate);
    }

    public setTimeBox(newTimeBox:TimeBox) {

        this.dateOfCreation = new Date(newTimeBox.getStartDateInMillis());
        this.endDate = new Date(newTimeBox.getEndDateInMillis());

        //TODO "-1 month hardcoded"
        this.startDate = new Date(this.dateOfCreation.getFullYear(), this.dateOfCreation.getMonth() - 1, this.dateOfCreation.getDate(),
            this.dateOfCreation.getHours(), this.dateOfCreation.getMinutes(), this.dateOfCreation.getSeconds());

        var timeBox:TimeBox = new TimeBox(this.startDate, this.endDate);
        this.timeBox = timeBox;
    }

    public evaluate(data:any):boolean {

        var sensorNames:string[] = this.expression.getRequired();

        var result = true;
        for (var currentSensorName in sensorNames) {
            var oldAndNewData:any[] = data[currentSensorName].values;

            var oldData:number[] = [];
            var newData:number[] = [];

            this.separateOldAndNewData(oldAndNewData, oldData, newData);
            var rate = 0;

            if (oldData) {

                var oldAverage = this.computeAverageValues(oldData);
                var newAverage = this.computeAverageValues(newData);

                if (newAverage) {
                    rate = (newAverage * 100 / oldAverage);
                }
            }

            // < baisse
            // > hausse
            var changeRate = 0;

            if (this.expression.getComparisonType() === '<') {
                changeRate = 100 - rate;
            } else {
                changeRate = rate - 100;
            }

            result = result && (changeRate >= this.thresholdRate);
            this.percentageAchieved = changeRate * 100 / this.thresholdRate;


            //  It can be infinite
            this.percentageAchieved = (this.percentageAchieved > 100) ? 100 : this.percentageAchieved;

            this.updateDurationAchieved(Clock.getNow());
        }

        return result;
    }

    public updateDurationAchieved(currentDate:number) {
        var duration = this.endDate.getTime() - this.dateOfCreation.getTime();
        var durationAchieved = (currentDate - this.dateOfCreation.getTime());

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

        this.percentageOfTimeElapsed = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        this.percentageOfTimeElapsed = (this.percentageOfTimeElapsed > 100) ? 100 : this.percentageOfTimeElapsed;

    }

    public separateOldAndNewData(values:any[], oldValues:number[], newValues:number[]) {

        for (var currentValueIndex in values) {

            //  { date : __ , value : __ }
            var currentValue:any = values[currentValueIndex];

            var currentDate:Date = new Date(currentValue.date * 1000);

            if (currentDate.getTime() >= this.startDate.getTime()
                && currentDate.getTime() <= this.dateOfCreation.getTime()) {
                oldValues.push(currentValue.value);
            }
            else {
                newValues.push(currentValue.value);
            }
        }
    }

    private computeAverageValues(data:number[]):number {
        var numberOfData = data.length;

        var averageValue = 0;

        for (var currentData in data) {
            averageValue += (data[currentData] / numberOfData);
        }

        return averageValue;
    }


    public getDataInJSON():any {
        var data:any = super.getDataInJSON();
        data.type = 'comparison';
        return data;
    }
}

export = AverageOnValue;