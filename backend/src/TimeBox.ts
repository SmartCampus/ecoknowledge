class TimeBox {

    private startDate:Date;
    private endDate:Date;

    constructor(startDateInMillis:Date, endDateInMillis:Date) {
        this.startDate = startDateInMillis;
        this.endDate = endDateInMillis;
    }

    public isDateInMillisInTimeBox(currentDateInMillis:number):boolean{
        return currentDateInMillis >= this.startDate.getTime() && currentDateInMillis <= this.endDate.getTime();
    }

    public isDateInTimeBox(currentDate:Date):boolean{
        return this.isDateInMillisInTimeBox(currentDate.getTime());
    }

    public getStartDate():Date {
        return this.startDate;
    }

    public getStartDateInMillis():number {
        return this.startDate.getTime();
    }

    public getEndDate():Date {
        return this.endDate;
    }

    public getEndDateInMillis():number {
        return this.endDate.getTime();
    }

    public getStartDateInStringFormat():string {
        return this.convertTimeForMiddlewareAPI(this.startDate);
    }

    public getEndDateInJsonFormat():string {
        return this.convertTimeForMiddlewareAPI(this.endDate);
    }

    /**
     *
     * @returns {{startDate: string, endDate: string}}
     */
    public getRequired():any {
        var startDateStr = this.convertTimeForMiddlewareAPI(this.startDate.getTime());
        var endDateStr = this.convertTimeForMiddlewareAPI(this.endDate.getTime());

        return {
            'startDate':startDateStr,
            'endDate':endDateStr
        }
    }

    /**
     * This method is needed because API of SmartCampus middleware wants
     * dates in the following format : YYYY-MM-DD hh:mm:ss</br>
     * We wanted to isolated this behavior in a specific method.
     * @param aDateInMillis
     *      The date in millis to convert
     * @returns {string}
     *      The given date in the following format : YYYY-MM-DD hh:mm:ss</br>
     *      Uses Date#toISOString method.
     */
    private convertTimeForMiddlewareAPI(aDateInMillis):string {
        var date:string= new Date(aDateInMillis).toISOString();

        var dateWithoutTail:string[] = date.split('.');
        var headOfDate:string = dateWithoutTail[0];

        var arrayOfHeadOfDate:string[] = headOfDate.split('T');
        var properDate:string= arrayOfHeadOfDate[0] + " " + arrayOfHeadOfDate[1];

        return properDate;
    }
}

export = TimeBox;