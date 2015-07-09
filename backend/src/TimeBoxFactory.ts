import TimeBox = require('./TimeBox');

class TimeBoxFactory {
    createTimeBox(data:any):TimeBox {

        var startDate = data.startDate;
        var endDate = data.endDate;

        var timeBox:TimeBox = new TimeBox(startDate, endDate);

        return timeBox;
    }
}

export = TimeBoxFactory