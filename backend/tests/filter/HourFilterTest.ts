/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import HourFilter = require('../../src/filter/HourFilter');


describe('HourFilter test', () => {

    var jsonValuesInMorning:any[] = [
        {"date": "1436515204000", "value": "17"},   //  10/7/2015 10:00:04 GMT+2:00 DST
        {"date": "1436515234000", "value": "29"},   //  10/7/2015 10:00:34 GMT+2:00 DST
        {"date": "1436515264000", "value": "18"},   //  10/7/2015 10:01:04 GMT+2:00 DST
        {"date": "1436515294000", "value": "29"}    //  10/7/2015 10:01:34 GMT+2:00 DST
    ];

    var jsonValuesInMorningAndAfternoon:any[] = [
        {"date": "1436522344000", "value": "28"},   //  10/7/2015 11:59:04 GMT+2:00 DST
        {"date": "1436522374000", "value": "29"},   //  10/7/2015 11:59:34 GMT+2:00 DST
        {"date": "1436522404000", "value": "17"},   //  10/7/2015 12:00:04 GMT+2:00 DST
        {"date": "1436522434000", "value": "30"},   //  10/7/2015 12:00:34 GMT+2:00 DST
        {"date": "1436522464000", "value": "25"},   //  10/7/2015 12:01:04 GMT+2:00 DST
        {"date": "1436522494000", "value": "21"}    //  10/7/2015 12:01:34 GMT+2:00 DST
    ];

    var jsonValuesInAfternoon:any[] = [
        {"date": "1436446840000", "value": "28"},   //  9/7/2015 15:00:40 GMT+2:00 DST
        {"date": "1436446870000", "value": "26"},   //  9/7/2015 15:01:10 GMT+2:00 DST
        {"date": "1436446900000", "value": "28"},   //  9/7/2015 15:01:40 GMT+2:00 DST
        {"date": "1436446930000", "value": "28"},   //  9/7/2015 15:02:10 GMT+2:00 DST
        {"date": "1436446960000", "value": "27"},   //  9/7/2015 15:02:40 GMT+2:00 DST
        {"date": "1436446990000", "value": "28"},   //  9/7/2015 15:03:10 GMT+2:00 DST
        {"date": "1436447020000", "value": "28"}    //  9/7/2015 15:03:40 GMT+2:00 DST
    ];

    var jsonValueInAfternoonAndNight:any[] = [
        {"date": "1436446990000", "value": "28"},   //  9/7/2015 15:03:10 GMT+2:00 DST
        {"date": "1436447020000", "value": "28"},   //  9/7/2015 15:03:40 GMT+2:00 DST
        {"date": "1436461208000", "value": "30"},   //  9/7/2015 19:00:08 GMT+2:00 DST
        {"date": "1436461238000", "value": "32"},   //  9/7/2015 19:00:38 GMT+2:00 DST
        {"date": "1436461268000", "value": "33"},   //  9/7/2015 19:01:08 GMT+2:00 DST
        {"date": "1436461298000", "value": "31"}    //  9/7/2015 19:01:38 GMT+2:00 DST
    ];

    var jsonValueInNight:any[] = [
        {"date": "1436461208000", "value": "29"},   //  9/7/2015 19:00:08 GMT+2:00 DST
        {"date": "1436461238000", "value": "27"},   //  9/7/2015 19:00:38 GMT+2:00 DST
        {"date": "1436461268000", "value": "26"},   //  9/7/2015 19:01:08 GMT+2:00 DST
        {"date": "1436461298000", "value": "25"}    //  9/7/2015 19:01:38 GMT+2:00 DST
    ];

    describe('afternoon case', () => {

        it('should filter nothing if every values are in the afternoon', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = ['28', '26', '28', '28', '27', '28', '28'];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });


        it('should filter everything if no values are in the afternoon', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInMorning);
            var expected:any[] = [];
            //FIXME  chai.expect(result).to.be.eqls(expected);
        });

        it('should filter morning values', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any[] = ['17', '30', '25', '21'];
            //FIXME  chai.expect(result).to.be.eqls(expected);
        });
    });

    describe('morning case', () => {
        it('should filter nothing if every values are in the morning', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInMorning);
            var expected:any[] = ['17', '29', '18', '29'];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });

        it('should filter everything if no values are in the morning', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = [];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });

        it('should filter afternoon values', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any[] = ['28', '29'];
            //FIXME  chai.expect(result).to.be.eqls(expected);
        });
    });

    describe('night case', () => {
        it('should filter nothing if every values are in the night', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValueInNight);
            var expected:any[] = ['29','27','26','25'];
            //FIXME  chai.expect(result).to.be.eqls(expected);
        });

        it('should filter everything if no values are in the night', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = [];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });

        it('should filter afternoon values', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValueInAfternoonAndNight);
            var expected:any[] = ['30', '32','33', '31'];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });
    });
});



