'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('DashboardCtrl', ['ServiceDashboard', '$window', '$location', '$cookies', function (ServiceDashboard, $window, $location, $cookies) {
  var self = this;

  self.canTakeChallenge = true;
  self.goals = {};
  self.trophies = {};
  self.challenges = {};

  self.dashboardViews = [];
  self.dashboardWanted = '';

  //  Debug
  self.request = {};

  self.debug = {};

  this.getDashboard = function () {
    console.log('\n------------------------------------------------------------\nAngular wanna get the dashboard');

    ServiceDashboard.get(
      function (data, canTake, goals, badges, challenges, dashboardViews) {

        self.request = data;

        self.canTakeChallenge = canTake;
        self.goals = goals;
        self.trophies = badges;
        self.challenges = challenges;
        self.dashboardViews = dashboardViews;

        self.debug = challenges;
      },
      function (data) {
        console.error('Redirection vers', data.redirectTo);
        //$location.path(data.redirectTo);
      });
  };

  this.changeDashboardView = function () {
    console.log('Angular wanna change the dashboard');

    $cookies.put('dashboardWanted', self.dashboardWanted);

    ServiceDashboard.get(
      function (data, cantTake, goals, badges, challenges, dashboardViews) {
        console.log('Result of dashboard : ', goals, badges, challenges);

        self.request = data;

        self.canTakeChallenge = cantTake;
        self.goals = goals;
        self.trophies = badges;
        self.challenges = challenges;
        self.dashboardViews = dashboardViews;
      },
      function (data) {
        console.error('Redirection vers', data.redirectTo);
        $location.path(data.redirectTo);
      }, self.dashboardWanted);
  };

  self.takeGoal = function (goalID) {

    var toSend = {
      goalID: goalID,
      userID: $cookies.get('token'),
      target: $cookies.get('dashboardWanted')
    };


    ServiceDashboard.takeGoal(toSend,
      function (data) {
        console.log('Objectif instancié ', data);
        $window.location.reload();
      },
      function (data) {
        console.log('Fail sur l\'instanciation de l\'objectif', data);
      });
  };


  self.deleteChallenge = function (objective) {
    ServiceDashboard.deleteChallenge(objective.id,
      function (data) {
        console.log('DashboardCtrl : Delete challenge : data RECEIVED :', data);

        var index = self.challenges.indexOf(objective);
        $window.location.reload();
        self.challenges.splice(index, 1);
      },
      function (data) {
        console.log('Failed to remove a goal', data);
      });

  };

  this.getDashboard();
}]);


app.directive('listGoal', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-goal.html',
    controller: 'DashboardCtrl',
    controllerAs: 'dashboard'
  };
});

app.directive('listChallenge', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-challenge.html'
  };
});

app.directive('listTrophies', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-trophies.html'
  };
});


app.directive('homepageChallenge', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-challenge.html'
  };
});

app.directive('homepageGoal', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-goal.html'
  };
});

app.directive('homepageTrophy', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-trophy.html'
  };
});
