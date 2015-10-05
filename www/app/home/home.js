'use strict';
var angular = require('angular');

angular.module('app.home', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('app.home', {
      url: '/home',
      views: {
        column2: {
          templateUrl: 'app/home/nav1.tpl.html'
        }
      , column3: {
        templateUrl: 'app/home/nav2.tpl.html'
      }
      , content: {
          templateUrl: 'app/home/home.tpl.html'
        }
      }
    });
})
;

module.exports = 'app.home';
