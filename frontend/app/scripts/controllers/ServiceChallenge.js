'use strict';

/**
 * File with all the services associated to Challenge (GET, POST)
 */

var app = angular.module('ecoknowledgeApp');
app.service('ServiceChallenge', ['$http', function ServiceChallenge($http) {
  this.get = function (id, successFunc, failFunc) {
    $http.get('http://localhost:3000/goalsInstanceRunning/' + id)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };
  this.post = function (badge, successFunc, failFunc) {
    $http.post('http://localhost:3000/addbadge', badge)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.takeGoal = function (goalID, successFunc, failFunc) {
    $http.post('http://localhost:3000/takeGoal', goalID)
      .success(function (data) {
        console.log('ZIZI');
        successFunc(data);

      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.evaluate = function (badgeName, successFunc, failFunc) {
    $http.get('http://localhost:3000/evaluatebadge?badgeName=' + badgeName)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };
}]);
