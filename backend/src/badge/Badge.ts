import uuid = require('node-uuid');

class Badge {

    private name:string;
    private points:number;

    private id;

    constructor(name:string,points:number) {
        this.name = name;
        this.points = points;
        this.id = uuid.v4();
    }

    public getName():string {
        return this.name;
    }

    public getPoints():number {
        return this.points;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }
}

export = Badge;