'use strict';

var angular = require('angular');
var _ = require('lodash');

module.exports = 'app.permission';

angular.module('app.permission', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.permission', {
      url: '/permission',
      views: {
        content: {
          templateUrl: 'app/permission/permission.tpl.html',
          controller: 'permissionController as ctrl'
        }
      }
    })
})

.controller('permissionController', function (mediator) {
})

;
