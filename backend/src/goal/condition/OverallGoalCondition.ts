import GoalCondition = require('./GoalCondition');

class OverallGoalCondition {

    constructor(private condition:GoalCondition, private thresholdRate:number) {
    }

    /**
     *
     * @param values
     *  {
     *      <sensor-name:string> : [ <value:number>, ...],
     *      ...
     *  }
     */

    public evaluate(data:any) {
        var sensorNames:string[] = this.condition.getRequired();

        for(var currentSensorName in sensorNames) {
            var values:number[] = data[currentSensorName];

            var numberOfValues:number = Object.keys(values).length;
            var numberOfCorrectValues:number = 0;

            for (var currentValueIndex in values) {
                var dataToEvaluate:any = {};
                dataToEvaluate[currentSensorName] = values[currentValueIndex];

                if (this.condition.evaluate(dataToEvaluate)) {
                    ++numberOfCorrectValues;
                }
            }
        }

        return (numberOfCorrectValues * 100 / numberOfValues) >= this.thresholdRate;
    }
}

export = OverallGoalCondition;