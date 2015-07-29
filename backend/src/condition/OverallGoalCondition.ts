import _GoalExpression = require('./expression/GoalExpression');
import _Condition = require('./Condition');
import Clock = require('../Clock');

class OverallGoalCondition extends _Condition{


    constructor(id:string, condition:_GoalExpression, thresholdRate:number,
                startDate:Date, dateOfCreation:Date, endDate:Date,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0) {

        super(id,condition,thresholdRate,startDate,dateOfCreation,endDate,
            percentageAchieved,percentageOfTimeElapsed);
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
        var conditionDesc:any = this.expression.getRequired();

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

                var date:Date = new Date(value.date);

                if (this.isInTimeBox(date)) {
                    var dataToEvaluate:any = {};
                    dataToEvaluate[currentSensorName] = value;

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
}

export = OverallGoalCondition;