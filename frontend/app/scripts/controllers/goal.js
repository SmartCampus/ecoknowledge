'use strict';

var app = angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['ServiceGoal', function (ServiceGoal) {

      var self = this;
      self.goal = {};
      self.goal.conditions = [];
      self.goal.name = '';
      self.goal.timebox = {};
      self.goal.timebox.debut = new Date();
      self.goal.timebox.fin = new Date();

      self.type = ['Température', 'Porte'];

      this.addGoal = function () {
        console.log(self.goal.toJSON());
        ServiceGoal.post(self.goal.toJSON(),function() {
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
          iteration.sensor= (type==='sensor');
      };

      self.addComparison = function(){
          self.goal.conditions[self.goal.conditions.length] = {type:'comparison'};
      };

      self.addComparison();
    }]);

app.directive('stringForm', function(){
  return{
    retrict:'E',
    templateUrl:'../../views/create goal/string-form.html'
  };
});


app.directive('dateValidityGoal', function(){
  return{
    restrict:'E',
    templateUrl:'../../views/create goal/date-validity-goal.html'
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

app.directive('conditions', function(){
  return{
    restrict:'E',
    templateUrl:'../../views/create goal/conditions.html'
  };
});
