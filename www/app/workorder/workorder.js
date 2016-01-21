'use strict';

var angular = require('angular');
var _ = require('lodash');
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
          templateUrl: 'app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController',
          resolve: {
            workorders: function(workorderManager) {
              return workorderManager.list();
            }
          }
        },
        'content': {
          templateUrl: 'app/workorder/empty.tpl.html',
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-new.tpl.html',
          controller: 'WorkorderNewController as ctrl',
          resolve: {
            workflows: function(workflowManager) {
              return workflowManager.list();
            },
            workorder: function(workorderManager) {
              return workorderManager.new();
            }
          }
        }
      }
    })
    .state('app.workorder.detail', {
      url: '/workorder/:workorderId',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-detail.tpl.html',
          controller: 'WorkorderDetailController as ctrl',
          resolve: {
            workflows: function(workflowManager) {
              return workflowManager.list();
            },
            workorder: function($stateParams, appformClient, workorderManager) {
              return workorderManager.read($stateParams.workorderId)
              .then(function(workorder) {
                if (workorder.steps) { // TODO: re-factor this logic into the appropriate WFM module
                  var appformSteps = _.filter(workorder.steps, function(appformStep) {
                    return !! appformStep.workflowStep.formId;
                  });
                  var submissionIds = _.map(appformSteps, function(step) {
                    return step.submission.submissionId;
                  });
                  return appformClient.getSubmissions(submissionIds)
                  .then(function(results) {
                    results.forEach(function(result) {
                      var submission = result.value;
                      appformSteps.filter(function(appformStep) {
                        return appformStep.submission.submissionId === submission.props._id;
                      }).forEach(function(appformStep) {
                        appformStep.submission._submission = submission;
                      });
                    });
                    return workorder;
                  });
                } else {
                  return workorder;
                }
              });
            }
          }
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-edit.tpl.html',
          controller: 'WorkorderFormController as ctrl',
          resolve: {
            workflows: function(workflowManager) {
              return workflowManager.list();
            },
            workorder: function($stateParams, workorderManager) {
              return workorderManager.read($stateParams.workorderId);
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

.controller('WorkorderListController', function (workorders) {
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

.controller('WorkorderNewController', function(workorder, workflows, mediator, workorderManager) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;

  mediator.subscribe('workorder:edited', function(workorder) {
    if (!workorder.id && workorder.id !== 0) {
      workorderManager.create(workorder).then(function() {
        mediator.publish('workorder:selected', workorder);
      });
    }
  });
})

.controller('WorkorderFormController', function ($state, mediator, workorder, workflows) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;

  mediator.subscribe('workorder:edited', function(workorder) {
    return workorderManager.update(workorder).then(function() {
      $state.go('app.workorder', {
        workorderId: workorder.id
      });
    })
  });
})

;

module.exports = 'app.workorder';
