'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('DashboardCtrl', ['ServiceDashboard', function (ServiceDashboard) {
    var self = this;

    self.goals = {};
    self.badges = {};
    self.challenges = {};

    this.getDashboard = function () {
      ServiceDashboard.get(
        function (goals, badges, challenges) {
          console.log('Result of dashboard : ', goals, badges, challenges);

          self.goals = goals;
          self.badges = badges;
          self.challenges = challenges;
        },
        function (data) {
          console.log('ERREUR MA GUEULE', data);
        });
    };

    this.getDashboard();
  }]);


app.directive('listGoal', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-goal.html',
    controller: 'HomeCtrl',
    controllerAs: 'homeCtrl'
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
