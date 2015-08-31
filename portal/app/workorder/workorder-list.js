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
      template: '<workorder-table list="workorderListController.workorders"></workorder-list list="workorderListController.workorders">',
      controller: 'WorkorderListController as workorderListController'
    });
})

.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', self, function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})

.controller('WorkorderListController', function ($state, mediator) {
  var self = this;

  mediator.publish('workorders:load');
  var subscriptionLoaded = mediator.subscribe('workorders:loaded', self, function(workorders) {
    subscriptionLoaded.unsubscribe();
    self.workorders = workorders;
  });
})
;

module.exports = 'app.workorder-list';
