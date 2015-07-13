import GoalCondition = require('./GoalCondition');

class AverageOnCondition {
    constructor(private condition:GoalCondition, private startDate:Date,private dateOfCreation:Date, private endDate:Date, private thresholdRate:number) {}


}

export = AverageOnCondition;