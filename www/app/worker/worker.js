'use strict';

var angular = require('angular');
var _ = require('lodash');
require('angular-messages');

module.exports = 'app.worker';

angular.module('app.worker', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.worker', {
      url: '/workers/list',
      views: {
        column2: {
          templateUrl: 'app/worker/worker-list.tpl.html',
          controller: 'WorkerListController as ctrl',
          resolve: {
            workers: function(userClient) {
              return userClient.list();
            }
          }
        },
        'content': {
          templateUrl: 'app/worker/empty.tpl.html',
        }
      }
    })
    .state('app.worker.detail', {
      url: '/worker/:workerId',
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-detail.tpl.html',
          controller: 'WorkerDetailController as ctrl',
          resolve: {
            worker: function($stateParams, userClient) {
              return userClient.read($stateParams.workerId);
            }
          }
        }
      }
    })
    .state('app.worker.edit', {
      url: '/worker/:workerId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-edit.tpl.html',
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

.controller('WorkerListController', function (mediator, workers) {
  this.workers = workers;
})

.controller('WorkerDetailController', function (mediator, worker) {
  this.worker = worker;
  var bannerUrl = worker.banner || worker.avatar;
  this.style = {
    'background-image': 'url(' + bannerUrl + ')',
    'background-position': worker.banner ? 'center center' : 'top center',
    'background-size': worker.banner ? 'auto' : 'contain',
    'background-repeat': 'no-repeat'
  }
  console.log('style', this.style);
})

.controller('WorkerFormController', function (mediator) {
})

;
