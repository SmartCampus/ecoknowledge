'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ecoknowledgeApp for the firstpage which display
 * the objectives and the badges we have.
 */
angular.module('ecoknowledgeApp')
    .controller('HomeCtrl', ['$http', 'ServiceGoal',function ($http, ServiceGoal) {
        var self = this;
        self.goals = [];
        self.badges = [];
        self.nombre = 0;

        /*
         * Add a goal the the array goals
         */

    self.getGoals = function() {
      ServiceGoal.get('',function(data) {
          self.goals =  data;
        },function() {
          console.log('fail to get the goals');
        });
    };

    self.getBadges = function() {
      $http.get('http://localhost:3000/badges').
        success(function(data) {
          self.badges =  data;
        }).
        error(function() {
        });
    };

        self.addGoal = function(g){
            self.goals.push(g);
        };

        /*
         * add a badge to the array badges
         */
        self.addBadge = function(bdg){
            console.log(bdg);
            self.badges.add(bdg);
            console.log(self.badges);
        };

    self.check = function(badgeName) {
      $http.post('http://localhost:3000/evaluatebadge', {"name":badgeName, "value":self.nombre}).
        success(function(data) {
          console.debug(data);
        }).
        error(function() {
        });
    };

    self.getGoals();
    self.getBadges();
    }]);
