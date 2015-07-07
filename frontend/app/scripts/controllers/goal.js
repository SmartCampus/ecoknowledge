'use strict';

var app = angular.module('ecoknowledgeApp')
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

      this.changeComparison = function(iteration,change){
        iteration.type = change;
        iteration.valueLeft = {};
        iteration.valueRight = {};
        iteration.comparison = null;
        if(change==='boolean'){
          iteration.comparison = '===';
        }
      };

      this.changeType = function(iteration, type){
          if(type==='sensor'){
            iteration.sensor=true;
          }else{
            iteration.sensor=false;
          }
      };

      self.addComparison = function(){
          self.goal.conditions[self.goal.conditions.length] = {};
      };

      self.addComparison();
    }]);

app.directive('stringForm', function(){
  return{
    retrict:'E',
    templateUrl:'../../views/create goal/string-form.html'
  };
});

app.directive('booleanForm', function(){
  return{
    restrict:'E',
    templateUrl:'../../views/create goal/boolean-form.html'
  };
});

app.directive('numberForm', function(){
  return{
    restrict:'E',
    templateUrl:'../../views/create goal/number-form.html'
  };
});