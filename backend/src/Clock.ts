/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');
import GoalInstanceRouter = require('./api/GoalInstanceRouter');


class Clock {

    private static now:number = Date.now();

    static getNow():number {
        return Clock.now;
    }

    static setNow(newNow:number) {
        Clock.now = newNow;
    }

    static getTimeZone():string {
        return 'Europe/Paris';
    }

    static getMoment(date:number):moment.Moment {
        return moment.tz(date, Clock.getTimeZone());
    }

    static getMomentFromString(date:string):moment.Moment {
        return moment.tz(date, Clock.getTimeZone());
    }

    static getCurrentMoment():moment.Moment {
        return moment.tz(Date.now(), Clock.getTimeZone());
    }

    static getCurrentDemoMoment():moment.Moment {
        return moment.tz(Clock.getNow(), Clock.getTimeZone());
    }
}

export = Clock;