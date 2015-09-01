/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import Filter = require('../../src/filter/Filter');
import PeriodOfDayFilter = require('../../src/filter/PeriodOfDayFilter');
import DayOfWeekFilter = require('../../src/filter/DayOfWeekFilter');


describe('FilterTest test', () => {

    var jsonValuesInMorningAndAfternoon:any =
    {
        'TMP_CLI': [
            {"date": "1436522344000", "value": "28"},   //  10/7/2015 11:59:04 GMT+2:00 DST
            {"date": "1436522374000", "value": "29"},   //  10/7/2015 11:59:34 GMT+2:00 DST
            {"date": "1436522404000", "value": "17"},   //  10/7/2015 12:00:04 GMT+2:00 DST
            {"date": "1436522434000", "value": "30"},   //  10/7/2015 12:00:34 GMT+2:00 DST
            {"date": "1436522464000", "value": "25"},   //  10/7/2015 12:01:04 GMT+2:00 DST
            {"date": "1436522494000", "value": "21"},   //  10/7/2015 12:01:34 GMT+2:00 DST
            {"date": "1438608351000", "value": "3"}     //  3/8/2015 15:25:51
        ]

    };

    var jsonValuesInAfternoon:any =
    {
        'TMP_CLI': [
            {"date": "1436446840000", "value": "28"},   //  9/7/2015 15:00:40 GMT+2:00 DST
            {"date": "1436446870000", "value": "26"},   //  9/7/2015 15:01:10 GMT+2:00 DST
            {"date": "1436446900000", "value": "28"},   //  9/7/2015 15:01:40 GMT+2:00 DST
            {"date": "1436446930000", "value": "28"},   //  9/7/2015 15:02:10 GMT+2:00 DST
            {"date": "1436446960000", "value": "27"},   //  9/7/2015 15:02:40 GMT+2:00 DST
            {"date": "1436446990000", "value": "28"},   //  9/7/2015 15:03:10 GMT+2:00 DST
            {"date": "1436447020000", "value": "28"}    //  9/7/2015 15:03:40 GMT+2:00 DST
        ]

    };

    describe('apply method', () => {

        it('should filter everything if filters allow it', () => {
            var filter = new Filter('all', ['all']);

            var result:any[] = filter.apply(jsonValuesInAfternoon);

            chai.expect(result).to.be.eqls(jsonValuesInAfternoon);
        });

        it('should filter afternoon values if hour filter is satisfied', () => {
            var filter = new Filter('all', ['afternoon']);

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);

            var expected:any =

            {
                'TMP_CLI': [
                    {"date": "1436522404000", "value": "17"},   //  10/7/2015 12:00:04 GMT+2:00 DST
                    {"date": "1436522434000", "value": "30"},   //  10/7/2015 12:00:34 GMT+2:00 DST
                    {"date": "1436522464000", "value": "25"},   //  10/7/2015 12:01:04 GMT+2:00 DST
                    {"date": "1436522494000", "value": "21"},   //  10/7/2015 12:01:34 GMT+2:00 DST
                    {"date": "1438608351000", "value": "3"}     //  3/8/2015 15:25:51
                ]

            };

            console.log("RESULT", JSON.stringify(result), "VS", JSON.stringify(expected));

            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter no values if hour filter is satisfied even if afternoon and "all" filter are present', () => {
            var filter = new Filter('all', ['afternoon', 'all']);

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);

            var expected:any = jsonValuesInMorningAndAfternoon;

            chai.expect(result).to.be.eqls(expected);
        });


        it('should filter nothing if day filter is not satisfied', () => {
            var filter = new Filter('week-end', ['all']);

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any = {
                'TMP_CLI': []

            };

            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter nothing if no filter is satisfied', () => {
            var filter = new Filter('week-end', ['morning']);

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any = {
                'TMP_CLI': []

            };

            chai.expect(result).to.be.eqls(expected);
        });
    });
});




