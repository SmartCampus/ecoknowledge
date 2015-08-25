'use strict';

/**
 * File with all the services associated to Goal (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');

app.service('ServiceGoal', ['$http', function ServiceGoal($http) {
  var basePathGoal = 'http://localhost:3000/goals/';
  this.get = function (id, successFunc, failFunc) {
    var path = basePathGoal;
    path += (id) ? id : 'all';
    console.log('Service Goal : Get On', path);
    $http.get(path)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        console.log('path : ', path);
        failFunc(data);
      });
  };

  this.getRequired = function (id, successFunc, failFunc) {
    var path = basePathGoal + 'required/?goalName=' + id;
    console.log('Service Goal : Get On', path);

    $http.get(basePathGoal + 'required/?goalName=' + id)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.post = function (goal, successFunc, failFunc) {
    var path = basePathGoal + 'new';
    console.log('Service Goal : Get On', path);

    $http.post(path, goal)
      .success(function () {
        successFunc();
      })
      .error(function () {
        failFunc();
      });
  };

}]);
