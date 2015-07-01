'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
  .controller('BadgeCtrl',['ServiceGoal','ServiceBadge', function (ServiceGoal, ServiceBadge) {
    var self = this;
    self.badge = {};
    self.goals = [];
    self.mappingSensors = {};

    self.addBadge = function () {
      console.log(self.badge);
      ServiceBadge.post(self.badge, function(data) {
          console.log('Achieve to send the badge', data);
        },function(data) {
          console.log('Fail to send the badge', data);
        });
    };

    self.getGoals = function () {
      self.goals = [];
      ServiceGoal.get('', function(data){
        console.log('achieve to get the goals');
        self.goals = data;
      },function(data){
        console.log('fail when trying to get the goals', data);
      });
    };

    self.change = function(selectedGoal) {
      ServiceGoal.getRequired(selectedGoal, function(data) {
        // success
        console.log(data.conditions.conditions);
        self.currentGoalConditions = {};
        self.currentGoalConditions.required = data.conditions.conditions;
        self.sensors = data;
      }, function(data) {
        //error
        console.log(data);
      });
    };

    self.getGoals();
  }]);
