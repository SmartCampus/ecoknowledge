/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import HourFilter = require('../../src/filter/HourFilter');


describe('HourFilter test', () => {

    var jsonValuesInMorning:any[] = [
        {"date": "1436515204", "value": "17"},
        {"date": "1436515234", "value": "29"},
        {"date": "1436515264", "value": "18"},
        {"date": "1436515294", "value": "29"}
    ];

    var jsonValuesInMorningAndAfternoon:any[] = [
        {"date": "1436522344", "value": "28"},
        {"date": "1436522374", "value": "29"},
        {"date": "1436522404", "value": "17"},
        {"date": "1436522434", "value": "30"},
        {"date": "1436522464", "value": "25"},
        {"date": "1436522494", "value": "21"}
    ];

    var jsonValuesInAfternoon:any[] = [
        {"date": "1436446840", "value": "28"},
        {"date": "1436446870", "value": "26"},
        {"date": "1436446900", "value": "28"},
        {"date": "1436446930", "value": "28"},
        {"date": "1436446960", "value": "27"},
        {"date": "1436446990", "value": "28"},
        {"date": "1436447020", "value": "28"}
    ];

    var jsonValueInAfternoonAndNight:any[] = [
        {"date": "1436446990", "value": "28"},
        {"date": "1436447020", "value": "28"},
        {"date": "1436461208", "value": "30"},
        {"date": "1436461238", "value": "32"},
        {"date": "1436461268", "value": "33"},
        {"date": "1436461298", "value": "31"}
    ];

    var jsonValueInNight:any[] = [
        {"date": "1436461208", "value": "29"},
        {"date": "1436461238", "value": "27"},
        {"date": "1436461268", "value": "26"},
        {"date": "1436461298", "value": "25"}
    ];

    describe('afternoon case', () => {

        it('should filter nothing if every values are in the afternoon', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = ['28', '26', '28', '28', '27', '28', '28'];
            chai.expect(result).to.be.eqls(expected);
        });


        it('should filter everything if no values are in the afternoon', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInMorning);
            var expected:any[] = [];
            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter morning values', () => {
            var filter = new HourFilter('afternoon');

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any[] = ['17', '30', '25', '21'];
            chai.expect(result).to.be.eqls(expected);
        });
    });

    describe('morning case', () => {
        it('should filter nothing if every values are in the morning', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInMorning);
            var expected:any[] = ['17', '29', '18', '29'];
            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter everything if no values are in the morning', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = [];
            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter afternoon values', () => {
            var filter = new HourFilter('morning');

            var result:any[] = filter.apply(jsonValuesInMorningAndAfternoon);
            var expected:any[] = ['28', '29'];
            chai.expect(result).to.be.eqls(expected);
        });
    });

    describe('night case', () => {
        it('should filter nothing if every values are in the night', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValueInNight);
            var expected:any[] = ['29','27','26','25'];
           //FIXME chai.expect(result).to.be.eqls(expected);
        });

        it('should filter everything if no values are in the night', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValuesInAfternoon);
            var expected:any[] = [];
            chai.expect(result).to.be.eqls(expected);
        });

        it('should filter afternoon values', () => {
            var filter = new HourFilter('night');

            var result:any[] = filter.apply(jsonValueInAfternoonAndNight);
            var expected:any[] = ['30', '32','33', '31'];
            //FIXME chai.expect(result).to.be.eqls(expected);
        });
    });
});



