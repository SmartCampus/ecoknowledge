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

    public getBadgeDefinition():BadgeDefinition{
        return this.badgeDef;
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
/*
    public evaluate(values:any[]):boolean {
        var result = true;

        if(this.objectives.length != values.length) {
            throw new Error("Can not evaluate badge " + this.name + "! There are " + this.objectives + " objectives to evaluate" +
                "and only " + values.length + " values");
        }

        var sortedSensorValues:(number|boolean)[] = [];
        console.log("VALUES : ", values);
        for(var j = 0 ; j < this.sensors.length ; j ++) {
            console.log("SENSORS/KEY", this.sensors[j]);
            console.log("BASE", values[0]);
            console.log(values[0][this.sensors[j]]);

            sortedSensorValues.push(values[0][this.sensors[j]]);
        }

        console.log("Sorted values", sortedSensorValues);

        for(var i = 0 ; i < this.objectives.length ; i ++) {
            result = result && this.objectives[i].evaluate(sortedSensorValues);
            console.log("Goal : ", result);
            if(!result) {
                return false;
            }
        }
        return result;
    }*/
};

export = BadgeInstance;