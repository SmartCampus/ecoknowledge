import GoalCondition = require('./GoalCondition');
import TimeBox = require('../../TimeBox');
import Expression = require('./Expression');
import Clock = require('../../Clock');

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

        this.thresholdRate = thresholdRate;

        if (startDate != null && dateOfCreation != null && endDate != null) {
            this.startDate = startDate;
            this.dateOfCreation = dateOfCreation;
            this.endDate = endDate;

            condition.setTimeBox(new TimeBox(startDate.getTime(), endDate.getTime()));

            this.oldTimeBox = new TimeBox(startDate.getTime(), dateOfCreation.getTime());
            this.newTimeBox = new TimeBox(dateOfCreation.getTime(), endDate.getTime());
        }

    }

    public setTimeBox(newTimeBox:TimeBox) {

        this.dateOfCreation = new Date(newTimeBox.getStartDateInMillis());
        this.endDate = new Date(newTimeBox.getEndDateInMillis());

        //TODO "-1 month hardcoded"
        this.startDate = new Date(this.dateOfCreation.getFullYear(), this.dateOfCreation.getMonth() - 1, this.dateOfCreation.getDate(),
            this.dateOfCreation.getHours(), this.dateOfCreation.getMinutes(), this.dateOfCreation.getSeconds());

        var timeBox:TimeBox = new TimeBox(this.startDate.getTime(), this.endDate.getTime());
        this.condition.setTimeBox(timeBox);
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
        return this.condition.getRequired();
    }

    public getPercentageAchieved():number {
        return this.percentageAchieved;
    }

    public evaluate(data:any):boolean {

        var sensorNames:string[] = this.condition.getRequired();

        console.log("REQUIRED", sensorNames, "\nDATA", JSON.stringify(data));

        var result = true;
        for (var currentSensorName in sensorNames) {
            var oldAndNewData:any[] = data[currentSensorName].values;

            var oldData:number[] = [];
            var newData:number[] = [];

            this.separateOldAndNewData(oldAndNewData, oldData, newData);

            console.log("OLDDATA[0]", oldData[0]);
            console.log("newData[0]", newData[0]);
            var decreaseRate = 0;

            if (oldData) {

                var oldAverage = this.computeAverageValues(oldData);
                var newAverage = this.computeAverageValues(newData);

                if (newAverage) {
                    decreaseRate = 100 - (newAverage * 100 / oldAverage);
                }
            }

            result = result && (decreaseRate >= this.thresholdRate);


            this.percentageAchieved = decreaseRate * 100 / this.thresholdRate;

            //  It can be infinite
            this.percentageAchieved = (this.percentageAchieved >  100)?100:this.percentageAchieved;

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

        this.percentageOfTime = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        this.percentageOfTime = (this.percentageOfTime >  100)?100:this.percentageOfTime;

    }

    public getDurationAchieved():number {
        return this.percentageOfTime;
    }

    public separateOldAndNewData(values:any[], oldValues:number[], newValues:number[]) {

        console.log("SEPARATE DATA", "START DATE", this.startDate, "DOC", this.dateOfCreation);

        for (var currentValueIndex in values) {

            //  { date : __ , value : __ }
            var currentValue:any = values[currentValueIndex];

            var currentDate:Date = new Date(currentValue.date * 1000);

            console.log("Current date : ", currentDate);

            if (currentDate.getTime() >= this.startDate.getTime()
                && currentDate.getTime() <= this.dateOfCreation.getTime()) {
                console.log("OLDVALUE");
                oldValues.push(currentValue.value);
            }
            else {
                console.log("NEW VALUE");
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
}

export = AverageOnValue;