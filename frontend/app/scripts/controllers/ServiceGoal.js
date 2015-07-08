'use strict';

/**
 * File with all the services associated to Goal (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceGoal',['$http', function ServiceGoal($http){
    var path = 'http://localhost:3000/';
    this.get = function(id, successFunc, failFunc) {
        console.log(path+'goals/' + id);
      $http.get(path+'goals/'+id)
        .success(function (data) {
              successFunc(data);
        })
        .error(function (data) {
          failFunc(data);
        });

    };

     this.getRequired= function(id, successFunc, failFunc) {
       $http.get(path+'required/?goalName=' + id)
         .success(function (data) {
           successFunc(data);
         })
         .error(function (data) {
           failFunc(data);
         });
     };

    this.post = function(goal, successFunc, failFunc){
        $http.post(path+'addgoal', goal)
            .success(function(){
                successFunc();
            })
            .error(function() {
                failFunc();
            });
    };
}]);
