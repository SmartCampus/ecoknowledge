/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import GoalExpression = require('./expression/GoalExpression');
import Condition = require('./Condition');
import Clock = require('../Clock');
import Filter = require('../filter/Filter');

import BadArgumentException = require('../exceptions/BadArgumentException');

class OverallGoalCondition extends Condition {

    constructor(id:string, description:string, condition:GoalExpression, thresholdRate:number, filter:Filter) {
        super(id, description, condition, thresholdRate, filter);
    }

    public evaluate(data:any, conditionDescription:any):any {

        var remainingData:any = super.keepUsefulValues(data, conditionDescription);

        remainingData = super.applyFilters(remainingData);

        data = remainingData;

        var conditionDesc:string[] = this.expression.getRequired();

        //  For each sensors required by internal condition
        for (var currentSymbolicNameIndex in conditionDesc) {
            var currentSymbolicName:string = conditionDesc[currentSymbolicNameIndex];

            //  Retrieve values associated
            var values:any[] = data[currentSymbolicName];

            if (values == null) {
                throw new BadArgumentException('Can not evaluate condition ! Proper argument were not provided. Field' + currentSymbolicName + ' is missing');
            }

            var numberOfValues:number = (values).length;
            var numberOfCorrectValues:number = 0;

            //  Check how many values are correct
            for (var currentPairDateValueIndex in values) {
                var currentPairDateValue = values[currentPairDateValueIndex];

                var dataToEvaluate:any = {};
                dataToEvaluate[currentSymbolicName] = currentPairDateValue.value;

                //  Check value by value if internal condition is satisfied
                if (this.expression.evaluate(dataToEvaluate)) {
                    ++numberOfCorrectValues;
                }

            }
        }

        var percentageAchieved = ((numberOfCorrectValues * 100 / numberOfValues) * 100) / this.thresholdRate;
        percentageAchieved = (percentageAchieved > 100) ? 100 : percentageAchieved;

        //  If there is no values yet
        if(isNaN(percentageAchieved)) {
            percentageAchieved = 0;
        }

        var achieved:boolean = percentageAchieved === 100;

        return {description: this.description, percentageAchieved: percentageAchieved, achieved: achieved};
    }

    public getDataInJSON():any {
        var data:any = super.getDataInJSON();
        data.type = 'overall';
        return data;
    }

    getStringRepresentation():string {
        return 'Overall - ' + super.getStringRepresentation();
    }
}

export = OverallGoalCondition;