'use strict';

var angular = require('angular');

angular.module('app.workorder', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder', {
      url: '/workorder/:workorderId',
      templateUrl: '/app/workorder/workorder.tpl.html',
      controller: 'WorkorderController as ctrl'
    });
})

.run(function(mediator, steps) {
  mediator.publish('workflow:steps:load');
  mediator.once('workflow:steps:loaded', function(_steps) {
    Array.prototype.push.apply(steps, _steps);
  });
})

.factory('steps', function() {
  var steps = [];

  return steps;
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})

.controller('WorkorderController', function ($stateParams, mediator, steps) {
  var self = this;

  self.steps = steps;

  mediator.publish('workorder:load', $stateParams.workorderId);
  mediator.once('workorder:loaded', function(workorder) {
    self.workorder = workorder;
  });

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('workflow:begin', workorder.id);
    event.preventDefault();
  };
})
;

module.exports = 'app.workorder';
