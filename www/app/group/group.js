'use strict';

var angular = require('angular');
var _ = require('lodash');

module.exports = 'app.group';

angular.module('app.group', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.group', {
      url: '/groups/list',
      resolve: {
        groups: function() {
          return [
            {id: 0, name: 'Drivers', role: 'worker'},
            {id: 1, name: 'Back Office', role: 'manager'},
            {id: 2, name: 'Management', role: 'admin'}
          ];
        },
        users: function(userClient) {
          return userClient.list();
        },
        membership: function() {
          return [
            {group: 0, user: 156340},
            {group: 0, user: 373479},
            {group: 0, user: 235843},
            {group: 0, user: 754282},
            {group: 0, user: 994878},
            {group: 1, user: 546834},
            {group: 1, user: 865435},
            {group: 2, user: 122334}
          ];
        }
      },
      views: {
        column2: {
          templateUrl: 'app/group/group-list.tpl.html',
          controller: 'groupListController as ctrl'
        },
        'content': {
          templateUrl: 'app/group/empty.tpl.html',
        }
      }
    })
    .state('app.group.detail', {
      url: '/group/:groupId',
      resolve: {
        group: function($stateParams, groups) {
          return groups[$stateParams.groupId];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-detail.tpl.html',
          controller: 'groupDetailController as ctrl'
        }
      }
    })
    .state('app.group.edit', {
      url: '/group/:groupId/edit',
      resolve: {
        group: function($stateParams, groups) {
          return groups[$stateParams.groupId];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('group:selected', function(group) {
    $state.go('app.group.detail', {
      groupId: group.id
    });
  });
})

.controller('groupListController', function (mediator, groups) {
  this.groups = groups;
})

.controller('groupDetailController', function (mediator, group, users, membership) {
  this.group = group;
  var groupMembership = membership.filter(function(_membership) {
    return _membership.group == group.id
  })
  this.members = users.filter(function(user) {
    return _.some(groupMembership, function(_membership) {
      return _membership.user == user.id;
    })
  })
})

.controller('groupFormController', function (mediator, group) {
  this.group = group;
})

;
