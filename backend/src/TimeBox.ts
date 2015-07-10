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

    public getRequired():any {
        var startDateStr = this.convertTime(this.startDateInMillis);
        var endDateStr = this.convertTime(this.endDateInMillis);

        return {
            'startDate':startDateStr,
            'endDate':endDateStr
        }
    }

    private convertTime(aDateInMillis):string {
        var date:string= new Date(aDateInMillis).toISOString();

        var dateWithoutTail:string[] = date.split('.');
        var headOfDate:string = dateWithoutTail[0];

        var arrayOfHeadOfDate:string[] = headOfDate.split('T');
        var properDate:string= arrayOfHeadOfDate[0] + " " + arrayOfHeadOfDate[1];

        return properDate;
    }
}

export = TimeBox;