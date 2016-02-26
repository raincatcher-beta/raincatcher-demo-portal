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
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
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

.controller('scheduleController', function (workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;
  var workordersOnDate = workorders.filter(function(workorder) {
    return true; // TODO: apply a date selective filter here
  });
  var workordersByWorker = {};
  workordersOnDate.forEach(function(workorder) {
    workordersByWorker[workorder.assignee] = workordersByWorker[workorder.assignee] || [];
    workordersByWorker[workorder.assignee].push(workorder);
  });

  self.timegrid = {};
  self.workers.forEach(function(worker) {
    self.timegrid[worker.id] = [];
    for (var i = 0; i < 24; i++) {
      self.timegrid[worker.id][i] = null;
    }
    var workorders = workordersByWorker[worker.id]
    if (workorders) {
      workorders.forEach(function(workorder) {
        var duration = 3; // hours
        var hour = new Date(workorder.finishTimestamp).getHours();
        var timeslot = self.timegrid[workorder.assignee][hour];
        if (timeslot) {
          self.timegrid[workorder.assignee][hour] = {
            title: 'conflict'
          }
        } else {
          self.timegrid[workorder.assignee][hour] = {
            title: workorder.type + ' #' + workorder.id
          }
        }
      });
    }
  });

  console.log(self.timegrid);
})

;
