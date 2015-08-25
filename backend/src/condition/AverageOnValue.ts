/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import GoalExpression = require('./expression/GoalExpression');
import Condition = require('./Condition');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');
import Filter = require('../filter/Filter');

var moment = require('moment');
var moment_timezone = require('moment-timezone');

class AverageOnValue extends Condition {

    private oldTimeBox:TimeBox;
    private newTimeBox:TimeBox;
    private referencePeriod:moment.Moment;

    constructor(id:string, condition:GoalExpression, thresholdRate:number,
                startDate:moment.Moment, dateOfCreation:moment.Moment, endDate:moment.Moment, referencePeriod:moment.Moment,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0, filter:Filter = null) {

        super(id, condition, thresholdRate, startDate, dateOfCreation, endDate,
            percentageAchieved, percentageOfTimeElapsed, filter);

        this.oldTimeBox = new TimeBox(startDate, dateOfCreation);
        this.newTimeBox = new TimeBox(dateOfCreation, endDate);

        this.referencePeriod = referencePeriod;
    }

    public setTimeBox(newTimeBox:TimeBox) {

        this.dateOfCreation = newTimeBox.getStartDate();
        this.endDate = newTimeBox.getEndDate();

        console.log("DOC", this.dateOfCreation.format(), "END DATE", this.endDate.format());

        var timeOfTheUltimateOriginOfOrigins:moment.Moment = Clock.getMoment(new Date(0, 0, 0, 0, 0, 0, 0).getTime());

        console.log("ORIGINS", timeOfTheUltimateOriginOfOrigins.format());

        var year:number = this.referencePeriod.year() - timeOfTheUltimateOriginOfOrigins.year();

        var month:number = this.referencePeriod.month() - timeOfTheUltimateOriginOfOrigins.month();
        var day:number = this.referencePeriod.date() - timeOfTheUltimateOriginOfOrigins.date();

        var momentObj:moment.Moment = moment.tz( Clock.getTimeZone()).year(this.dateOfCreation.year() - year).month(this.dateOfCreation.month() - month).date(this.dateOfCreation.date() - day).hours(this.dateOfCreation.hour()).minute(this.dateOfCreation.minute())
            .second(this.dateOfCreation.second()).millisecond(this.dateOfCreation.millisecond());


        this.startDate = momentObj;

        console.log("CONSTRUCTION DE LA CONDITION AVEC START DATE", this.startDate.format());

        var timeBox:TimeBox = new TimeBox(this.startDate, this.endDate);
        this.timeBox = timeBox;
    }

    public evaluate(data:any):boolean {
        var remainingData:any = super.applyFilters(data);
        data = remainingData;

        console.log('Remaining data', data);

        var sensorNames:string[] = this.expression.getRequired();

        var result = false;

        for (var currentSensorNameIndex in sensorNames) {

            var currentSensorName:string = sensorNames[currentSensorNameIndex];

            var oldAndNewData:any[] = data[currentSensorName].values;

            var oldData:number[] = [];
            var newData:number[] = [];

            this.separateOldAndNewData(oldAndNewData, oldData, newData);

            console.log("OLD DATA", oldData, "NEW DATA", newData);

            this.percentageAchieved = 0;
            var rate = 0;

            if (oldData.length != 0 && newData.length != 0) {

                var result = true;

                var oldAverage = this.computeAverageValues(oldData);
                var newAverage = this.computeAverageValues(newData);

                if (newAverage) {
                    rate = (newAverage * 100 / oldAverage);
                }

                // < baisse
                // > hausse
                var changeRate = 0;

                if (this.expression.getComparisonType() === '<') {
                    changeRate = 100 - rate;
                } else {
                    changeRate = rate - 100;
                }

                this.percentageAchieved = changeRate * 100 / this.thresholdRate;

                //  It can be infinite
                this.percentageAchieved = (this.percentageAchieved > 100) ? 100 : this.percentageAchieved;
                result = result && this.percentageAchieved >= 100;
            }


            this.updateDurationAchieved(Clock.getNow());
        }

        return result;
    }

    public updateDurationAchieved(currentDate:number) {
        console.log(this.dateOfCreation.date());

        var currentMoment:moment.Moment = Clock.getMoment(currentDate);
        console.log(currentMoment.date());
        if (currentMoment.isBefore(this.dateOfCreation)) {
            throw new Error('Time given is before dateOfCreation !');
        }

        var duration = this.endDate.valueOf() - this.dateOfCreation.valueOf();
        var durationAchieved = (currentMoment.valueOf() - this.dateOfCreation.valueOf());

        this.percentageOfTimeElapsed = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        this.percentageOfTimeElapsed = (this.percentageOfTimeElapsed > 100) ? 100 : this.percentageOfTimeElapsed;
    }

    public separateOldAndNewData(values:any[], oldValues:number[], newValues:number[]) {

        for (var currentValueIndex in values) {

            //  { date : __ , value : __ }
            var currentPairDateValue:any = values[currentValueIndex];


            var currentMoment:moment.Moment = Clock.getMoment(parseInt(currentPairDateValue.date));

            //console.log("PROCESSING MOMENT", currentMoment.format());
            // console.log("START DATE", this.startDate.format(), "END DATE", this.endDate.format());

            if (currentMoment.isAfter(this.startDate)
                && currentMoment.isBefore(this.dateOfCreation)) {
                oldValues.push(currentPairDateValue.value);
            }
            else if (currentMoment.isAfter(this.dateOfCreation)) {
                newValues.push(currentPairDateValue.value);
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
        data.expression.periodOfTime = (''+this.referencePeriod.valueOf());

        return data;
    }


    getStringRepresentation():string {
        return 'Comparison - ' + super.getStringRepresentation();
    }
}

export = AverageOnValue;