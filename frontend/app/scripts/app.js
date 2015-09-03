'use strict';

/**
 * @ngdoc overview
 * @name ecoknowledgeApp
 * @description
 * # ecoknowledgeApp
 *
 * Main module of the application.
 */
var app = angular
  .module('ecoknowledgeApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/dashboard/view/', {
        templateUrl: '../views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs:'dashboard'
      })
      .when('/dashboard/view/:id/', {
        templateUrl: '../views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs:'dashboard'
      })
      .when('/dashboard/view/:id/:dashboardType', {
        templateUrl: '../views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs:'dashboard'
      })
      .when('/create-goal', {
        templateUrl: '../views/create-goal.html',
        controller: 'GoalCtrl'
      })
      .otherwise({
        redirectTo: '/lolerreurdansredirectionangulareuuuh/'
      });

    /*
    $routeProvider
      .when('/', {
        templateUrl: '../views/homepage/homepage.html',
        controller: 'HomeCtrl',
        controllerAs: 'homeCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/create-goal', {
        templateUrl: 'views/create-goal.html',
        controller: 'GoalCtrl'
      })
      .when('/create-badge', {
        templateUrl: 'views/create-badge.html',
        controller: 'BadgeCtrl',
        controllerAs: 'badgeCreateCtrl'
      })
      .when('/view-goal/:goalId', {
          templateUrl: 'views/view-goal.html',
          controller: 'ViewGoalCtrl',
          controllerAs: 'viewGoalCtrl'
        })
      .when('/create-badge-perso', {
          templateUrl: 'views/create-badge-perso.html',
          controller: 'BadgeCtrlV2'
        })
      .when('/dashboard', {
        templateUrl: '../views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs:'dashboard'
      })
      .when('/login', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        controllerAs:'loginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      */
  });


app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++) {
      input.push(i);
    }
    return input;
  };
});
