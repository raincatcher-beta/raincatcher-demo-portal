/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var d3 = require('d3')
var c3 = require('c3')
var _ = require('lodash');

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
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/analytics/analytics.tpl.html',
          controller: 'analyticsController as ctrl'
        }
      }
    })
})

.controller('analyticsController', function (workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;

  //add fake data for bar charts
  self.workorders.forEach(function(workorder) {
    var estimated  = Math.floor((Math.random() * 10) + 15);
    var real = Math.floor((Math.random() * 10) + 15);
    workorder.estimatedHours = estimated;
    workorder.effectiveHours = real;
  });

  var areaChart = c3.generate({
    bindto: '#area-chart',
    size: {
      width: 450
    },
    data: {
      columns: [
        ['data1', 300, 350, 300, 0, 0, 0],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
    types: {
      data1: 'area',
      data2: 'area-spline'
    }
  }
});

})

;
