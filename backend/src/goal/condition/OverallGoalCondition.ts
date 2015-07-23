import GoalCondition = require('./GoalCondition');
import Expression = require('./Expression');
import TimeBox = require('../../TimeBox');
import Clock = require('../../Clock');

var OverallGoalConditionSchema:any = require('../../database/models/overallGoalCondition.js').schema;
import ModelItf = require('../../ModelItf');

class OverallGoalCondition extends ModelItf implements Expression {
    private condition:GoalCondition;
    private thresholdRate:number;

    private percentageAchieved:number = 0;
    private percentageOfTime:number = 0;

    /**
     *
     * @param condition
     *      The condition object, for instance 'TMP_Cli > 25'
     * @param thresholdRate
     *      This value represents the threshold rate when the condition must be verified
     * @param startDate
     *      The start of the application of the current condition - the start date of the goal instance
     * @param endDate
     *      The end of the application of the current condition - the end date of the goal instance
     */
    constructor(condition:GoalCondition, startDate:Date, endDate:Date, thresholdRate:number = 100) {
        super();
        this.condition = condition;

        //  Set the timeBox of the internal condition
        var timeBox:TimeBox = new TimeBox(startDate.getTime(), endDate.getTime());
        this.condition.setTimeBox(timeBox);

        this.thresholdRate = thresholdRate;
    }

    public updateDurationAchieved(currentDate:number) {
        var duration = this.condition.getEndDateInMillis() - this.condition.getStartDateInMillis();

        var durationAchieved = (currentDate - this.condition.getStartDateInMillis()) * 1000;

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

        this.percentageOfTime = durationAchieved * 100 / duration;
    }

    public toJSONObject():any {
        return {
            condition: this.condition,
            thresholdRate: this.thresholdRate,
            percentageAchieved: this.percentageAchieved,
            percentageOfTime: this.percentageOfTime,
            startDate: this.condition.getStartDateInMillis(),
            endDate: this.condition.getEndDateInMillis()
        }
    }

    static fromJSONObject(jsonObject:any) {
        console.log("FROM JSON WITH", JSON.stringify(jsonObject));
        return new OverallGoalCondition(
            jsonObject.condition,
            new Date(jsonObject.startDate),
            new Date(jsonObject.endDate),
            jsonObject.thresholdRate);
    }

    create(successCallback:Function, failCallback:Function) {
        console.log("CREATE GOAL CONDITION");
        var self = this;

        if (!this.hasBeenSaved()) {
            OverallGoalConditionSchema.create(this.toJSONObject())
                .then(function (_overallConditionSequelize) {
                    self._selfSequelize = _overallConditionSequelize;

                    console.log("xxxxxxxxxxxxxxxx\n", _overallConditionSequelize.dataValues);

                    var successCallBackInitFields = function (_conditionSequelize) {
                        var uObject = OverallGoalCondition.fromJSONObject(_overallConditionSequelize.dataValues);
                        _overallConditionSequelize.setCondition(_conditionSequelize);
                        self._id = uObject.getId();
                        successCallback(_overallConditionSequelize);
                    };

                    var failCallBackInitFields = function (_conditionSequelize) {
                        failCallback(_overallConditionSequelize);
                    };

                    self.condition.create(successCallBackInitFields, failCallBackInitFields);
                })
                .error(function (error) {
                    console.log("ERROR ON CREATE GOAL CONDITION");
                    failCallback(error);
                });
        } else {
            failCallback(new ModelException("Condition already exists."));
        }
    }

    static read(id : number, successCallback : Function, failCallback : Function) {
        // search for known ids
        OverallGoalConditionSchema.findById(id, { include: [{ all: true }]})
            .then(function(_conditionSequelize) {
                var overallGoalCondition:OverallGoalCondition = OverallGoalCondition.fromJSONObject(_conditionSequelize.dataValues);

                var goalCondition:GoalCondition = GoalCondition.fromJSONObject(_conditionSequelize.condition);
                overallGoalCondition.setCondition(goalCondition);

                successCallback(goalCondition);
            })
            .error(function(error) {
                failCallback(error);
            });
    }

    public setCondition(goalCondition:GoalCondition) {
        this.condition = goalCondition;
    }

    public setTimeBox(newTimeBox:TimeBox) {
        this.condition.setTimeBox(newTimeBox);
    }

    public getDurationAchieved():number {
        return this.percentageOfTime;
    }

    /**
     *
     * @returns {string[]}
     *      see GoalCondition#getRequired
     */
    public getRequired() {
        return this.condition.getRequired();
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
        var conditionDesc:any = this.condition.getRequired();

        //  For each sensors required by internal condition
        for (var currentSensorName in conditionDesc) {

            //  Retrieve values associated
            var currentConditionDesc = data[currentSensorName];

            var values:any[] = currentConditionDesc.values;

            var numberOfValues:number = (values).length;
            var numberOfCorrectValues:number = 0;

            //  Check how many values are correct
            for (var currentValueIndex in values) {
                var value = values[currentValueIndex];

                var date:Date = new Date(value.date * 1000);

                if (this.condition.checkTimeBox(date)) {
                    var dataToEvaluate:any = {};
                    dataToEvaluate[currentSensorName] = {values: [value]};

                    //  Check value by value if internal condition is satisfied
                    if (this.condition.evaluate(dataToEvaluate)) {
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

        this.updateDurationAchieved(Clock.getNow());

        return (numberOfCorrectValues * 100 / numberOfValues) >= this.thresholdRate;
    }

    private retrieveValues(data:any, values:number[]) {
        var valuesDesc = data.values;

        for (var currentValueDescIndex in valuesDesc) {
            var currentValueDesc = valuesDesc[currentValueDescIndex];
            values.push(currentValueDesc.value);
        }
    }

    public getData():any {
        return {
            description: this.condition.getStringRepresentation() + ' ' + this.thresholdRate + '% du temps',
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
        return '';
    }
}

export = OverallGoalCondition;