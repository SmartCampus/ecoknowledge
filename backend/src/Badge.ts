class Badge {

    constructor(private name:string, private points:number) {}

    public getName():string {
        return this.name;
    }

    public getPoints():number {
        return this.points;
    }
}

export = Badge;