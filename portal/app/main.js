'use strict';

var angular = require('angular');

angular.module('app', [
  require('angular-ui-router')
, require('wfm-mediator')
, require('wfm-workorder')
, require('wfm-workflow')
, require('./home/home')
, require('./workorder/workorder')
, require('./workorder/workorder-list')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html'
    });
});
