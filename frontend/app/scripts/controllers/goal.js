'use strict';

var app = angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['ServiceGoal','ServiceBadgeV2', function (ServiceGoal, ServiceBadgeV2) {

    var self = this;
    self.goal = {};
    self.goal.conditions = [];
    self.goal.name = '';
    self.goal.timeBox = {};
    self.goal.timeBox.startDate = new Date();
    self.goal.timeBox.endDate = new Date();
    self.badges = [];
    self.selectedBadge = null;

    this.addGoal = function () {
        self.goal.badgeID = self.selectedBadge.id;
        console.log(angular.toJson(self.goal));
        ServiceGoal.post(angular.toJson(self.goal),function() {
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
        iteration.sensor = (type==='sensor');
        iteration.value = null;
    };

    this.changeDayOfWeekFilter = function(iteration, dayOfWeekFilter) {
      if(iteration.filter == null) {
        iteration.filter = {};
      }
      iteration.filter.dayOfWeekFilter = dayOfWeekFilter;
    };

    this.changePeriodOfDayFilter = function(iteration, periodOfDayFilter) {
      if(iteration.filter == null) {
        iteration.filter = {};
      }
      iteration.filter.periodOfDayFilter = periodOfDayFilter;
    };

    self.addComparison = function(){
        self.goal.conditions[self.goal.conditions.length] = {
            type:'comparison',
            threshold:100,
            expression:{
                comparison:null,
                type:'number',
                valueLeft:{
                    value:null,
                    sensor:true
                },
                valueRight:{
                    value:null,
                    sensor:false
                },
                description:null
            }
        };
    };

    self.addOverall = function(){
        self.goal.conditions[self.goal.conditions.length] = {
            type:'overall',
            threshold:100,
            expression:{}
        };
    };

    self.checkPercent = function(iteration){
        if(iteration.threshold<0) {
            iteration.threshold = 0;
        }else if(iteration.threshold>100) {
            iteration.threshold = 100;
        }
    };

    self.week = function(){
        var d = new Date(0,0,7,0,0,0,0);
        return d;
    };

    self.month = function(){
        var d = new Date(0,1,0,0,0,0,0);
        return d;
    };

    self.year = function(){
        var d = new Date(1,0,0,0,0,0,0);
        return d;
    };

    ServiceBadgeV2.get('all',function(data){
        console.log('Achieve to get the badges V2 ', data);
        self.badges = data;
    }, function(data){
        console.log('Fail to get the badges V2', data);
    });

    self.nbBadge = 0;
    self.selectedBadge = [];
}]);

app.directive('stringForm', function(){
  return{
    restrict:'E',
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

app.directive('addBadges', function(){
    return{
        restrict:'E',
        templateUrl:'../../views/create goal/add-badges.html'
    };
});

app.directive('overall', function(){
    return{
        restrict:'E',
        templateUrl:'../../views/create goal/overall.html'
    };
});

app.directive('comparison', function(){
    return{
        restrict:'E',
        templateUrl:'../../views/create goal/comparison.html'
    };
});
