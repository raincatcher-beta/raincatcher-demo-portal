'use strict';

var angular = require('angular');
var _ = require('lodash');
require('angular-messages');

module.exports = 'app.worker';

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
          resolve: {
            workers: function(workerRest) {
              return workerRest.list();
            }
          }
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
          resolve: {
            worker: function($stateParams, workerRest) {
              return workerRest.read($stateParams.workerId);
            }
          }
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

.factory('workerRest', function($q, FHCloud) {
  var workerRest = {};
  var workers;

  var asyncValue = function(value) {
    var deferred = $q.defer();
    setTimeout(function() {
      deferred.resolve(value);
    },0);
    return deferred.promise;
  }

  var fetch = function() {
    return FHCloud.get('/api/wfm/user').then(function(response) {
      workers = response;
      return workers;
    });
  };

  workerRest.list = function() {
    return workers ? asyncValue(workers) : fetch();
  };

  workerRest.read = function(id) {
    if (workers) {
      var worker = _.find(workers, function(_worker) {
        return _worker.id == id;
      });
      return asyncValue(worker);
    } else {
      return FHCloud.get(config.apiPath + '/' + id).then(function(response) {
        var worker = response;
        removeLocalVars(worker);
        if (worker.finishTimestamp) {
          worker.finishTimestamp = new Date(worker.finishTimestamp);
        }
        return worker;
      });
    }
  };

  workerRest.update = function(worker) {
    removeLocalVars(worker);
    return FHCloud.put(config.apiPath + '/' + worker.id, angular.toJson(worker))
    .then(function(response) {
      return FHCloud.get(config.apiPath);
    })
    .then(function(response) {
      workers = response;
      return worker;
    });
  };

  workerRest.create = function(worker) {
    removeLocalVars(worker);
    return FHCloud.post(config.apiPath, worker)
    .then(function(response) {
      worker = response;
      return FHCloud.get(config.apiPath);
    })
    .then(function(response) {
      workers = response;
      return worker;
    });
  };

  return workerRest;
})
;
