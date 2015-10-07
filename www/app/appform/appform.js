'use strict';
var angular = require('angular');
var _ = require('lodash');

angular.module('app.appform', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('app.appform.detail', {
      url: '/appform/:formId',
      views: {
        'content@app': {
          templateUrl: 'app/appform/appform.tpl.html',
          controller: 'AppformController',
          controllerAs: 'ctrl',
          resolve: {
            form: function($stateParams, mediator) {
              mediator.publish('wfm:appform:form:load', $stateParams.formId);
              return mediator.promise('wfm:appform:form:loaded');
            }
          }
        }
      }
    })
    .state('app.appform', {
      url: '/appforms',
      views: {
        column2: {
          templateUrl: 'app/appform/appform-list.tpl.html',
          controller: 'AppformListController',
          controllerAs: 'ctrl',
          resolve: {
            forms: function(mediator) {
              mediator.publish('wfm:appform:forms:load');
              return mediator.promise('wfm:appform:forms:loaded');
            }
          }
        }
      }
    });
})

.controller('AppformController', function($q, form) {
  var self = this;
  self.form = form;
})

.controller('AppformListController', function($q, $state, forms) {
  var self = this;
  self.forms = forms;
  self.selectForm = function(event, form) {
    $state.go('app.appform.detail', {formId: form._id});
  };
})

;

module.exports = 'app.appform';
