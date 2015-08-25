'use strict';

var dashboardBasePath = 'http://localhost:3000/dashboard/';

var app = angular.module('ecoknowledgeApp');

app.service('ServiceDashboard', ['$http', function ServiceDashboard($http) {

  this.get = function (successFunc, failFunc) {
    console.log('Service dashboard : Get On ', dashboardBasePath);

    $http.get(dashboardBasePath)
      .success(function (data) {
        var goals = data.data.goals;
        var badges = data.data.badges;
        var challenges = data.data.challenges;

        successFunc(data, goals, badges, challenges);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.takeGoal = function (goalID, successFunc, failFunc) {
    var path = dashboardBasePath + 'takeGoal';
    console.log('ServiceDashboard : Take goal', path);

    $http.post(path, goalID)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.deleteChallenge = function (idGoal, successFunc, failFunc) {
    var path = dashboardBasePath + 'delete/' + idGoal;
    console.log('ServiceDashboard : Delete challenge ', path);

    $http.delete(path)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

}]);
