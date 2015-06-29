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
    .controller('HomeCtrl', ['$http', function ($http) {
        var self = this;
        self.goals = [];
        self.badges = [];

        //TODO remove this goal
        self.goal ={};
        self.goal.name='Goal n°1';

        /*
         * Add a goal the the array goals
         */

    self.getGoals = function() {
      $http.get('http://localhost:3000/goals').
        success(function(data) {
          self.goals =  data;
        }).
        error(function() {
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

    self.getGoals();
    self.getBadges();
    }]);
