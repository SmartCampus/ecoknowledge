import GoalDefinition = require('../definition/GoalDefinition');
import User = require('../../user/User');
import BadgeStatus = require('../../Status');
import TimeBox = require('../../TimeBox');

import UUID = require('node-uuid');

class GoalInstance {
    private id:string;
    private goalDefinition:GoalDefinition;

    private description:string;
    private status:BadgeStatus;

    private progress:number;
    private timeBox:TimeBox;

    //  { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapSymbolicNameToSensor:any = {};

    constructor(description:string, goal:GoalDefinition,
                mapGoalToConditionAndSensor:any, timebox:TimeBox = null) {

        this.id = UUID.v4();

        this.description = description;
        this.goalDefinition = goal;
        this.mapSymbolicNameToSensor = mapGoalToConditionAndSensor;

        this.progress = 0;
        this.status = BadgeStatus.WAIT;

        this.timeBox = timebox;

        if (this.timeBox != null && this.timeBox.isInTimeBox(Date.now())) {
                this.status = BadgeStatus.RUN;
        }
    }

    public getDescription():string {
        return this.description;
    }

    public getGoalDefinition():GoalDefinition {
        return this.goalDefinition;
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

    public getProgress():number {
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

        for (var currentSensorIndex in this.mapSymbolicNameToSensor) {
            var currentSensor = this.mapSymbolicNameToSensor[currentSensorIndex];
            result[currentSensor] = null;
        }

        return result;
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

        var numberOfValues = Object.keys(values).length;
        var numberOfValuesNeeded = Object.keys(this.mapSymbolicNameToSensor).length;

        if (numberOfValues < numberOfValuesNeeded) {
            throw new Error("Can not evaluate goal " + this.goalDefinition.getName()
                + "! There are " + numberOfValuesNeeded + " symbolic names needed and only "
                + numberOfValues + " values given");
        }

        var mapSymbolicNameToValue = this.bindSymbolicNameToValue(values);

        var result = this.goalDefinition.evaluate(mapSymbolicNameToValue);
        return result;
    }

    private bindSymbolicNameToValue(mapSensorToValue:any) {
        var result:any = {};

        for (var currentSymbolicName in this.mapSymbolicNameToSensor) {
            var currentSensorName = this.mapSymbolicNameToSensor[currentSymbolicName];
            var currentSensorToValue = mapSensorToValue[currentSensorName];

            result[currentSymbolicName] = currentSensorToValue;
        }

        return result;
    }
}

export = GoalInstance;