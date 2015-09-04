'use strict';

var dashboardBasePath = 'http://localhost:3000/dashboard/';

var app = angular.module('ecoknowledgeApp');

app.service('ServiceDashboard', ['$http', '$rootScope', '$cookies', function ServiceDashboard($http, $rootScope, $cookies) {

  this.get = function (successFunc, failFunc, dashboardWanted) {

    console.log('Token stored : ', $cookies.get('token'));

    var path = dashboardBasePath + '/view/' +$cookies.get('token') + '/' +  $cookies.get('dashboardWanted');

    console.log('Service dashboard : Get On ', path);

    $http.get(path)
      .success(function (data) {
        console.log("DATA RECEIVED BY SERVICE DASHBOARD", data);

        var user = data.data.user;
        var canTake = data.data.goals.canTakeGoal;
        var goals = data.data.goals.goalsData;
        var badges = data.data.badges;
        var challenges = data.data.challenges;

        var dashboardViews = data.data.dashboardList;


        successFunc(data,user, canTake, goals, badges, challenges, dashboardViews);
      })
      .error(function (data) {
        console.error('ServiceDashboard : fail get dashboard', data);
        failFunc(data);
      });
  };

  this.takeGoal = function (info, successFunc, failFunc) {
    var path = dashboardBasePath + 'takeGoal';
    console.log('ServiceDashboard : Take goal', path);

    $http.post(path, info)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.deleteChallenge = function (idGoal, target, successFunc, failFunc) {
    var path = dashboardBasePath + 'delete/' + $cookies.get('token') + '/'+ idGoal + '/' + $cookies.get('dashboardWanted');
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
