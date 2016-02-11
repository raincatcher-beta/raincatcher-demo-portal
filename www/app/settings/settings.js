'use strict';

module.exports = 'app.settings';

angular.module('app.settings', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.settings', {
      url: '/settings',
      data: {
        columns: 2
      },
      views: {
        content: {
          templateUrl: 'app/settings/settings.tpl.html',
          controller: 'settingsController as ctrl'
        }
      }
    })
})

.controller('settingsController', function () {
})

;
