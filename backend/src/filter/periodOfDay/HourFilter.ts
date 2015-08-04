interface HourFilter {

    filter(date:Date):boolean;
    getTimeIntervals():number[];
}

export = HourFilter;