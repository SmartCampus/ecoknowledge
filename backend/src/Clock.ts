/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

class Clock {

    private static now:moment.Moment = moment();

    static getNow():number {
        return Clock.now.valueOf();
    }

    static setNow(newNow:number) {
        Clock.now = moment.tz(newNow, Clock.getTimeZone());
    }

    static setNowByString(newNow:string) {
        Clock.now = moment.tz(newNow, Clock.getTimeZone());
    }


    static getTimeZone():string {
        return 'Europe/Paris';
    }

    static getMoment(date:number):moment.Moment {
        return moment.tz(date, Clock.getTimeZone());
    }

    static getMomentFromUnixTimeInMillis(date:number):moment.Moment {
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