/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Condition = require('../Condition');
import GoalExpression = require('../expression/GoalExpression');
import OverallGoalCondition = require('../OverallGoalCondition');
import AverageOnValue = require('../AverageOnValue');
import ExpressionFactory = require('./ExpressionFactory');
import Clock = require('../../Clock');
import Filter = require('../../filter/Filter');
import ReferencePeriod = require('../ReferencePeriod');

class ConditionFactory {
    private expressionFactory:ExpressionFactory = new ExpressionFactory();

    public createCondition(data:any):Condition {
        var type:string = data.type;
        var expression = null;
        switch (type) {
            case 'overall':
                expression = this.createOverall(data);
                break;
            case 'comparison':
                expression = this.createComparison(data);
                break;
            default:
                throw new Error('Can not build condition with type ' + type);
        }

        return expression;
    }

    public createOverall(data:any):Condition {


        var goalExpression:GoalExpression = this.expressionFactory.createExpression(data.expression);

        var threshold:number = data.threshold;

        var dayOfWeekFilterDesc:string = data.filter.dayOfWeekFilter;
        var periodOfDayFilterDesc:string[] = data.filter.periodOfDayFilter;

        var filter:Filter = new Filter(dayOfWeekFilterDesc, periodOfDayFilterDesc);
        var overallCondition:OverallGoalCondition = new OverallGoalCondition(null, '', goalExpression, threshold, filter);
        return overallCondition;
    }

    public createComparison(data:any):Condition {
        var dayOfWeekFilterDesc:string = data.filter.dayOfWeekFilter;
        var periodOfDayFilterDesc:string[] = data.filter.periodOfDayFilter;
        var filter:Filter = new Filter(dayOfWeekFilterDesc, periodOfDayFilterDesc);

        var referencePeriodDesc = data.referencePeriod;
        var referencePeriod:ReferencePeriod = new ReferencePeriod(referencePeriodDesc.numberOfUnitToSubtract, referencePeriodDesc.unitToSubtract);

        var goalExpression:GoalExpression = this.expressionFactory.createExpression(data.expression);
        var averageOnValue:AverageOnValue = new AverageOnValue(null, '', goalExpression, data.threshold, filter, referencePeriod);
        return averageOnValue;
    }

}

export = ConditionFactory;