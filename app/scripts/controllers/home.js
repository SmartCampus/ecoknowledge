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
    .controller('HomeCtrl', ['ServiceBadge', 'ServiceGoal',function (ServiceBadge, ServiceGoal) {
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
      ServiceBadge.get('',function(data) {
          self.badges =  data;
        },function(data) {
          console.debug('Fail to get the badges',data);
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
      ServiceBadge.evaluate(badgeName,self.nombre,function(data){
          console.debug(data);
      },function(data){
          console.debug(data);
      });
    };

    self.getGoals();
    self.getBadges();
    }]);

app.directive("listGoal", function() {
    return {
        restrict: "E",
        templateUrl: "views/list-goal.html",
        controller: 'HomeCtrl',
        controllerAs: "homeCtrl"
    }});

app.directive("listBadge", function() {
    return {
        restrict: "E",
        templateUrl: "views/list-badge.html"
    }});

app.directive("homepageBadge", function() {
    return {
        restrict: "E",
        templateUrl: "views/homepage-badge.html"
    }});