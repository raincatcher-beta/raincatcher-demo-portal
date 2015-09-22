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
      controller: 'WorkorderListController as workorderListController',
      resolve: {
        workorders: function(mediator) {
          mediator.publish('workorders:load');
          return mediator.promise('workorders:loaded');
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})

.controller('WorkorderListController', function (mediator, workorders) {
  var self = this;
  self.workorders = workorders;
})
;

module.exports = 'app.workorder-list';
