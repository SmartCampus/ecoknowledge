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

    private progress:any[] = [];
    private progressDescription:any = {};
    private percentageOfTime:number = 0;

    //  { A_CONDITION_ID : { symbolic_name: tmp_cli, timeBox: { startDate:..., endDate } } }
    private mapConditionIDToSensorAndTimeBoxRequired:any = {};


    //  { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapSymbolicNameToSensor:any = {};
    private user:User;


    constructor(id:string, goal:Goal, user:User, startDate:moment.Moment, endDate:moment.Moment, mapConditionIDToSensorAndTimeBoxRequired:any) {

        this.id = id;

        this.startDate = startDate;
        this.endDate = endDate;

        this.goal = goal;

        this.user = user;

        this.mapConditionIDToSensorAndTimeBoxRequired = mapConditionIDToSensorAndTimeBoxRequired;
        this.mapSymbolicNameToSensor = this.user.getMapSymbolicNameToSensor();
    }

    getConditionDescriptionByID(conditionID:string) {
        return this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];
    }

    public updateDurationAchieved(currentDate:number) {

        var current:moment.Moment = Clock.getMoment(currentDate);

        if (current.isBefore(this.startDate)) {
            throw new Error('Time given is before dateOfCreation !');
        }

        var duration:number = this.endDate.valueOf() - this.startDate.valueOf();
        var durationAchieved:number = current.valueOf() - this.startDate.valueOf();
        this.percentageOfTime = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        this.percentageOfTime = (this.percentageOfTime > 100) ? 100 : this.percentageOfTime;
    }

    getUser():User {
        return this.user;
    }

    isFinished():boolean {
        return this.getTimeProgress() >= 100;
    }

    getTimeProgress():number {
        return this.percentageOfTime;
    }

    resetProgress() {
        this.progress = [];
    }

    addProgressByCondition(conditionID:string, percentageAchieved:number) {
        this.progressDescription[conditionID] = percentageAchieved;
    }

    getGlobalProgression():number {
        var globalProgression:number = 0;

        for (var currentConditionID in this.progressDescription) {
            var currentConditionProgression = this.progressDescription[currentConditionID];
            globalProgression += currentConditionProgression;
        }

        return globalProgression / (Object.keys(this.progressDescription)).length;
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

    getId():string {
        return this.id;
    }

    hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    getProgress():any {
        this.progress['global'] = this.getGlobalProgression();
        return this.progress;
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

    getSensors():any {

        for(var conditionID in this.mapConditionIDToSensorAndTimeBoxRequired) {
            var sensors:string[] = [];

            var currentConditionDescription = this.mapConditionIDToSensorAndTimeBoxRequired[conditionID];
            var symbolicNames:string[] = currentConditionDescription.symbolicNames;
            for(var symbolicNamesIndex in symbolicNames) {
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

    /**
     *
     * @param values
     *
     *  - describing a required of a condition
     *  {
     *      'name' : <string>           - symbolic name of the required field, eg : 'Temp_cli',
     *      'sensor' : 'sensor_id ',    - sensor id bound to achieve current goal condition, eg : 'AC_443',
     *      'value' : <number>          - current value of specified sensor
     *  }
     * @returns {boolean}
     */
    evaluate(values:any):boolean {
        console.log('evaluate de challenge');
        //  Check if badge is running. If Waiting or failed, it must be left unchanged
        if (this.status != BadgeStatus.RUN) {
            return false;
        }

        this.resetProgress();

        this.updateDurationAchieved(Clock.getNow());
        var numberOfValues = Object.keys(values).length;
        var numberOfValuesNeeded = Object.keys(this.mapSymbolicNameToSensor).length;

        if (numberOfValues < numberOfValuesNeeded) {
            throw new Error("Can not evaluate goal " + this.goal.getName()
                + "! There are " + numberOfValuesNeeded + " symbolic names needed and only "
                + numberOfValues + " values given");
        }

        var mapSymbolicNameToValue = this.bindSymbolicNameToValue(values);


        // TODO
        //  Il faut ajouter une indirection
        //  MapSymbolicNameTOValue ne fait que TMP_CLI => [val1, val2]
        //  Il faut en fait faire CONDITION_ID => { TMP_CLI => [val1] }
        //  Seul moyen pour que ça fonctionne !
        //  Le merge de timebox s'est fait ; il faut rajouter un
        // "isInTimeBox" dans bindSNTV pour reconstuire le schéma
        //  cID => SN => Vals





        var resultEval = this.goal.evaluate(mapSymbolicNameToValue, this);

        if (resultEval && this.percentageOfTime >= 100) {
            this.status = BadgeStatus.SUCCESS;
            console.log('success!');
            return true;
        } else if (this.percentageOfTime >= 100) {
            this.status = BadgeStatus.FAIL;
            console.log('Fail!');
        } else {
            console.log('run');
            this.status = BadgeStatus.RUN;
        }
        return false;
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



    getDataInJSON():any {
        console.log('time progress : ', this.percentageOfTime);
        return {
            id: this.id,
            startDate: this.startDate,
            endDate: this.endDate,
            goal: this.goal.getUUID(),
            user: this.user.getUUID()
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
