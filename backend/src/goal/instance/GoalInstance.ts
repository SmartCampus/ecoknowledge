import GoalDefinition = require('../definition/GoalDefinition');
import User = require('../../user/User');
import BadgeStatus = require('../../Status');
import TimeBox = require('../../TimeBox');

import UUID = require('node-uuid');

class BadgeInstance {
    private description:string;

    private goalDefinition:GoalDefinition;

    private id:string;
    private progress:number;
    private user:User;
    private status:BadgeStatus;

    private timeBox:TimeBox;

    //  mapGoalToConditionAndSensor.goalID -> { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapGoalToConditionAndSensor:any = {};

    constructor(name:string, description:string, points:number,
                goal:GoalDefinition, user:User, mapGoalToConditionAndSensor:any, timebox:TimeBox = null) {
        this.goalDefinition = new GoalDefinition(name);
        //, description, points);

        this.mapGoalToConditionAndSensor = mapGoalToConditionAndSensor;

        this.progress = 0;
        this.id = UUID.v4();
        this.user = user;
        this.status = BadgeStatus.WAIT;

        this.timeBox = timebox;

        if (timebox && timebox.isInTimeBox(Date.now())) {
            this.status = BadgeStatus.RUN;
        }
    }

    public getDescription():string {
        return this.description;
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

    public getUser():User {
        return this.user;
    }

    public getStatus():BadgeStatus {
        return this.status;
    }

    public hasStatus(badgeStatus:BadgeStatus):boolean {
        return this.status === badgeStatus;
    }

    public getSensors():any {
        var result:any = {};

        for (var currentGoalIndex in this.mapGoalToConditionAndSensor) {
            var currentGoalDescription = this.mapGoalToConditionAndSensor[currentGoalIndex];

            var sensorsRequiredDescription:any = {};
            for (var currentSensorIndex in currentGoalDescription) {
                var currentSensor = currentGoalDescription[currentSensorIndex];
                sensorsRequiredDescription[currentSensor] = null;
            }

            result[currentGoalIndex] = sensorsRequiredDescription;
        }

        return result;
    }


    /**
     *
     * @param values
     *
     * {
   *      '<goalID>' :

   *
   *                      -describing a required of a condition
   *                      {
   *                          'name' : <string>           - symbolic name of the required field, eg : 'Temp_cli',
   *                          'sensor' : 'sensor_id ',    - sensor id bound to achieve current goal condition, eg : 'AC_443',
   *                          'value' : <number>          - current value of specified sensor
   *                       }
   * }
     *
     * @returns {boolean}
     */
    public evaluate(values:any):boolean {

        var numberOfGoals = Object.keys(values).length;
        var result = true;

        /*
        if (this.goalDefinition.length != numberOfGoals) {
            throw new Error("Can not evaluate badge " + this.name + "! There are " + this.goalDefinition
                + " objectives to evaluate and only " + numberOfGoals + " values");
        }

        for (var currentGoalUUID in values) {
            var currentGoal:Goal = this.retrieveGoal(currentGoalUUID);
            var currentConditionsDesc:any = values[currentGoalUUID];
            result = result && currentGoal.evaluate(currentConditionsDesc);
        }
        */

        return result;
    }

    private bindConditionNameToValue(newMapGoalToConditionAndSensor:any) {
        var result:any = {};

        for (var currentGoalIndex in this.mapGoalToConditionAndSensor) {
            var currentSymbolicNameToSensorDescription = this.mapGoalToConditionAndSensor[currentGoalIndex];
            var currentSensorToValueDescription = newMapGoalToConditionAndSensor[currentGoalIndex];

            var currentSymbolicNameToValueDescription:any = {};

            for (var currentSymbolicName in currentSymbolicNameToSensorDescription) {
                var currentSensorName = currentSymbolicNameToSensorDescription[currentSymbolicName];
                var currentSensorValue = currentSensorToValueDescription[currentSensorName];

                currentSymbolicNameToValueDescription[currentSymbolicName] = currentSensorValue;
            }
            result[currentGoalIndex] = currentSymbolicNameToValueDescription;
        }

        return result;
    }
}

export = BadgeInstance;