import Goal = require('../goal/Goal');
import User = require('../user/User');
import BadgeStatus = require('./BadgeStatus');
import BadgeDefinition = require('./BadgeDefinition');
import UUID = require('node-uuid');

class BadgeInstance {
    private badgeDef:BadgeDefinition;
    private id:string;
    private progress:number;
    private user:User;
    private status:BadgeStatus;

    //  mapGoalToConditionAndSensor.goalID -> [ {'name':'ac_443'}, ...]
    private mapGoalToConditionAndSensor:any={};

    constructor(name:string, description:string, points:number,
                goals:Goal[], user:User, mapGoalToConditionAndSensor:any){
        this.badgeDef = new BadgeDefinition(name, description, points, goals);
        this.progress = 0;
        this.id = UUID.v4();
        this.user = user;
        this.status = BadgeStatus.WAIT;
        this.mapGoalToConditionAndSensor = mapGoalToConditionAndSensor;
    }

    //name:string, description:string, points:number, goals:Goal[], user:User, sensors:string[]
    public getSensorsTypeRequired():String[]{
        return this.badgeDef.getSensorsTypeRequired();
    }

    public getObjectives():Goal[]{
        return this.badgeDef.getObjectives();
    }

    public getPoints():number{
        return this.badgeDef.getPoints();
    }

    public getDescription():string{
        return this.badgeDef.getDescription();
    }

    public getName():string{
        return this.badgeDef.getName();
    }

    public getId():string{
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public getProgress():number{
        return this.progress;
    }

    public getUser():User{
        return this.user;
    }

    public getStatus():BadgeStatus{
        return this.status;
    }

    public getSensors():string[]{
        return this.mapGoalToConditionAndSensor;
    }
    
    public evaluate(values:any):boolean {
        return this.badgeDef.evaluate(values, this.mapGoalToConditionAndSensor);
    }
};

export = BadgeInstance;