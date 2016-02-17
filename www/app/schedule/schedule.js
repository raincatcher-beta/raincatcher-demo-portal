/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

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
