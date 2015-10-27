'use strict';

var angular = require('angular');
require('angular-messages');

angular.module('app.workorder', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder', {
      url: '/workorders/list',
      views: {
        column2: {
          templateUrl: '/app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController',
          resolve: {
            workorders: function(mediator) {
              mediator.publish('workorders:load');
              return mediator.promise('done:workorders:load');
            }
          }
        },
        'content': {
          templateUrl: '/app/workorder/empty.tpl.html',
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: '/app/workorder/workorder-new.tpl.html',
          controller: 'WorkorderNewController as ctrl',
          resolve: {
            workflows: function(mediator) {
              mediator.publish('workflows:load');
              return mediator.promise('workflows:loaded');
            },
            workorder: function(mediator) {
              mediator.publish('workorder:new');
              return mediator.promise('workorder:new:done');
            }
          }
        }
      }
    })
    .state('app.workorder.detail', {
      url: '/workorder/:workorderId',
      views: {
        'content@app': {
          templateUrl: '/app/workorder/workorder-detail.tpl.html',
          controller: 'WorkorderDetailController as ctrl',
          resolve: {
            workflows: function(mediator) {
              mediator.publish('workflows:load');
              return mediator.promise('workflows:loaded');
            },
            workorder: function(mediator, $stateParams) {
              mediator.publish('workorder:load', $stateParams.workorderId);
              return mediator.promise('done:workorder:load');
            }
          }
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        'content@app': {
          templateUrl: '/app/workorder/workorder-edit.tpl.html',
          controller: 'WorkorderFormController as ctrl',
          resolve: {
            workflows: function(mediator) {
              mediator.publish('workflows:load');
              return mediator.promise('workflows:loaded');
            },
            workorder: function(mediator, $stateParams) {
              mediator.publish('workorder:load', $stateParams.workorderId);
              return mediator.promise('done:workorder:load');
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder.detail', {
      workorderId: workorder.id
    });
  });
  mediator.subscribe('workflow:selected', function(workflow) {
    $state.go('app.workflow.detail', {
      workflowId: workflow.id
    });
  });
})

.controller('WorkorderListController', function (mediator, workorders) {
  var self = this;
  self.workorders = workorders;
})

.controller('WorkorderDetailController', function (mediator, workflows, workorder) {
  var self = this;

  self.workorder = workorder;
  self.workflow = workflows[workorder.workflowId];
  self.steps = self.workflow.steps;

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('workflow:begin', workorder.id);
    event.preventDefault();
  };
})

.controller('WorkorderNewController', function(workorder, workflows, mediator) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;

  mediator.subscribe('workorder:edited', function(workorder) {
    if (!workorder.id && workorder.id !== 0) {
      mediator.publish('workorder:create', workorder);
      mediator.once('workorder:created', function(workorder) {
        mediator.publish('workorder:selected', workorder);
      })
    }
  });
})

.controller('WorkorderFormController', function ($state, mediator, workorder, workflows) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;

  mediator.subscribe('workorder:edited', function(workorder) {
    mediator.publish('workorder:save', workorder);
    mediator.once('done:workorder:save', function(workorder) {
      $state.go('app.workorder', {
        workorderId: workorder.id
      });
    })
  });
})

;

module.exports = 'app.workorder';
