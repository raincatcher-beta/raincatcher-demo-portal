'use strict';

var angular = require('angular');
require('../lib/feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')

, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./home/home')
, require('./appform/appform')
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
})

.run(function($rootScope) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});
