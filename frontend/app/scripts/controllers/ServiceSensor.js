'use strict';

/**
 * File with all the services associated to Sensors (GET)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceSensor',['$http', function ServiceSensor($http){
    var path = 'http://localhost:3000/';
    this.get = function(id, successFunc, failFunc) {
      var pathToGet = path + 'sensors/' + id;
        console.log('service sensor : Get on', pathToGet);
        $http.get(pathToGet)
            .success(function (data) {
                successFunc(data);
            })
            .error(function (data) {
                failFunc(data);
            });

    };
}]);
