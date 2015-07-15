import GoalCondition = require('./GoalCondition');
import Expression = require('./Expression');
import TimeBox = require('../../TimeBox');

class OverallGoalCondition implements Expression {
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
        this.condition = condition;

        //  Set the timeBox of the internal condition
        var timeBox:TimeBox = new TimeBox(startDate.getTime(), endDate.getTime());
        this.condition.setTimeBox(timeBox);

        this.thresholdRate = thresholdRate;
    }

    public updateDurationAchieved(currentDate:number) {
        console.log("Current date", new Date(currentDate));
        var duration = this.condition.getEndDateInMillis() - this.condition.getStartDateInMillis();

        var durationAchieved = (currentDate - this.condition.getStartDateInMillis()) * 1000;
        
        console.log("DURATION", duration);
        console.log("DURATION ACHIEVED", durationAchieved);

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

        this.percentageOfTime = durationAchieved * 100 / duration;
        console.log("PERCENTAGE OF TIME", this.percentageOfTime);
    }

    public setTimeBox(newTimeBox:TimeBox){
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
        console.log("Evaluate overall", this.condition.getDescription(), "with", JSON.stringify(data));

        var conditionDesc:any = this.condition.getRequired();

        console.log("Required by condition : ", conditionDesc);

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

                var dataToEvaluate:any = {};
                dataToEvaluate[currentSensorName] = {values: [value]};

                //  Check value by value if internal condition is satisfied
                if (this.condition.evaluate(dataToEvaluate)) {
                    ++numberOfCorrectValues;
                }
            }
        }


        this.percentageAchieved = numberOfCorrectValues * 100 / numberOfValues;
        console.log("PERCENTAGE ACHIEVED", this.percentageAchieved);
        this.updateDurationAchieved(Date.now());

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
        console.log("LOOOOOOOOOOL", this.percentageAchieved);

        return {
            description: this.condition.getDescription() + ' ' + this.thresholdRate + '% du temps',
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