'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('DashboardCtrl', ['ServiceDashboard', function (ServiceDashboard) {
  var self = this;

  self.goals = {};
  self.trophies = {};
  self.challenges = {};

  this.getDashboard = function () {
    console.log('on veut récupérer le dashboard!!');
    ServiceDashboard.get(
      function (goals, badges, challenges) {
        console.log('Result of dashboard : ', goals, badges, challenges);

        self.goals = goals;
        self.trophies = badges;
        self.challenges = challenges;
      },
      function (data) {
        console.log('ERREUR MA GUEULE', data);
      });
  };
  console.log('Le fichier dshb est bien chargé');
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
