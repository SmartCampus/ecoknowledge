'use strict';

(function () {
  angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['ServiceGoal', function (ServiceGoal) {

      var self = this;
      self.goal = {};
      self.goal.conditions = [];
      self.goal.name = '';


      self.type = ['Température', 'Porte'];

      this.addGoal = function () {
        console.log(self.goal);
        ServiceGoal.post(self.goal,function() {
            console.log('Achieve to add a conditions', self.conditions);
          },function(){
            console.log('Fail when trying to add a conditions', self.conditions);
        });
      };

      self.addComparison = function(){
          this.obj = {};
          this.obj.required=self.type[0];
          self.goal.conditions[self.goal.conditions.length] = this.obj;
      };

      self.addComparison();
    }]);
})();
