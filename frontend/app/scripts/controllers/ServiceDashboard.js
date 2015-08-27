'use strict';

var dashboardBasePath = 'http://localhost:3000/dashboard/';

var app = angular.module('ecoknowledgeApp');

app.service('ServiceDashboard', ['$http', '$rootScope', '$cookies', function ServiceDashboard($http, $rootScope, $cookies) {

  this.get = function (successFunc, failFunc, dashboardWanted) {

    console.log('TOKEN???', $cookies.get('token'));

    var path = dashboardBasePath + '/view/' +$cookies.get('token') + '/' +  $cookies.get('dashboardWanted');

    console.log('Service dashboard : Get On ', path);

    $http.get(path)
      .success(function (data) {
        var goals = data.data.goals;
        var badges = data.data.badges;
        var challenges = data.data.challenges;

        var dashboardViews = data.data.dashboardList;

        successFunc(data, goals, badges, challenges, dashboardViews);
      })
      .error(function (data) {
        console.error('ServiceDashboard : fail get dashboard', data);
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
