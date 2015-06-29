'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
  .controller('BadgeCtrl',['$http', function ($http) {
    var self = this;
    self.badge = {};
    self.goals = [];

    self.addBadge = function () {
      console.log(self.badge);

      $http.post('http://localhost:3000/addbadge', self.badge).
        success(function(data) {
          console.debug(data);
        }).
        error(function() {
        });
    };

    //TODO link au serveur
    self.getGoals = function () {
      self.goals = [];

      $http.get('http://localhost:3000/goals', this.goal).
        success(function (data) {
          for(var i in data) {
            var currentGoalDescr = data[i];
            self.goals.push(currentGoalDescr);
          }

        }).
        error(function () {
        });

      // TODO redirection on success
      // $location.path('/about');
    };


    self.getGoals();
  }]);
