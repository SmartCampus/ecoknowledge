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

        var startDateOfValidityPeriod:moment.Moment = Clock.getMoment(new Date(goaltimeBox.startDate).getTime());
        var endDateOfValidityPeriod:moment.Moment = Clock.getMoment(new Date(goaltimeBox.endDate).getTime());

        var threshold:number = data.threshold;

        var dayOfWeekFilterDesc:string = data.filter.dayOfWeekFilter;
        var periodOfDayFilterDesc:string[] = data.filter.periodOfDayFilter;

        var filter:Filter = new Filter(dayOfWeekFilterDesc, periodOfDayFilterDesc);

        var overallCondition:OverallGoalCondition = new OverallGoalCondition(null, goalCondition, threshold, startDateOfValidityPeriod, Clock.getMoment(Clock.getNow()), endDateOfValidityPeriod, 0, 0, filter);
        return overallCondition;
    }

    public createComparison(data:any):Condition {
        var goalExpression:GoalExpression = this.expressionFactory.createExpression(data.expression);
        var averageOnValue:AverageOnValue = new AverageOnValue(null, goalExpression, data.threshold, data.startDate, data.dateOfCreation, data.endDate,Clock.getMoment(new Date(data.expression.periodOfTime).getTime()));
        return averageOnValue;
    }

}

export = ConditionFactory;