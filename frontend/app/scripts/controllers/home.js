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
  .controller('HomeCtrl', ['ServiceChallenge', 'ServiceGoal', 'ServiceBadgeV2','$window', function (ServiceChallenge, ServiceGoal, ServiceBadgeV2, $window) {
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
      toSend.id = goalID;

      console.log('TAKE GOAL', toSend);
      ServiceChallenge.takeGoal(toSend, function (data) {
        console.log('Objectif instancié ', data);
        $window.location.reload();
      }, function (data) {
        console.log('Fail sur l\'instanciation de l\'objectif', data);
      });
    };

    self.getGoals = function () {
      self.goals = [];
      ServiceGoal.get('', function (data) {
        self.goals = data;
      }, function () {
        console.log('fail to get the goals');
      });
    };

    self.getBadges = function () {
      ServiceChallenge.evaluate('all',function(data){
        console.log('achieve eval');
      },function(data){
        console.log('fail eval');
      });

      self.goalsInstance = [];
      ServiceChallenge.get('', function (data) {
        console.log('get the badges : ');
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
      self.goalsInstance.add(bdg);
    };

    self.getTrophies = function(){
      self.trophies = [];
      ServiceBadgeV2.getTrophies(function(data){
        self.trophies = data;
        console.log('trophies get : ', self.trophies);
      },function(data){
        console.log('Error getting trophies', data);
      });
    };

    self.removeObjective = function(objective){
      console.log("OBJECTIVE", objective);

      console.log('objective to remove : ',objective.id);
      ServiceChallenge.delete(objective.id,function(data){
        console.log('Succeed to remove a goal instance : ', data);
        var index = self.goalsInstance.indexOf(objective);
        self.goalsInstance.splice(index, 1);
      }, function(data){
        console.log('Failed to remove a goal',data);
      });

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
