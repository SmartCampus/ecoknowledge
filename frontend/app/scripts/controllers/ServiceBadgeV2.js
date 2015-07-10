'use strict';

/**
 * File with all the services associated to Badge (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');
app.service('ServiceBadgeV2',['$http', function ServiceBadgeV2($http){
    this.post = function(badge, successFunc, failFunc){
        $http.post('http://localhost:3000/badgesV2', badge)
            .success(function(data){
                successFunc(data);
            })
            .error(function(data) {
                failFunc(data);
            });
    };
}]);
