/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Goal = require('./Goal');
import ConditionFactory = require('../condition/factory/ConditionFactory');
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
        var durationAllowed:number = data.duration;

        var badge:string = data.badgeID;
        var goalID:string = data.id;

        var newGoal:Goal = new Goal(goalName, startDateOfValidityPeriod, endDateOfValidityPeriod,
            durationAllowed, badge, goalID);

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