'use strict';

var basePath = 'http://localhost:3000/challenges/';

describe('Service: ServiceChallenge', function() {
    var Challenge, httpBackend;

    //load the service's module
    beforeEach(module('ecoknowledgeApp'));

    //Initialize the controller and a mock Scope
    beforeEach(inject(function (_$httpBackend_, _ServiceChallenge_) {
        httpBackend = _$httpBackend_;
        Challenge = _ServiceChallenge_;
    }));

    describe('Challenge.get', function () {
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


        it('should get all the Challenges from the service', function () {
            var mockMonChallenge = { goal: 'Mon goal', points: '37', description: 'Une description', name: 'MonChallenge' };
            var mockMonChallengePatrick = { goal: 'Mon goal de fou', points: '42', description: 'Un de scription', name: 'MonChallengePatrick' };
            var mockResult = [mockMonChallenge, mockMonChallengePatrick];
            //backend definition returns a mock user
            var urlPath = basePath+'all/';

            httpBackend.when('GET',urlPath).respond(mockResult);
            httpBackend.expectGET(urlPath);
            Challenge.get('', callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
            expect(callbacks.success.calls.argsFor(0)).toEqual([mockResult]);
        });
    });

    describe('Challenge.post', function () {
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
            var mockMonChallengePatrick = { goal: 'Mon goal de fou', points: '42', description: 'Un de scription', name: 'MonChallengePatrick' };

            httpBackend.when('POST',basePath +'new');
            httpBackend.expectPOST(basePath+'new').respond('gg wp');
            Challenge.post(mockMonChallengePatrick, callbacks.success, callbacks.error);

            httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.error).not.toHaveBeenCalled();
        });

    });
});
