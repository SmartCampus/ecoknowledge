/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import uuid = require('node-uuid');

import Condition = require('../condition/Condition');
import Challenge = require('../challenge/UserChallenge');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');
import RecurringSession = require('./RecurringSession');


class Goal {
    private id;
    private name:string;
    private badgeID:string;

    private conditionsArray:Condition[] = [];

    private beginningOfValidityPeriod:moment.Moment;
    private endOfValidityPeriod:moment.Moment;

    private recurringSession:RecurringSession;

    constructor(id:string, name:string, badgeID:string, beginningOfValidityPeriod:moment.Moment,
                endOfValidityPeriod:moment.Moment, recurringSession:RecurringSession) {
        this.id = id;
        this.name = name;
        this.badgeID = badgeID;
        

        this.beginningOfValidityPeriod = beginningOfValidityPeriod;
        this.endOfValidityPeriod = endOfValidityPeriod;

        this.recurringSession = recurringSession;
    }


    getBeginningOfValidityPeriod():moment.Moment {
        return this.beginningOfValidityPeriod;
    }

    getEndOfValidityPeriod():moment.Moment {
        return this.endOfValidityPeriod;
    }

    getStartDateOfSession(now) {
        return this.recurringSession.getCurrentSessionStart(now);
    }

    getEndDateOfSession(now) {
        return this.recurringSession.getCurrentSessionEnd(now);
    }

    getBadgeID() {
        return this.badgeID;
    }

    getUUID() {
        return this.id;
    }

    hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    setUUID(aUUID) {
        this.id = aUUID;
    }


    getName():string {
        return this.name;
    }

    public addCondition(condition:Condition) {
        this.conditionsArray.push(condition);
    }

    public evaluate(data:any, challenge:Challenge):any {

        var result:any = {};

        var numberOfConditions:number = 0;
        var numberOfConditionsAchieved:number = 0;

        var globalPercentageAchieved:number = 0;

        var achieved:boolean = true;

        var conditionsDescription:any[] =[];

        for (var i = 0; i < this.conditionsArray.length; i++) {
            var currentCondition:Condition = this.conditionsArray[i];

            var currentConditionDescription:any = data[currentCondition.getID()];
            var currentConditionState = currentCondition.evaluate(currentConditionDescription.values, currentConditionDescription);
            conditionsDescription.push(currentConditionState);

            achieved = achieved && currentConditionState.achieved;
            globalPercentageAchieved += currentConditionState.percentageAchieved;

            result[currentCondition.getID()] = currentConditionState;

            numberOfConditions++;
            numberOfConditionsAchieved = (currentConditionState.achieved)?numberOfConditionsAchieved+1 : numberOfConditionsAchieved;
        }

        result['conditions'] = conditionsDescription;

        var percentageAchieved:number = (globalPercentageAchieved) / numberOfConditions;
        result['percentageAchieved'] = percentageAchieved;
        result['achieved'] = achieved;

        return result;
    }

    public getRequired(startDateOfChallenge, endDateOfChallenge):any {

        var result:any = {};
        for(var conditionIndex in this.conditionsArray) {
            var currentCondition = this.conditionsArray[conditionIndex];
            var currentConditionID = currentCondition.getID();
            var currentConditionRequired = currentCondition.getRequiredByCondition(startDateOfChallenge, endDateOfChallenge);
            result[currentConditionID] = currentConditionRequired;
        }


        return result;
    }

    public getConditions():Condition[] {
        return this.conditionsArray;
    }

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            timeBox: {
                startDate: this.beginningOfValidityPeriod,
                endDate: this.endOfValidityPeriod
            },
            duration: this.recurringSession.getDescription(),
            conditions: this.getDataOfConditionsInJSON(),
            badgeID: this.badgeID
        }
    }

    public getDataOfConditionsInJSON():any {
        var result:any[] = [];

        for (var i = 0; i < this.conditionsArray.length; i++) {
            result.push(this.conditionsArray[i].getDataInJSON());
        }

        return result;
    }


    getStringRepresentation():string {
        return '\n#' + this.id + '\t' + this.name + '\n-\t' + this.beginningOfValidityPeriod.toISOString() + ' :: ' + this.endOfValidityPeriod.toISOString() + '\n' +
            ' - Récurrent : ' + this.recurringSession.getDescription() + '\n' + this.getStringRepresentationOfCondition();
    }


    getStringRepresentationOfCondition():string {
        var result:string = '';

        for(var currentConditionIndex in this.conditionsArray) {
            var currentCondition = this.conditionsArray[currentConditionIndex];
            result += '\t|\t\t' + currentCondition.getStringRepresentation();
        }

        return result;
    }
}

export = Goal;
