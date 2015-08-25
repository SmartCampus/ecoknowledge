'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('DashboardCtrl', ['ServiceDashboard', '$window', function (ServiceDashboard, $window) {
  var self = this;

  self.goals = {};
  self.trophies = {};
  self.challenges = {};

  //  Debug
  self.request = {};

  this.getDashboard = function () {
    console.log('on veut récupérer le dashboard!!');
    ServiceDashboard.get(
      function (data, goals, badges, challenges) {
        console.log('Result of dashboard : ', goals, badges, challenges);

        self.request = data;

        self.goals = goals;
        self.trophies = badges;
        self.challenges = challenges;
      },
      function (data) {
        console.log('ERREUR MA GUEULE', data);
      });
  };

  self.takeGoal = function (goalID) {
    var toSend = {};
    toSend.id = goalID;

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
