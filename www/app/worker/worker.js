'use strict';

var angular = require('angular');
require('angular-messages');

angular.module('app.worker', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
, require('ng-sortable')
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.worker', {
      url: '/workers/list',
      views: {
        column2: {
          templateUrl: '/app/worker/worker-list.tpl.html',
          controller: 'WorkerListController as ctrl',
        },
        'content': {
          templateUrl: '/app/worker/empty.tpl.html',
        }
      }
    })
    .state('app.worker.detail', {
      url: '/worker/:workerId',
      views: {
        'content@app': {
          templateUrl: '/app/worker/worker-detail.tpl.html',
          controller: 'WorkerDetailController as ctrl',
        }
      }
    })
    .state('app.worker.edit', {
      url: '/worker/:workerId/edit',
      views: {
        'content@app': {
          templateUrl: '/app/worker/worker-edit.tpl.html',
          controller: 'WorkerFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('worker:selected', function(worker) {
    $state.go('app.worker.detail', {
      workerId: worker.id
    });
  });
})

.controller('WorkerListController', function (mediator) {
})

.controller('WorkerDetailController', function (mediator) {
})

.controller('WorkerFormController', function (mediator) {
})

;

module.exports = 'app.worker';
