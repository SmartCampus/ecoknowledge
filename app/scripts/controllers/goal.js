'use strict';

(function () {
  angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['ServiceGoal', function (ServiceGoal) {
      this.goal = {};

      var self = this;

      this.addGoal = function () {
        console.log(self.goal);
        ServiceGoal.post(self.goal,function() {
            console.log('Achieve to add a goal', self.goal);
          },function(){
            console.log('Fail when trying to add a goal', self.goal);
        })
      };
    }]);
})();
