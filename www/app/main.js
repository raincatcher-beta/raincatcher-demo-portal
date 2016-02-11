'use strict';

var angular = require('angular');
require('../lib/feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-result')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')

, require('./auth/auth')
, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./home/home')
, require('./appform/appform')
, require('./worker/worker')
, require('./group/group')
, require('./message/message')
, require('./schedule/schedule')
, require('./map/map')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      data: {
        columns: 3
      },
      resolve: {
        workorderManager: function(workorderSync) {
          return workorderSync.createManager();
        },
        profileData: function(userClient) {
          return userClient.getProfile();
        }
      },
      controller: function($scope, $state, mediator, profileData){
        console.log('profileData', profileData);
        $scope.profileData = profileData;
        mediator.subscribe('wfm:auth:profile:change', function(_profileData) {
          $scope.profileData = _profileData;
        });
        $scope.$state = $state;
        $scope.navigateTo = function(state, params) {
          if (state) {
            $state.go(state, params);
          }
        }
      }
    });
})

.run(function($rootScope, $state, userClient) {
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if(toState.name !== "app.login"){
      userClient.hasSession().then(function(hasSession) {
        if(!hasSession) {
          e.preventDefault();
          $rootScope.toState = toState;
          $rootScope.toParams = toParams;
          $state.go('app.login');
        }
      });
    };
  });
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
