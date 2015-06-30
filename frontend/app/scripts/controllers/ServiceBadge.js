'use strict';

/**
 * File with all the services associated to Badge (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');
app.service('ServiceBadge',['$http', function ServiceBadge($http){
    this.get = function(id, successFunc, failFunc){
        $http.get('http://localhost:3000/badges/'+id)
            .success(function(data){
                successFunc(data);
            })
            .error(function(data) {
                failFunc(data);
            });
    };
    this.post = function(badge, successFunc, failFunc){
        $http.post('http://localhost:3000/addbadge', badge)
            .success(function(data){
                successFunc(data);
            })
            .error(function(data) {
                failFunc(data);
            });
    };
    this.evaluate = function(badgeName, value, successFunc, failFunc) {
            $http.post('http://localhost:3000/evaluatebadge', {'name':badgeName, 'value':value})
                .success(function(data){
                    successFunc(data);
                })
                .error(function(data){
                    failFunc(data);
                });
    };
}]);