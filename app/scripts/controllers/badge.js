'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
  .controller('BadgeCtrl',['$http','ServiceGoal', function ($http,ServiceGoal) {
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
      ServiceGoal.get('', function(data){
        console.log("achieve to get the goals");
        self.goals = data;
      },function(data){
        console.log('fail when trying to get the goals', data);
      });
      // TODO redirection on success
      // $location.path('/about');
    };


    self.getGoals();
  }]);
