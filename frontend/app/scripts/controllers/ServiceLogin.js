'use strict';

var app = angular.module('ecoknowledgeApp');

var loginBasePath = 'http://localhost:3000/login/';

app.service('ServiceLogin', ['$http', function ServiceLogin($http) {

  this.get = function(successFunc, failFunc) {
    $http.get(loginBasePath)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };

  this.login = function (username, successFunc, failFunc) {

    var path = loginBasePath + '';
    var dataToSend = {username:username};
    console.log('ServiceLogin : login', path, 'with data', dataToSend);
    $http.post(path, dataToSend)
      .success(function (data) {
        console.log('Current user has obtained token : ', data.data.token);
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };
}]);
