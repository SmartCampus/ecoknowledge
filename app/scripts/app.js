'use strict';

/**
 * @ngdoc overview
 * @name ecoknowledgeApp
 * @description
 * # ecoknowledgeApp
 *
 * Main module of the application.
 */
angular
  .module('ecoknowledgeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/homepage.html',
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
      .otherwise({
        redirectTo: '/'
      });
  });
