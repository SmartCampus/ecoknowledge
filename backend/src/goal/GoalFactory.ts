/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Goal = require('./Goal');
import ConditionFactory = require('../condition/factory/ConditionFactory');
import BadArgumentException = require('../exceptions/BadArgumentException');
import RecurringSession = require('./RecurringSession');
import Clock = require('../Clock');

class GoalFactory {

    private conditionFactory:ConditionFactory;

    constructor() {
        this.conditionFactory = new ConditionFactory();
    }

    public createGoal(data:any):Goal {
        var goalName:string = data.name;

        var startDateOfValidityPeriod:moment.Moment = Clock.getMoment(new Date(data.timeBox.startDate).valueOf());
        var endDateOfValidityPeriod:moment.Moment = Clock.getMoment(new Date(data.timeBox.endDate).valueOf());


        var durationAllowedDesc:string = data.duration;
        var durationAllowed:number = 0;

        switch (durationAllowedDesc) {
            case 'day':
                durationAllowed = 1;
                break;
            case 'week' :
                durationAllowed = 7;
                break;
            case 'month' :
                durationAllowed = 30;
                break;
            default :
                throw new BadArgumentException('Can not build goal. Given duration allowed' + durationAllowedDesc + ' is unknown');
        }


        var badge:string = data.badgeID;
        var goalID:string = data.id;

        var recurringType = new RecurringSession(durationAllowedDesc);

        var newGoal:Goal = new Goal(goalName, startDateOfValidityPeriod, endDateOfValidityPeriod,
            durationAllowed, badge, goalID,recurringType);

        var goalConditions:any[] = data.conditions;
        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.conditionFactory.createCondition(goalConditions[i], data.timeBox, durationAllowed);
            newGoal.addCondition(currentExpression);
        }
        //  console.log("Creation de l'objectif", goalName, "valide du", startDateOfValidityPeriod, "au", endDateOfValidityPeriod, "avec le badge", newGoal.getBadgeID());

        return newGoal;
    }
}

export = GoalFactory;