'use strict';

var path = 'http://localhost:3000/';

describe('Service: ServiceGoal', function() {
    var Goal, httpBackend;

    //load the service's module
    beforeEach(module('ecoknowledgeApp'));

    //Initialize the controller and a mock Scope
    beforeEach(inject(function (_$httpBackend_, _ServiceGoal_) {
        httpBackend = _$httpBackend_;
        Goal = _ServiceGoal_;
    }));

    describe('Goal.get', function () {
        var callbacks;

        beforeEach(function () {
            callbacks = {
                success: function () {
                },
                error: function () {
                }
            };
            spyOn(callbacks, 'success').and.callThrough();
            spyOn(callbacks, 'error').and.callThrough();
        });


        it('should get some goals from the service', function () {
            var mockClim = {
                'name': 'Clim', 'conditions': [
                    {'required': 'Temperature', 'comparison': 'inf', 'value': 25},
                    {'required': 'Temperature', 'comparison': 'eq', 'value': 18},
                    {'required': 'Temperature', 'comparison': 'inf', 'value': 25}
                ]
            };
            var mockPatrick = {
                'name': 'Patrick', 'conditions': [
                    {'required': 'Porte', 'comparison': 'inf', 'value': 'OPEN'},
                    {'required': 'Temperature', 'comparison': 'eq', 'value': 18},
                    {'required': 'Temperature', 'comparison': 'inf', 'value': 25}
                ]
            };
            var mockResult = mockClim, mockPatrick;
            //backend definition returns a mock user
            httpBackend.when('GET',path +'goals/all').respond(mockResult);
            httpBackend.expectGET(path+'goals/all');
            Goal.get('', callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
            expect(callbacks.success.calls.argsFor(0)).toEqual([mockResult]);
        });
    });

    describe('Goal.post', function () {
        var callbacks;

        beforeEach(function () {
            callbacks = {
                success: function () {
                },
                error: function () {
                }
            };
            spyOn(callbacks, 'success').and.callThrough();
            spyOn(callbacks, 'error').and.callThrough();
        });

        it('should send a new goal to the service', function(){
            var mockPatrick = {
                'name': 'Patrick', 'conditions': [
                    {'required': 'Porte', 'comparison': 'inf', 'value': 'OPEN'},
                    {'required': 'Temperature', 'comparison': 'eq', 'value': 18},
                    {'required': 'Temperature', 'comparison': 'inf', 'value': 25}
                ]
            };


            httpBackend.when('POST',path +'adddgoal');
            httpBackend.expectPOST(path+'addgoal').respond('gg wp');
            Goal.post(mockPatrick, callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
        });

    });
});