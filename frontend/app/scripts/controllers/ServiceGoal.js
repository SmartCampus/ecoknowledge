'use strict';

/**
 * File with all the services associated to Goal (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceGoal',['$http', function ServiceGoal($http){
    var basePath = 'http://localhost:3000/';
    this.get = function(id, successFunc, failFunc) {

      var path = basePath+'goals';

      path += (id)? id : '/all';
      console.log('Get ON', path);

      $http.get(path)
        .success(function (data) {
              successFunc(data);
        })
        .error(function (data) {
          failFunc(data);
        });

    };

     this.getRequired= function(id, successFunc, failFunc) {
       $http.get(basePath+'required/?goalName=' + id)
         .success(function (data) {
           successFunc(data);
         })
         .error(function (data) {
           failFunc(data);
         });
     };

    this.post = function(goal, successFunc, failFunc){
        $http.post(basePath+'addgoal', goal)
            .success(function(){
                successFunc();
            })
            .error(function() {
                failFunc();
            });
    };


}]);
