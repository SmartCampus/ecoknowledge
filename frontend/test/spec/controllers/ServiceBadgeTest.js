'use strict';

var path = 'http://localhost:3000/';

describe('Service: ServiceBadge', function() {
    var Badge, httpBackend;

    //load the service's module
    beforeEach(module('ecoknowledgeApp'));

    //Initialize the controller and a mock Scope
    beforeEach(inject(function (_$httpBackend_, _ServiceBadge_) {
        httpBackend = _$httpBackend_;
        Badge = _ServiceBadge_;
    }));

    describe('Badge.get', function () {
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


        it('should get all the getAllBadges from the service', function () {
            var mockMonBadge = { goal: 'Mon goal', points: '37', description: 'Une description', name: 'MonBadge' };
            var mockMonBadgePatrick = { goal: 'Mon goal de fou', points: '42', description: 'Un de scription', name: 'MonBadgePatrick' };
            var mockResult = [mockMonBadge, mockMonBadgePatrick];
            //backend definition returns a mock user
            httpBackend.when('GET',path +'getAllBadges/').respond(mockResult);
            httpBackend.expectGET(path+'getAllBadges/');
            Badge.get('', callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
            expect(callbacks.success.calls.argsFor(0)).toEqual([mockResult]);
        });
    });

    describe('Badge.post', function () {
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
            var mockMonBadgePatrick = { goal: 'Mon goal de fou', points: '42', description: 'Un de scription', name: 'MonBadgePatrick' };

            httpBackend.when('POST',path +'addbadge');
            httpBackend.expectPOST(path+'addbadge').respond('gg wp');
            Badge.post(mockMonBadgePatrick, callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
        });

    });
});
