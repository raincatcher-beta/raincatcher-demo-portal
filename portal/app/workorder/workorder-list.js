'use strict';

var angular = require('angular');

angular.module('app.workorder-list', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder-list', {
      url: '/workorders/list',
      templateUrl: '/app/workorder/workorder-table.tpl.html',
      controller: 'WorkorderListController as workorderListController'
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})

.controller('WorkorderListController', function ($state, mediator) {
  var self = this;

  mediator.publish('workorders:load');
  mediator.once('workorders:loaded', function(workorders) {
    self.workorders = workorders;
  });
})
;

module.exports = 'app.workorder-list';
