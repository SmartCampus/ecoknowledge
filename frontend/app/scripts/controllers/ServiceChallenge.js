'use strict';

/**
 * File with all the services associated to Challenge (GET, POST)
 */

  var basePath = 'http://localhost:3000/challenges/';

var app = angular.module('ecoknowledgeApp');
app.service('ServiceChallenge', ['$http', function ServiceChallenge($http) {
  this.get = function (id, successFunc, failFunc) {
    $http.get(basePath + 'all/' + id)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };
  this.post = function (badge, successFunc, failFunc) {
    $http.post(basePath + 'new', badge)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.takeGoal = function (goalID, successFunc, failFunc) {
    $http.post(basePath + 'new', goalID)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.evaluate = function (badgeName, successFunc, failFunc) {
    $http.get(basePath + 'evaluatebadge?badgeName=' + badgeName)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.delete = function(idGoal, successFunc, failFunc){
    console.log("DELETE : path", basePath+'delete/'+idGoal);
    var path = basePath + 'delete/' + idGoal;
    $http.delete(path)
      .success(function(data){
        console.log("OK?3");
        successFunc(data);
      })
      .error(function(data){
        console.log("FAIL MA KE PASSA?",data);
        failFunc(data);
      });
  };

}]);
