'use strict';

var angular = require('angular');

angular.module('app.workorder', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder', {
      url: '/workorders/list',
      views: {
        column2: {
          template: '<div layout="column" class="inner-column"><workorder-portal-list list="workorderListController.workorders"></workorder-portal-list></div>',
          controller: 'WorkorderListController as workorderListController',
          resolve: {
            workorders: function(mediator) {
              mediator.publish('workorders:load');
              return mediator.promise('workorders:loaded');
            }
          }
        },
        'content': {
          template: '<button class="btn" ui-sref="app.workorder.new">New Workorder</button>',
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          template: '<workorder-form value="ctrl.workorder"></workorder-form>',
          controller: 'WorkorderNewController as ctrl',
          resolve: {
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
          templateUrl: '/app/workorder/workorder.tpl.html',
          controller: 'WorkorderController as ctrl',
          resolve: {
            steps: function(mediator) {
              mediator.publish('workflow:steps:load');
              return mediator.promise('workflow:steps:loaded');
            },
            workorder: function(mediator, $stateParams) {
              mediator.publish('workorder:load', $stateParams.workorderId);
              return mediator.promise('workorder:loaded');
            }
          }
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        'content@app': {
          template: '<workorder-form value="ctrl.workorder"></workorder-form>',
          controller: 'WorkorderFormController as ctrl',
          resolve: {
            workorder: function(mediator, $stateParams) {
              mediator.publish('workorder:load', $stateParams.workorderId);
              return mediator.promise('workorder:loaded');
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
})

.controller('WorkorderListController', function (mediator, workorders) {
  var self = this;
  self.workorders = workorders;
})

.controller('WorkorderController', function (mediator, steps, workorder) {
  var self = this;

  self.steps = steps;
  self.workorder = workorder;

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('workflow:begin', workorder.id);
    event.preventDefault();
  };
})

.controller('WorkorderNewController', function(workorder, mediator) {
  var self = this;

  self.workorder = workorder;

  mediator.subscribe('workorder:edited', function(workorder) {
    if (!workorder.id && workorder.id !== 0) {
      mediator.publish('workorder:create', workorder);
      mediator.once('workorder:created', function(workorder) {
        mediator.publish('workorder:selected', workorder);
      })
    }
  });
})

.controller('WorkorderFormController', function ($state, mediator, workorder) {
  var self = this;

  self.workorder = workorder;

  mediator.subscribe('workorder:edited', function(workorder) {
    mediator.publish('workorder:save', workorder);
    mediator.once('workorder:saved', function(workorder) {
      $state.go('app.workorder', {
        workorderId: workorder.id
      });
    })
  });
})

;

module.exports = 'app.workorder';
