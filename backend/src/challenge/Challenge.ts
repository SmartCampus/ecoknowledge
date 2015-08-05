import UUID = require('node-uuid');

import Goal = require('../goal/Goal');
import Badge = require('../badge/Badge');
import User = require('../user/User');
import BadgeStatus = require('../Status');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');

class Challenge {
    private id:string;
    private goalDefinition:Goal;

    private startDate:Date;
    private endDate:Date;

    private description:string;
    private status:BadgeStatus;

    private progress:any[] = [];

    private percentageOfTime:number = 0;

    //  { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapSymbolicNameToSensor:any = {};

    constructor(startDate:Date, endDate:Date, description:string, goal:Goal,
                mapGoalToConditionAndSensor:any, id = null) {


        this.id = (id) ? id : UUID.v4();
        this.description = description;

        this.startDate = startDate;
        this.endDate = endDate;

        this.goalDefinition = goal;
        this.goalDefinition.setTimeBoxes(new TimeBox(startDate, endDate));

        this.mapSymbolicNameToSensor = mapGoalToConditionAndSensor;

        this.status = BadgeStatus.RUN;
    }

    public updateDurationAchieved(currentDate:number) {
        var duration = this.endDate.getTime() - this.startDate.getTime();
        var durationAchieved = (currentDate - this.startDate.getTime());

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

        this.percentageOfTime = durationAchieved * 100 / duration;

        //  It can have tiny incorrect decimal values
        this.percentageOfTime = (this.percentageOfTime > 100) ? 100 : this.percentageOfTime;

    }

    public getTimeProgress():number {
        return this.percentageOfTime;
    }

    public resetProgress() {
        this.progress = [];
    }

    public addProgress(progressDescription:any) {
        this.progress.push(progressDescription);
    }

    public getStartDate():Date {
        return this.startDate;
    }

    public getEndDate():Date {
        return this.endDate;
    }

    public getDescription():string {
        return this.description;
    }

    public getGoalDefinition():Goal {
        return this.goalDefinition;
    }

    public getBadge():string {
        return this.goalDefinition.getBadgeID();
    }

    public getName():string {
        return this.goalDefinition.getName();
    }

    public getId():string {
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public getProgress():any {
        return this.progress;
    }

    public getStatus():BadgeStatus {
        return this.status;
    }

    public hasStatus(badgeStatus:BadgeStatus):boolean {
        return this.status === badgeStatus;
    }

    public getSensors():any {

        var result:any = {};

        for (var currentSymbolicName in this.mapSymbolicNameToSensor) {
            var currentSensor = this.mapSymbolicNameToSensor[currentSymbolicName];
            result[currentSensor] = this.goalDefinition.getRequired()[currentSymbolicName];
        }

        return result;
    }

    setGoal(goal) {
        this.goalDefinition = goal;
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
    public evaluate(values:any):boolean {

        //  Check if badge is running. If Waiting or failed, it must be left unchanged
        if(this.status != BadgeStatus.RUN) {
            return false;
        }


        this.updateDurationAchieved(Clock.getNow());
        var numberOfValues = Object.keys(values).length;
        var numberOfValuesNeeded = Object.keys(this.mapSymbolicNameToSensor).length;

        if (numberOfValues < numberOfValuesNeeded) {
            throw new Error("Can not evaluate goal " + this.goalDefinition.getName()
                + "! There are " + numberOfValuesNeeded + " symbolic names needed and only "
                + numberOfValues + " values given");
        }

        var mapSymbolicNameToValue = this.bindSymbolicNameToValue(values);

        var resultEval = this.goalDefinition.evaluate(mapSymbolicNameToValue, this);

        if (resultEval && this.percentageOfTime >= 100) {
            this.status = BadgeStatus.SUCCESS;
            console.log('success!');
            return true;
        } else if (this.percentageOfTime >= 100) {
            this.status = BadgeStatus.FAIL;
            console.log('Fail!');
        } else {
            this.status = BadgeStatus.RUN;
        }
        return false;
    }

    public bindSymbolicNameToValue(mapSensorToValue:any) {
        var result:any = {};

        for (var currentSymbolicName in this.mapSymbolicNameToSensor) {
            var currentSensorName = this.mapSymbolicNameToSensor[currentSymbolicName];
            var currentSensorToValue = mapSensorToValue[currentSensorName];

            result[currentSymbolicName] = currentSensorToValue;
        }

        return result;
    }

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.getName(),
            timeProgress: this.percentageOfTime,
            startDate: this.startDate,
            endDate: this.endDate,
            goal: {
                id: this.goalDefinition.getUUID(),
                conditions: this.mapSymbolicNameToSensor
            },
            progress: this.progress,
            status: this.getStatusAsString()
        }
    }


    private getStatusAsString():string {
        switch(this.status){
            case 0: return 'WAIT'; break;
            case 1: return 'RUNNING'; break;
            case 2: return 'SUCCESS'; break;
            case 3: return 'FAIL'; break;
            default: return 'UNKNOWN'; break;
        }
    }
}

export = Challenge;
