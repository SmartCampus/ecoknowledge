/// <reference path="../../typings/node/node.d.ts" />

import uuid = require('node-uuid');

class Badge {

    private name:string;
    private points:number;

    private id;

    constructor(name:string = "default badge", points:number = 0, id=null) {
        this.name = name;
        this.points = points;
        this.id = (id) ? id : uuid.v4();
    }

    public getName():string {
        return this.name;
    }

    public getPoints():number {
        return this.points;
    }

    public getUuid():string {
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public getData():any {
        return {
            "name": this.name,
            "points": this.points
        };
    }

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            points: this.points
        };
    }
}

export = Badge;