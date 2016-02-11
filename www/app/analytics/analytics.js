'use strict';

module.exports = 'app.analytics';

angular.module('app.analytics', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.analytics', {
      url: '/analytics',
      data: {
        columns: 2
      },
      views: {
        content: {
          templateUrl: 'app/analytics/analytics.tpl.html',
          controller: 'analyticsController as ctrl'
        }
      }
    })
})

.controller('analyticsController', function () {
})

;
