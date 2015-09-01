/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import GoalExpression = require('./expression/GoalExpression');
import Condition = require('./Condition');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');
import Filter = require('../filter/Filter');
import ReferencePeriod = require('./ReferencePeriod');

var moment = require('moment');
var moment_timezone = require('moment-timezone');

class AverageOnValue extends Condition {

    private referencePeriod:ReferencePeriod;

    constructor(id:string, description:string, expression:GoalExpression, thresholdRate:number,
                filter:Filter, referencePeriod:ReferencePeriod) {
        super(id, description, expression, thresholdRate, filter);
        this.referencePeriod = referencePeriod;
    }

    getTimeBoxRequired(startDateOfChallenge:moment.Moment, endDateOfChallenge:moment.Moment):any {

        var beginningOfReferencePeriod:moment.Moment = this.referencePeriod.getTimeBoxRequired(startDateOfChallenge);
        
        return {
            start: beginningOfReferencePeriod.clone(),
            dateOfCreation: startDateOfChallenge.clone(),
            end: endDateOfChallenge.clone()
        };
    }

    public evaluate(data:any, conditionDescription:any):boolean {

        var remainingData:any = super.keepUsefulValues(data, conditionDescription);
        remainingData = super.applyFilters(remainingData);

        data = remainingData;

        var sensorNames:string[] = this.expression.getRequired();

        //  This type of condition must have one and exactly one required
        var currentSensorName:string = sensorNames[0];

        var oldAndNewData:any[] = data[currentSensorName];

        var timeBox:any = conditionDescription.timeBox;
        var dateOfCreation:moment.Moment = timeBox.dateOfCreation;

        var oldData:number[] = [];
        var newData:number[] = [];

        this.separateOldAndNewData(oldAndNewData, oldData, newData, dateOfCreation);

        var percentageAchieved = 0;
        var rate = 0;

        if (oldData.length != 0 && newData.length != 0) {

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

            percentageAchieved = changeRate * 100 / this.thresholdRate;

            //  It can be infinite
            percentageAchieved = (percentageAchieved > 100) ? 100 : percentageAchieved;

        }
        var finished:boolean = percentageAchieved === 100;
        var result:any = {description: this.description, percentageAchieved: percentageAchieved, finished: finished};


        return result;
    }

    public separateOldAndNewData(values:any[], oldValues:number[], newValues:number[], dateOfCreation:moment.Moment) {

        for (var currentValueIndex in values) {

            var currentPairDateValue:any = values[currentValueIndex];
            var currentMoment:moment.Moment = Clock.getMomentFromString(currentPairDateValue.date);

            if (currentMoment.isAfter(dateOfCreation)) {
                newValues.push(currentPairDateValue.value);
            }
            else if (currentMoment.isBefore(dateOfCreation)) {
                oldValues.push(currentPairDateValue.value);
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


    getStringRepresentation():string {
        return 'Comparison - ' + super.getStringRepresentation();
    }
}

export = AverageOnValue;