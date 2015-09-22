'use strict';

var angular = require('angular');
require('../lib/feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-workflow')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')

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
