import Goal = require('Goal');
import User = require('User');
import BadgeStatus = require('BadgeStatus');
import BadgeDefinition = require('BadgeDefinition');
import UUID = require('node-uuid');

class BadgeInstance {
    private badgeDef:BadgeDefinition;
    private id:string;
    private progress:number;
    private user:User;
    private status:BadgeStatus;
    private sensors:string[];

    constructor(name:string, description:string, points:number, goals:Goal[], user:User, sensors:string[]){
        this.badgeDef = new BadgeDefinition(name, description, points, goals);
        this.progress = 0;
        this.id = UUID.v4();
        this.user = user;
        this.status = BadgeStatus.WAIT;
        this.sensors = sensors;
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
        return this.sensors;
    }
    
    public evaluate(values:any[]):boolean {
        return this.badgeDef.evaluate(values, this.sensors);
    }
};

export = BadgeInstance;