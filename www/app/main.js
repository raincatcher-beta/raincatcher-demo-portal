'use strict';

var angular = require('angular');
require('../lib/feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-workflow')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-appform')

, require('./home/home')
, require('./appform/appform')
, require('./workorder/workorder')
, require('./workflow/workflow')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      controller: function($state, $scope) {
        $scope.$state = $state;
        $scope.navigateTo = function(state, params) {
          if (state) {
            $state.go(state, params);
          }
        }
      }
    });
});
