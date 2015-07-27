'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
  .controller('BadgeCtrl',['ServiceGoal','ServiceChallenge','ServiceSensor','Sign',
      function (ServiceGoal, ServiceChallenge, ServiceSensor, Sign) {
    var self = this;
    self.badge = {};
    self.goals = [];
    self.badge.currentGoal = {};
    self.sign = Sign;
    self.addBadge = function () {
        var badgeToSend = {};
        badgeToSend.name = self.badge.name;
        badgeToSend.description = self.badge.description;
        badgeToSend.points = self.badge.points;
        badgeToSend.goals = [];
        badgeToSend.goals.push(self.badge.currentGoal);
        var toSend = angular.toJson(badgeToSend);
        console.log('badge to send : ',toSend);
        ServiceChallenge.post(toSend, function(data) {
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
        for(var sens in data){
            self.sensors.push(data[sens].name);
        }
      },function(data){
        console.log('fail when trying to get the sensors',data);
      });
    };

    self.change = function(selectedGoal) {
      console.log('select : ',selectedGoal);
      ServiceGoal.getRequired(selectedGoal, function(data) {
        // success
        console.log('win to get required',data);
        self.badge.currentGoal.id = selectedGoal;
        self.badge.currentGoal.conditions = {};
        for(var posCond in data.conditions){
            var condition = data.conditions[posCond];
            if(condition.leftValue.sensor) {
                self.badge.currentGoal.conditions[condition.leftValue.name] = '';
            }
            if(condition.rightValue.sensor){
                self.badge.currentGoal.conditions[condition.rightValue.name] = '';
            }
        }
        self.currentGoal = {conditions: data.conditions};
      }, function(data) {
        //error
        console.log('error when trying to get a goal : ',data);
      });
    };

    self.changeSensor = function(sensor, nameSensor){
        this.change = false;
        for(var posCondition in self.badge.currentGoal.conditions){
            var curCondition = self.badge.currentGoal.conditions[posCondition];
            if(curCondition.name === nameSensor){
                curCondition.sensor = sensor.name;
                this.change = true;
                break;
            }
        }
        if(!this.change){
            this.condition = {};
            this.condition.name = nameSensor;
            this.condition.sensor = sensor.name;
            self.badge.currentGoal.conditions.push(this.condition);
        }
    };

    self.getValue = function(nameSensor){
        for(var posCondition in self.badge.currentGoal.conditions) {
            var curCondition = self.badge.currentGoal.conditions[posCondition];
            if(curCondition.name === nameSensor){
                return curCondition.sensor;
            }
        }
        return null;
    };

    self.getSensors();
    self.getGoals();
  }]);
