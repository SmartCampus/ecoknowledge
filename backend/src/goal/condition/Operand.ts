class Operand {

    private value:string;
    private _hasToBeDefined:boolean;

    constructor(value:string, hasToBeDefined:boolean) {
        this.value = value;
        this._hasToBeDefined = hasToBeDefined;
    }

    public getStringDescription() {
        return this.value;
    }

    public hasToBeDefined():boolean {
        return this._hasToBeDefined;
    }
}

export = Operand;