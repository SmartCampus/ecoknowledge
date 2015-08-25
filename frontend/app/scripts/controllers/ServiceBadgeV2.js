'use strict';

/**
 * File with all the services associated to Badge (GET, POST)
 */

var badgeBasePath = 'http://localhost:3000/badges/';

var app = angular.module('ecoknowledgeApp');
app.service('ServiceBadgeV2', ['$http', function ServiceBadgeV2($http) {
  this.post = function (badge, successFunc, failFunc) {
    $http.post(badgeBasePath + 'new', badge)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.get = function (id, successFunc, failFunc) {
    var pathToGet = badgeBasePath + id;
    console.log('Service Badge : Get on ', pathToGet);
    $http.get(pathToGet)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.getTrophies = function (successFunc, failFunc) {
    var pathToGet = badgeBasePath + 'trophyWall';
    console.log('Service Badge : Get on ', pathToGet);
    $http.get(pathToGet)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      })
    ;
  };
}]);
