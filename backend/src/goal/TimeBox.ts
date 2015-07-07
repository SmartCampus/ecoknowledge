class TimeBox {

    private startDateInMillis:number;
    private endDateInMillis:number;

    constructor(startDateInMillis:number, endDateInMillis:number) {
        this.startDateInMillis = startDateInMillis;
        this.endDateInMillis = endDateInMillis;
    }

    public isInTimeBox(currentDateInMillis):boolean{
        return currentDateInMillis > this.startDateInMillis && currentDateInMillis < this.endDateInMillis;
    }
}

export = TimeBox;