import GoalCondition = require('./GoalCondition');
import TimeBox = require('../../TimeBox');
import Expression = require('./Expression');

class AverageOnValue implements Expression {
    private condition:GoalCondition;
    private startDate:Date;
    private dateOfCreation:Date;
    private endDate:Date;
    private thresholdRate:number;

    private oldTimeBox:TimeBox;
    private newTimeBox:TimeBox;

    private percentageAchieved:number = 0;
    private percentageOfTime:number = 0;

    constructor(condition:GoalCondition, startDate:Date, dateOfCreation:Date, endDate:Date, thresholdRate:number) {
        this.condition = condition;
        this.startDate = startDate;
        this.dateOfCreation = dateOfCreation;
        this.endDate = endDate;
        this.thresholdRate = thresholdRate;

        condition.setTimeBox(new TimeBox(startDate.getTime(), endDate.getTime()));

        this.oldTimeBox = new TimeBox(startDate.getTime(), dateOfCreation.getTime());
        this.newTimeBox = new TimeBox(dateOfCreation.getTime(), endDate.getTime());
    }

    public setTimeBox(newTimeBox:TimeBox) {
        this.dateOfCreation = new Date(newTimeBox.getStartDateInMillis());
        this.endDate = new Date(newTimeBox.getEndDateInMillis());

        //TODO "-1 month hardcoded"
        this.startDate = new Date(this.dateOfCreation.getFullYear(), this.dateOfCreation.getMonth() - 1, this.dateOfCreation.getDate());
    }

    public getData():any {
        return {
            description: this.condition.getDescription(),
            timeAchieved: this.percentageOfTime,
            conditionAchieved: this.percentageAchieved
        }
    }

    public getComparisonType():string {
        return this.condition.getComparisonType();
    }

    public hasLeftOperand(name:string):boolean {
        return this.condition.hasLeftOperand(name);
    }

    public hasRightOperand(name:string):boolean {
        return this.condition.hasRightOperand(name);
    }

    public getID():string {
        return null;
    }

    public getRequired():any {
        var result:any = {};

        result = this.condition.getRequired();

        return result;
    }

    public getPercentageAchieved():number {
        return this.percentageAchieved;
    }

    public evaluate(data:any):boolean {
        var sensorNames:string[] = this.condition.getRequired();

        var result = true;
        for (var currentSensorName in sensorNames) {
            var oldAndNewData:any[] = data[currentSensorName].values;

            var oldData:number[] = [];
            var newData:number[] = [];

            this.separateOldAndNewData(oldAndNewData, oldData, newData);

            var oldAverage = this.computeAverageValues(oldData);
            var newAverage = this.computeAverageValues(newData);

            var decreaseRate = 100 - (newAverage * 100 / oldAverage);

            result = result && (decreaseRate >= this.thresholdRate);

            this.percentageAchieved = decreaseRate * 100 / this.thresholdRate;

            this.updateDurationAchieved(Date.now());
        }

        return result;
    }

    public updateDurationAchieved(currentDate:number) {
        var duration = this.endDate.getTime() - this.dateOfCreation.getTime();

        var durationAchieved = currentDate - this.dateOfCreation.getTime();

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

        this.percentageOfTime = durationAchieved * 100 / duration;
    }

    public getDurationAchieved():number {
        return this.percentageOfTime;
    }

    private separateOldAndNewData(values:any[], oldValues:number[], newValues:number[]) {
        for (var currentValueIndex in values) {

            //  { date : __ , value : __ }
            var currentValue:any = values[currentValueIndex];

            if (currentValue.date >= this.startDate.getTime()
                && currentValue.date <= this.dateOfCreation.getTime()) {

                oldValues.push(currentValue.value);
            }
            else {
                newValues.push(currentValue.value);
            }
        }
    }

    private computeAverageValues(data:number[]):number {
        var numberOfData = data.length;
        var cumulativeDataSum = 0;

        for (var currentData in data) {
            cumulativeDataSum += data[currentData];
        }

        return cumulativeDataSum / numberOfData;
    }
}

export = AverageOnValue;