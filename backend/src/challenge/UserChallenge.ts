/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Goal = require('../goal/Goal');
import Badge = require('../badge/Badge');
import User = require('../user/User');
import BadgeStatus = require('../Status');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');

class UserChallenge {
    private id:string;
    private goal:Goal;

    private startDate:moment.Moment;
    private endDate:moment.Moment;

    private status:BadgeStatus;

    private progress:any = {};

    //  { A_CONDITION_ID : { symbolic_name: tmp_cli, timeBox: { startDate:..., endDate } } }
    private mapConditionIDToSensorAndTimeBoxRequired:any = {};


    //  { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapSymbolicNameToSensor:any = {};
    private user:User;

    private takenBy:string;

    constructor(id:string, goal:Goal, user:User, startDate:moment.Moment, endDate:moment.Moment, mapConditionIDToSensorAndTimeBoxRequired:any, takenBy = null) {

        this.id = id;

        this.startDate = startDate;
        this.endDate = endDate;

        this.goal = goal;

        this.user = user;
        this.takenBy = (takenBy == null) ? this.user.getName() : takenBy;

        this.mapConditionIDToSensorAndTimeBoxRequired = mapConditionIDToSensorAndTimeBoxRequired;
        this.mapSymbolicNameToSensor = this.user.getMapSymbolicNameToSensor();

        this.buildRequired();

    }

