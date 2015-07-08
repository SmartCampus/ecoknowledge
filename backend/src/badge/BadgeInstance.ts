import Goal = require('../goal/Goal');
import User = require('../user/User');
import BadgeStatus = require('./BadgeStatus');
import BadgeDefinition = require('./BadgeDefinition');

import TimeBox = require('../TimeBox');

import UUID = require('node-uuid');

class BadgeInstance {
    private badgeDef:BadgeDefinition;
    private id:string;
    private progress:number;
    private user:User;
    private status:BadgeStatus;

    private timeBox:TimeBox;

    //  mapGoalToConditionAndSensor.goalID -> { 'tmp_cli':'ac_443', 'tmp_ext':'TEMP_444', 'door_o':'D_55', ... }
    private mapGoalToConditionAndSensor:any = {};

    constructor(name:string, description:string, points:number,
                goals:Goal[], user:User, mapGoalToConditionAndSensor:any, timebox:TimeBox = null) {
        this.badgeDef = new BadgeDefinition(name, description, points, goals);
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

    public getObjectives():Goal[] {
        return this.badgeDef.getObjectives();
    }

    public getPoints():number {
        return this.badgeDef.getPoints();
    }

    public getDescription():string {
        return this.badgeDef.getDescription();
    }

    public getName():string {
        return this.badgeDef.getName();
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
     * @param newMapGoalToConditionAndSensor
     *
     * {
     *      '<goalID>' :
     *          {
     *              '<name of sensor:string>' : '<value of sensor:number>'
     *           }
     * }
     *
     * @returns {boolean}
     */
    public evaluate(newMapGoalToConditionAndSensor:any):boolean {
        var convertedMap:any = this.bindConditionNameToValue(newMapGoalToConditionAndSensor);

        console.log("EVALUATE RES", JSON.stringify(convertedMap));

        return this.badgeDef.evaluate(convertedMap);
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
;

export = BadgeInstance;