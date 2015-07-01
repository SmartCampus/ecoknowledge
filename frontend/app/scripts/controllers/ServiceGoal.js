'use strict';

/**
 * File with all the services associated to Goal (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceGoal',['$http', function ServiceGoal($http){
    this.get = function(id, successFunc, failFunc) {
      $http.get('http://localhost:3000/goals/' + id)
        .success(function (data) {
          successFunc(data);
        })
        .error(function (data) {
          failFunc(data);
        });

    };

     this.getRequired= function(id, successFunc, failFunc) {
       $http.get('http://localhost:3000/required/?goalName=' + id)
         .success(function (data) {
           successFunc(data);
         })
         .error(function (data) {
           failFunc(data);
         });
     };

    this.post = function(goal, successFunc, failFunc){
        $http.post('http://localhost:3000/addgoal', goal)
            .success(function(){
                successFunc();
            })
            .error(function() {
                failFunc();
            });
    };
}]);
