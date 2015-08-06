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


    constructor(id:string, condition:GoalExpression, thresholdRate:number,
                startDate:moment.Moment, dateOfCreation:moment.Moment, endDate:moment.Moment,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0, filter:Filter = null) {

        super(id, condition, thresholdRate, startDate, dateOfCreation, endDate,
            percentageAchieved, percentageOfTimeElapsed, filter);
    }

    /**
     *
     * @param values
     *  {
     *      <sensor-name:string> : { timebox { start:_, end:_ }, values : [ {date:_, value:_}, ... ] }
     *      ...
     *  }
     */

    public evaluate(data:any) {

        var remainingData:any = super.applyFilters(data);
        data = remainingData;

        var conditionDesc:string[] = this.expression.getRequired();

        //  For each sensors required by internal condition
        for (var currentSensorNameIndex in conditionDesc) {
            var currentSensorName:string = conditionDesc[currentSensorNameIndex];

            //  Retrieve values associated
            var currentConditionDesc = data[currentSensorName];

            if(!currentConditionDesc) {
                throw new BadArgumentException('Can not evaluate condition ! Proper argument were not provided. Field' + currentSensorName + ' is missing');
            }


            var values:any[] = currentConditionDesc.values;

            var numberOfValues:number = (values).length;
            var numberOfCorrectValues:number = 0;

            //  Check how many values are correct
            for (var currentValueIndex in values) {
                var value = values[currentValueIndex];

                var date:moment.Moment = Clock.getMoment(new Date(value.date).getTime());

                if (this.isInTimeBox(date)) {
                    var dataToEvaluate:any = {};
                    dataToEvaluate[currentSensorName] = value.value;

                    //  Check value by value if internal condition is satisfied
                    if (this.expression.evaluate(dataToEvaluate)) {
                        ++numberOfCorrectValues;
                    }
                }
                else {
                    numberOfValues--;
                }

            }
        }


        this.percentageAchieved = ((numberOfCorrectValues * 100 / numberOfValues) * 100) / this.thresholdRate;

        this.percentageAchieved = (this.percentageAchieved > 100) ? 100 : this.percentageAchieved;

        this.updatePercentageOfTimeElapsed(Clock.getNow());

        return (numberOfCorrectValues * 100 / numberOfValues) >= this.thresholdRate;
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