'use strict';

var path = 'http://localhost:3000/dashboard/';

var app = angular.module('ecoknowledgeApp');

app.service('ServiceDashboard', ['$http', function ServiceDashboard($http) {
  this.get = function (successFunc, failFunc) {
    console.log('Service dashboard : Get On ', path);

    $http.get(path)
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
}]);
