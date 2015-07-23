'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ecoknowledgeApp for the firstpage which display
 * the objectives and the getAllBadges we have.
 */
var app = angular.module('ecoknowledgeApp')
  .controller('HomeCtrl', ['ServiceBadge', 'ServiceGoal', '$window', function (ServiceBadge, ServiceGoal, $window) {
    var self = this;
    self.goals = [];
    self.badges = [];
    self.obtentionValue = {};
    /*
     * Add a goal the the array goals
     */

    self.takeGoal = function (goalID) {

      var toSend = {};
      toSend.goalID = goalID;

      console.log('TAKE GOAL', toSend);
      ServiceBadge.takeGoal(toSend, function (data) {
        console.log('Objectif instancié ', data);
        $window.location.reload();
      }, function (data) {
        console.log('Fail sur l\'instanciation de l\'objectif', data);
      });
    };

    self.getGoals = function () {
      ServiceGoal.get('', function (data) {
        self.goals = data;
      }, function () {
        console.log('fail to get the goals');
      });
    };

    self.getBadges = function () {
      ServiceBadge.get('', function (data) {
        console.log('getAllBadges : ', data);
        self.badges = data;

        for (var badgeIndex in self.badges) {
          var currentBadge = self.badges[badgeIndex];
          var startDate = new Date(currentBadge.startDate);
          var formattedStartDate = '' + startDate.getDate()  + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();

          var endDate = new Date(currentBadge.endDate);
          var formattedEndDate = '' + (endDate.getDate()) + '/' + (endDate.getMonth() + 1 )+ '/' + endDate.getFullYear();

          currentBadge.startDate = formattedStartDate;
          currentBadge.endDate = formattedEndDate;
        }

      }, function (data) {
        console.debug('Fail to get the getAllBadges', data);
      });
    };

    self.addGoal = function (g) {
      self.goals.push(g);
    };

    /*
     * add a badge to the array getAllBadges
     */
    self.addBadge = function (bdg) {
      console.log(bdg);
      self.badges.add(bdg);
      console.log(self.badges);
    };

    self.check = function (badge) {
      ServiceBadge.evaluate(badge.name, function (data) {
        if (data) {
          badge.yes = true;
        }
        else {
          badge.fail = true;
        }
        console.debug(data);
      }, function (data) {
        console.debug(data);
      });
    };

    self.getGoals();
    self.getBadges();
  }]);

app.directive('listGoal', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-goal.html',
    controller: 'HomeCtrl',
    controllerAs: 'homeCtrl'
  };
});

app.directive('listBadge', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-badge.html'
  };
});

app.directive('homepageBadge', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-badge.html'
  };
});

app.directive('homepageGoal', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-goal.html'
  };
});