    getConditionDescriptionByID(conditionID:string) {
        return this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];
    }

    public updateDurationAchieved(currentDate:number):number {

        var current:moment.Moment = Clock.getMoment(currentDate);

        if (current.isBefore(this.startDate)) {
            throw new Error('Time given is before dateOfCreation !');
        }

        var duration:number = this.endDate.valueOf() - this.startDate.valueOf();
        var durationAchieved:number = current.valueOf() - this.startDate.valueOf();
        var percentageOfTime = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        percentageOfTime = (percentageOfTime > 100) ? 100 : percentageOfTime;

        return percentageOfTime;
    }

    getUser():User {
        return this.user;
    }

    getStartDate():moment.Moment {
        return this.startDate;
    }

    getEndDate():moment.Moment {
        return this.endDate;
    }

    getGoal():Goal {
        return this.goal;
    }

    getBadge():string {
        return this.goal.getBadgeID();
    }

    getName():string {
        return this.goal.getName();
    }

    getID():string {
        return this.id;
    }

    hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }


    getStatus():BadgeStatus {
        return this.status;
    }

    hasStatus(badgeStatus:BadgeStatus):boolean {
        return this.status === badgeStatus;
    }

    setStatus(badgeStatus:BadgeStatus) {
        this.status = badgeStatus;
    }

    removeFromInternalUser() {
        this.user.deleteChallenge(this.getID());
    }

    getSensors():any {

        var required:any = {};

        for (var conditionID in this.mapConditionIDToSensorAndTimeBoxRequired) {
            var currentConditionDescription = this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];
            var sensorsOfCurrentCondition = currentConditionDescription.sensors;

            for(var currentSensorIndex in sensorsOfCurrentCondition) {
                var currentSensor:string = sensorsOfCurrentCondition[currentSensorIndex];

                if(required[currentSensor] == null) {
                    required[currentSensor] = currentConditionDescription.timeBox;
                }
                else {
                    var oldTimeBox = required[currentSensor];
                    var oldStartDate:moment.Moment = oldTimeBox.start;
                    var oldEndDate:moment.Moment = oldTimeBox.end;

                    var currentTimeBox = currentConditionDescription.timeBox;
                    var currentStartDate:moment.Moment = currentTimeBox.start;
                    var currentEndDate:moment.Moment = currentTimeBox.end;

                    var newStartDate:moment.Moment = null;
                    var newEndDate:moment.Moment = null;

                    if(currentStartDate.isBefore(oldStartDate)) {
                        newStartDate = currentStartDate;
                    }
                    else {
                        newStartDate = oldStartDate;
                    }

                    if(currentEndDate.isAfter(oldEndDate)) {
                        newEndDate = currentEndDate;
                    }
                    else {
                        newEndDate = oldEndDate;
                    }

                    var newTimeBox:any = {
                        start:newStartDate,
                        end:newEndDate
                    };

                    required[currentSensor] = newTimeBox;
                }
            }

        }

        return this.mapConditionIDToSensorAndTimeBoxRequired;
    }

    private buildRequired():any {

        for (var conditionID in this.mapConditionIDToSensorAndTimeBoxRequired) {
            var sensors:string[] = [];

            var currentConditionDescription = this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];
            var symbolicNames:string[] = currentConditionDescription.symbolicNames;

            for (var symbolicNamesIndex in symbolicNames) {
                var currentSymbolicName = symbolicNames[symbolicNamesIndex];
                var currentSensor = this.mapSymbolicNameToSensor[currentSymbolicName];
                sensors.push(currentSensor);
                currentConditionDescription[currentSensor] = {};
            }

            currentConditionDescription.sensors = sensors;
        }

        return this.mapConditionIDToSensorAndTimeBoxRequired;
    }

    setGoal(goal) {
        this.goal = goal;
    }

    haveToStart(now:moment.Moment):boolean {
        return now.isAfter(this.startDate) && now.isBefore(this.endDate);
    }

    retrieveSymbolicNameFromSensor(sensorName:string):string {
        for(var currentSymbolicName in this.mapSymbolicNameToSensor) {

            var sensorNameBound = this.mapSymbolicNameToSensor[currentSymbolicName];

            if(sensorNameBound == sensorName) {
                return currentSymbolicName;
            }
        }

        return null;
    }

    /**
     *
     * @param values
     * {
     *  <sensor> : [ { date:"time in millis", value:__}, ... ]
     * }
     * @returns {any}
     */
    evaluate(values:any):any {


        for (var conditionID in this.mapConditionIDToSensorAndTimeBoxRequired) {
            var currentConditionDescription = this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];

            currentConditionDescription['values'] = {};

            var sensorsRequired = currentConditionDescription.sensors;
            for(var currentSensorRequiredIndex in sensorsRequired) {
                var currentSensorRequired = sensorsRequired[currentSensorRequiredIndex];
                var symbolicNameBound = this.retrieveSymbolicNameFromSensor(currentSensorRequired);
                currentConditionDescription['values'][symbolicNameBound] = values[currentSensorRequired];
            }

        }

        //  Check if badge is running. If Waiting or failed, it must be left unchanged
        if (this.status != BadgeStatus.RUN) {
            return false;
        }

        var resultEval = this.goal.evaluate(this.mapConditionIDToSensorAndTimeBoxRequired, this);


        var durationAchieved:number = this.updateDurationAchieved(Clock.getNow());
        resultEval['durationAchieved'] = durationAchieved;

        var finished:boolean = (durationAchieved === 100) ? true : false;
        resultEval['finished'] = finished;

        var achieved:boolean = resultEval['achieved'];

        if (achieved && finished) {
            this.status = BadgeStatus.SUCCESS;
            console.log('success!');
            return true;
        } else if (!achieved && finished) {
            this.status = BadgeStatus.FAIL;
            console.log('Fail!');
        } else {
            console.log('run');
            this.status = BadgeStatus.RUN;
        }

        this.progress = resultEval;
        console.log('Résultat de l\'évaluation du challenge : achieved', resultEval.achieved, 'finished', resultEval.finished);

        return resultEval;
    }
    getGlobalProgression():any {
        return this.progress;
    }

    getTimeProgress():any {
        return this.progress['durationAchieved'];
    }

    bindSymbolicNameToValue(mapSensorToValue:any) {
        var result:any = {};

        for (var currentSymbolicName in this.mapSymbolicNameToSensor) {
            var currentSensorName = this.mapSymbolicNameToSensor[currentSymbolicName];
            var currentSensorToValue = mapSensorToValue[currentSensorName];

            result[currentSymbolicName] = currentSensorToValue;
        }

        return result;
    }

    isAPersonalChallenge():boolean {
        return this.takenBy == this.getUser().getName();
    }

    getDataInJSON():any {
        return {
            id: this.id,
            startDate: this.startDate,
            endDate: this.endDate,
            goalID: this.goal.getUUID(),
            userID: this.user.getUUID(),
            takenBy:this.takenBy,
            mapConditionIDToSensorAndTimeBoxRequired: this.mapConditionIDToSensorAndTimeBoxRequired,
            progress: this.progress
        }
    }

    getDataForClient():any {

        var type = (this.takenBy == this.user.getName()) ? 'personal' : 'team';

        return {
            id: this.id,
            type:type,
            startDate: this.startDate,
            endDate: this.endDate,
            goal: this.goal.getName(),
            user: this.user.getName(),
            takenBy:this.takenBy,
            progress: this.progress,
            status:this.status
        }
    }


    private getStatusAsString():string {
        switch (this.status) {
            case 0:
                return 'WAIT';
                break;
            case 1:
                return 'RUNNING';
                break;
            case 2:
                return 'SUCCESS';
                break;
            case 3:
                return 'FAIL';
                break;
            default:
                return 'UNKNOWN';
                break;
        }
    }
}

export = UserChallenge;
