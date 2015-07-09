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
      .otherwise({
        redirectTo: '/'
      });
  });
