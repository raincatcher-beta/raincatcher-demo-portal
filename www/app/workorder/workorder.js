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
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workflows: function(workflowManager) {
          return workflowManager.list();
        },
        resultManager: function(resultSync) {
          return resultSync.managerPromise;
        },
      },
      views: {
        column2: {
          templateUrl: 'app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController',
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
            workorder: function($stateParams, appformClient, workorderManager) {
              return workorderManager.read($stateParams.workorderId)
            },
            results: function($stateParams, appformClient, resultManager) {
              return resultManager.list()
              .then(function(results) {
                return resultManager.filter(results, $stateParams.workorderId);
              })
              .then(function(results) {
                if (_.isEmpty(results)) {
                  return results;
                }
                var appformResults = _.filter(results, function(result) {
                  return !! result.step.formId;
                });
                if (_.isEmpty(appformResults)) {
                  return results;
                }
                var submissionIds = _.map(appformResults, function(result) {
                  return result.submission.submissionId;
                });
                return appformClient.getSubmissions(submissionIds)
                  .then(function(responses) {
                    responses.forEach(function(response) {
                      var submission = response.value;
                      appformResults.filter(function(result) {
                        return result.submission.submissionId === submission.props._id;
                      }).forEach(function(result) {
                        result.submission._submission = submission;
                      });
                    });
                  })
                  .then(function() {
                    return results;
                  })
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
            workorder: function($stateParams, workorderManager) {
              return workorderManager.read($stateParams.workorderId);
            },
            workers: function(userClient) {
              return userClient.list();
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: true }
    );
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

.controller('WorkorderDetailController', function (mediator, workflows, workorder, results) {
  var self = this;

  self.workorder = workorder;
  self.workflow = workflows[workorder.workflowId];
  self.results = results;
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

  mediator.subscribe('workorder:created', function(workorder) {
    workorderManager.create(workorder).then(function(_workorder) {
      mediator.publish('workorder:selected', _workorder);
    });
  });
})

.controller('WorkorderFormController', function ($state, mediator, workorderManager, workorder, workflows, workers) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;

  mediator.subscribe('workorder:edited', function(workorder) {
    return workorderManager.update(workorder).then(function(_workorder) {
      mediator.publish('workorder:selected', _workorder);
    })
  });
})

;

module.exports = 'app.workorder';
