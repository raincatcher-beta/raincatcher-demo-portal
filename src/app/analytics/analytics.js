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
  var barChart = c3.generate({
    bindto: '#bar-chart',
    size: {
      width: 450
    },
    data: {
      columns: [
        ['data1', 30, 200, 100],
        ['data2', 130, 100, 140],
        ['data3', 130, 150, 200]
      ],
      type: 'bar'
    },
    bar: {
      width: {
        ratio: .8
      }
    }
  });

  var workerMap = {};
  workers.forEach(function(worker) {
    workerMap[worker.id] = worker;
  });

  var workorderCounts = {};
  workorders.forEach(function(workorder) {
    workorderCounts[workorder.assignee] = workorderCounts[workorder.assignee] || 0;
    workorderCounts[workorder.assignee]++;
  });

  var columns = [];
  _.forIn(workorderCounts, function(count, workerid) {
    var worker = workerMap[workerid];
    var name = worker ? worker.name : 'Unassigned';
    var column = [name, count];
    columns.push(column);
  });

  console.log(columns);

  var pieChart = c3.generate({
    bindto: '#pie-chart',
    size: {
      width: 450
    },
    data: {
        columns: columns,
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
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
