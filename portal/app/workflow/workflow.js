'use strict';

var angular = require('angular');

angular.module('app.workflow', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function ($stateProvider) {
  $stateProvider
    .state('app.workflow', {
      abstract: true,
      url: '/workorder/:workorderId/workflow',
      templateUrl: '/app/workflow/workflow.tpl.html',
      controller: 'WorkflowController as workflowController'
    })
    .state('app.workflow.person', {
      url: '/person',
      template: '<person-form></person-form>'
    })
    .state('app.workflow.address', {
      url: '/address',
      template: '<address-form></address-form>'
    })
    .state('app.workflow.location', {
      url: '/location',
      template: '<google-maps-form></google-maps-form>'
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workflow:begin', function(data) {
    $state.go('app.workflow.person', {
      workorderId: data
    });
  });
})

.controller('WorkflowController', function ($state, $stateParams, mediator) {
  var self = this;

  mediator.publish('workorder:load', $stateParams.workorderId);
  mediator.once('workorder:loaded', function(workorder) {
    self.workorder = workorder;
  });

  mediator.once('workflow:person:next', function(person) {
    self.workorder.person = person;
    mediator.publish('workorder:save', self.workorder);
    mediator.once('workorder:saved', function(workorder) {
      $state.go('app.workflow.address', { workorderId: workorder.id });
    });
  });

  mediator.once('workflow:address:next', function(address) {
    self.workorder.address = address;
    mediator.publish('workorder:save', self.workorder);
    mediator.once('workorder:saved', function(workorder) {
      $state.go('app.workflow.location', { workorderId: workorder.id });
    });
  });

  mediator.once('workflow:google-maps:next', function(location) {
    self.workorder.location = location;
    mediator.publish('workorder:save', self.workorder);
    mediator.once('workorder:saved', function(workorder) {
      $state.go('app.workorder', { workorderId: workorder.id });
    });
  });
})
;

module.exports = 'app.workflow';
