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
      controller: 'WorkorderController as ctrl',
      resolve: {
        initialData: function($q, mediator) {
          var deferred = $q.defer();
          mediator.publish('workflow:init');
          mediator.once('workflow:init:done', function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      }
    })
    .state('app.workorder-edit', {
      url: '/workorder/:workorderId/edit',
      templateUrl: '/app/workorder/workorder-form.tpl.html',
      controller: 'WorkorderFormController as ctrl'
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})

.controller('WorkorderController', function ($stateParams, mediator, initialData) {
  var self = this;

  self.steps = initialData.steps;

  mediator.publish('workorder:load', $stateParams.workorderId);
  mediator.once('workorder:loaded', function(workorder) {
    self.workorder = workorder;
  });

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('workflow:begin', workorder.id);
    event.preventDefault();
  };
})

.controller('WorkorderFormController', function ($stateParams, mediator) {
  var self = this;

  if ($stateParams.workorderId === 'new') {
    self.workorder = {type: 'Job Order'};
  } else {
    mediator.publish('workorder:load', $stateParams.workorderId);
    mediator.once('workorder:loaded', function(workorder) {
      self.workorder = workorder;
    });
  }

  mediator.subscribe('workorder:edited', function(workorder) {
    if (!workorder.id && workorder.id !== 0) {
      mediator.publish('workorder:create', workorder);
      mediator.once('workorder:created', function(workorder) {
        mediator.publish('workorder:selected', workorder);
      })
    }
  });
})

;

module.exports = 'app.workorder';
