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
              mediator.publish('workflows:load');
              return mediator.promise('done:workflows:load');
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
            workflow: function($stateParams, mediator) {
              mediator.publish('workflow:load', $stateParams.workflowId);
              return mediator.promise('workflow:loaded');
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
              mediator.publish('workflows:load');
              return mediator.promise('done:workflows:load');
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

.controller('WorkflowListController', function (mediator, workflows, $stateParams) {
  var self = this;
  self.workflows = workflows;
  self.selectedWorkflowId = $stateParams.workflowId;
  self.selectWorkflow = function(event, workflow) {
    self.selectedWorkflowId = workflow.id;
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
    mediator.request('workflow:save', workflow, {uid: workflow.id}).then(function(workflow) {
      $state.go('app.workflow', {
        workflowId: workflow.id
      });
    }, function(error) {
      console.log(error);
    })
  });
})

;

module.exports = 'app.workflow';
