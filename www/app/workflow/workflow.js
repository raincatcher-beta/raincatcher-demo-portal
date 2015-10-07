'use strict';

var angular = require('angular');
require('angular-messages');

angular.module('app.workflow', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
, require('ng-sortable')
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workflow', {
      url: '/workflows/list',
      views: {
        column2: {
          templateUrl: '/app/workflow/workflow-list.tpl.html',
          controller: 'WorkflowListController as ctrl',
          resolve: {
            workflows: function(mediator) {
              mediator.publish('workflow:steps:load');
              return mediator.promise('workflow:steps:loaded').then(function(steps) {
                return [{
                  id: 0,
                  steps: steps,
                  title: 'First workflow'
                }];
              });
            }
          }
        },
        'content': {
          templateUrl: '/app/workflow/empty.tpl.html',
        }
      }
    })
    .state('app.workflow.detail', {
      url: '/workflow/:workflowId',
      views: {
        'content@app': {
          templateUrl: '/app/workflow/workflow-detail.tpl.html',
          controller: 'WorkflowDetailController as ctrl',
          resolve: {
            workflow: function(mediator) {
              mediator.publish('workflow:steps:load');
              return mediator.promise('workflow:steps:loaded').then(function(steps) {
                return {
                  id: 0,
                  steps: steps,
                  title: 'First workflow'
                };
              });
            }
          }
        }
      }
    })
    .state('app.workflow.edit', {
      url: '/workflow/:workflowId/edit',
      views: {
        'content@app': {
          templateUrl: '/app/workflow/workflow-edit.tpl.html',
          controller: 'WorkflowFormController as ctrl',
          resolve: {
            workflows: function(mediator) {
              mediator.publish('workflow:steps:load');
              return mediator.promise('workflow:steps:loaded').then(function(steps) {
                return [{
                  id: 0,
                  steps: steps,
                  title: 'First workflow'
                }];
              });
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workflow:selected', function(workflow) {
    $state.go('app.workflow.detail', {
      workflowId: workflow.id
    });
  });
})

.controller('WorkflowListController', function (mediator, workflows) {
  var self = this;
  self.workflows = workflows;
  self.selectWorkflow = function(event, workflow) {
    self.selectedWorkflow = workflow;
    mediator.publish('workflow:selected', workflow);
  };
})

.controller('WorkflowDetailController', function ($scope, mediator, workflow) {
  var self = this;
  $scope.dragControlListeners = {
    containment: '#stepList'
  }
  self.workflow = workflow;
})

.controller('WorkflowFormController', function ($state, mediator, workflow) {
  var self = this;

  self.workflow = workflow;

  mediator.subscribe('workflow:edited', function(workflow) {
    mediator.publish('workflow:save', workflow);
    mediator.once('workflow:saved', function(workflow) {
      $state.go('app.workflow', {
        workflowId: workflow.id
      });
    })
  });
})

;

module.exports = 'app.workflow';
