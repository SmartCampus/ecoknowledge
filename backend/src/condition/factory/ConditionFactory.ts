import Condition = require('../Condition');
import GoalExpression = require('../expression/GoalExpression');
import OverallGoalCondition = require('../OverallGoalCondition');
import AverageOnValue = require('../AverageOnValue');
import ExpressionFactory = require('./ExpressionFactory');
import Clock = require('../../Clock');

class ConditionFactory {
    private expressionFactory:ExpressionFactory = new ExpressionFactory();

    public createCondition(data:any, goalTimeBox:any, duration:number):Condition {
        var type:string = data.type;
        var expression = null;
        switch (type) {
            case 'overall':
                expression = this.createOverall(data, goalTimeBox, duration);
                break;
            case 'comparison':
                expression = this.createComparison(data);
                break;
            default:
                throw new Error('Can not build condition with type ' + type);
        }

        return expression;
    }

    public createOverall(data:any, goaltimeBox:any, duration:number):Condition {

        data.expression.timeBox = goaltimeBox;

        var goalCondition:GoalExpression = this.expressionFactory.createExpression(data.expression);

        var startDateOfValidityPeriod:Date = new Date(goaltimeBox.startDate);
        var endDateOfValidityPeriod:Date = new Date(goaltimeBox.endDate);

        var threshold:number = data.threshold;

        //  TODO date can be replaced by null => a goal definition is not a goal instance
        var overallCondition:OverallGoalCondition = new OverallGoalCondition(null, goalCondition, threshold, startDateOfValidityPeriod, new Date(Clock.getNow()),endDateOfValidityPeriod);
        return overallCondition;
    }

    public createComparison(data:any):Condition {
        var goalExpression:GoalExpression = this.expressionFactory.createExpression(data.expression);

        var averageOnValue:AverageOnValue = new AverageOnValue(null, goalExpression, data.threshold, data.startDate, data.dateOfCreation, data.endDate);
        return averageOnValue;
    }

}

export = ConditionFactory;