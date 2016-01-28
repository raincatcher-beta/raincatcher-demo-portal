'use strict';

var angular = require('angular');
var _ = require('lodash');

module.exports = 'app.schedule';

angular.module('app.schedule', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.schedule', {
      url: '/schedule',
      data: {
        columns: 2
      },
      views: {
        content: {
          templateUrl: 'app/schedule/schedule.tpl.html',
          controller: 'scheduleController as ctrl'
        }
      }
    })
})

.controller('scheduleController', function (mediator) {
})

;
