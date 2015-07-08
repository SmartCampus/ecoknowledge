'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
  .controller('BadgeCtrl',['ServiceGoal','ServiceBadge','ServiceSensor','Sign',
      function (ServiceGoal, ServiceBadge, ServiceSensor, Sign) {
    var self = this;
    self.badge = {};
    self.goals = [];
    self.badge.currentGoal = {};
    self.sign = Sign;
    self.addBadge = function () {
      var toSend = angular.toJson(self.badge);
      ServiceBadge.post(toSend, function(data) {
          console.log('Achieve to send the badge', data);
        },function(data) {
          console.log('Fail to send the badge', data);
        });
    };

    self.getGoals = function () {
      self.goals = [];
      ServiceGoal.get('', function(data){
        console.log('achieve to get the goals', data);
        self.goals = data;
      },function(data){
        console.log('fail when trying to get the goals', data);
      });
    };

    self.getSensors = function(){
      self.sensors = [];
      ServiceSensor.get('',function(data){
        console.log('achieve to get the sensors', data);
        self.sensors = data;
      },function(data){
        console.log('fail when trying to get the sensors',data);
      });
    };

    self.change = function(selectedGoal) {
      console.log('select : ',selectedGoal);
      ServiceGoal.getRequired(selectedGoal, function(data) {
        // success
        self.badge.currentGoal.comparisons = data;
        console.log(data);
      }, function(data) {
        //error
        console.log(data);
      });
    };
    self.getSensors();
    self.getGoals();
  }]);
