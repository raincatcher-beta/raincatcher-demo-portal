'use strict';

var _ = require('lodash');
require('angular-messages');

module.exports = 'app.message';

angular.module('app.message', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.message', {
      url: '/messages/list',
      views: {
        column2: {
          templateUrl: 'app/message/message-list.tpl.html',
          controller: 'messageListController as ctrl'
        },
        'content': {
          templateUrl: 'app/message/empty.tpl.html',
        }
      }
    })
    .state('app.message.detail', {
      url: '/message/:messageId',
      views: {
        'content@app': {
          templateUrl: 'app/message/message-detail.tpl.html',
          controller: 'messageDetailController as ctrl'
        }
      }
    })
    .state('app.message.edit', {
      url: '/message/:messageId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/message/message-edit.tpl.html',
          controller: 'messageFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('message:selected', function(message) {
    $state.go('app.message.detail', {
      messageId: message.id
    });
  });
})

.controller('messageListController', function (mediator) {
})

.controller('messageDetailController', function (mediator) {
  this.toNames = ['Trever']
})

.controller('messageFormController', function (mediator) {
})

;
