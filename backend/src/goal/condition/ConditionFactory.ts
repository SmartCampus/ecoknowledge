import Expression = require('./Expression');
import GoalCondition = require('./GoalCondition');
import OverallGoalCondition = require('./OverallGoalCondition');
import AverageOnValue = require('./AverageOnValue');
import ExpressionFactory = require('./ExpressionFactory');

class ConditionFactory {
    private expressionFactory:ExpressionFactory = new ExpressionFactory();

    public createCondition(data:any, goalTimeBox:any, duration:number):Expression {
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

    public createOverall(data:any, goaltimeBox:any, duration:number):Expression {
        var goalCondition:GoalCondition = this.expressionFactory.createExpression(data.expression);

        var startDateOfValidityPeriod:Date = new Date(goaltimeBox.startDate);
        var endDateOfValidityPeriod:Date = new Date(goaltimeBox.endDate);

        var threshold:number = data.threshold;

        //  TODO date can be replaced by null => a goal definition is not a goal instance
        var overallCondition:OverallGoalCondition = new OverallGoalCondition(goalCondition, startDateOfValidityPeriod, endDateOfValidityPeriod, threshold);
        return overallCondition;
    }

    public createComparison(data:any):Expression {
        var goalCondition:GoalCondition = this.expressionFactory.createExpression(data.expression);

        var averageOnValue:AverageOnValue = new AverageOnValue(goalCondition, null, null, null, data.threshold);
        return averageOnValue;
    }
}

export = ConditionFactory;