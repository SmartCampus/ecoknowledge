'use strict';

/**
 * File with all the services associated to Sensors (GET)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceSensor',['$http', function ServiceSensor($http){
    var path = 'http://localhost:3000/';
    this.get = function(id, successFunc, failFunc) {
        console.log(path+'sensors/' + id);
        $http.get(path+'sensors/'+id)
            .success(function (data) {
                successFunc(data);
            })
            .error(function (data) {
                failFunc(data);
            });

    };
}]);