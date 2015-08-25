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

        successFunc(goals, badges, challenges);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.takeGoal = function (goalID, successFunc, failFunc) {
    $http.post(dashboardBasePath + 'takeGoal', goalID)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

}]);
