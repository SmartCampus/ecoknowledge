import GoalCondition = require('./GoalCondition');

class AverageOnValue {
    constructor(private condition:GoalCondition, private startDate:Date, private dateOfCreation:Date, private endDate:Date, private thresholdRate:number) {
    }

    public evaluate(data:any):boolean {
        var sensorNames:string[] = this.condition.getRequired();

        var result = true;
        for (var currentSensorName in sensorNames) {
            var oldAndNewData = data[currentSensorName];

            var oldDataKey:string = this.startDate.getTime() + '-' + this.dateOfCreation.getTime();
            var oldData = oldAndNewData[oldDataKey];

            var newDataKey:string = this.dateOfCreation.getTime() + '-' + this.endDate.getTime();
            var newData = oldAndNewData[newDataKey];

            var oldAverage = this.computeAverageValues(oldData);
            var newAverage = this.computeAverageValues(newData);

            result = result && (oldAverage * (1 - this.thresholdRate / 100) >= newAverage);
        }

        return result;
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