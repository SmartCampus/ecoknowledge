'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ecoknowledgeApp for the firstpage which display
 * the objectives and the badges we have.
 */
var app = angular.module('ecoknowledgeApp')
  .controller('HomeCtrl', ['ServiceBadge', 'ServiceGoal', 'ServiceBadgeV2','$window', function (ServiceBadge, ServiceGoal, ServiceBadgeV2, $window) {
    var self = this;
    self.goals = [];
    self.goalsInstance = [];
    self.obtentionValue = {};
    self.trophies = [];
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
        console.log('badges : ', data);
        self.goalsInstance = data;

        for (var badgeIndex in self.goalsInstance) {
          var currentBadge = self.goalsInstance[badgeIndex];
          var startDate = new Date(currentBadge.startDate);
          var formattedStartDate = '' + startDate.getDate()  + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();

          var endDate = new Date(currentBadge.endDate);
          var formattedEndDate = '' + (endDate.getDate()) + '/' + (endDate.getMonth() + 1 )+ '/' + endDate.getFullYear();

          currentBadge.startDate = formattedStartDate;
          currentBadge.endDate = formattedEndDate;
        }

      }, function (data) {
        console.debug('Fail to get the badges', data);
      });
    };

    self.addGoal = function (g) {
      self.goals.push(g);
    };

    /*
     * add a badge to the array badges
     */
    self.addBadge = function (bdg) {
      console.log(bdg);
      self.goalsInstance.add(bdg);
      console.log(self.goalsInstance);
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

    self.getTrophies = function(){
      self.trophies = [];
      ServiceBadgeV2.getTrophies(function(data){
        self.trophies = data;
        console.log('trophies get : ', self.trophies);
      },function(data){
        console.log('Error getting trophies', data);
      })
      ;
    };

    self.getGoals();
    self.getBadges();
    self.getTrophies();
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

app.directive('listTrophies', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/list-trophies.html'
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

app.directive('homepageTrophy', function () {
  return {
    restrict: 'E',
    templateUrl: '../../views/homepage/homepage-trophy.html'
  };
});