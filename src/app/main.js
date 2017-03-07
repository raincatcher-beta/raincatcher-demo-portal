'use strict';

var angular = require('angular');
require('feedhenry');

var mapModule = require('fh-wfm-map');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material'),
  require('./feedhenry')
, require('fh-wfm-mediator'),
  require('fh-wfm-sync')
, require('fh-wfm-workorder')
, require('fh-wfm-result')
, require('fh-wfm-message')
, require('fh-wfm-file')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, mapModule({
	viewId: 'content',
	data: { columns: 2 }
})
, require('fh-wfm-schedule')
, require('fh-wfm-analytics')
, require('fh-wfm-camera')
, require('./auth/auth')
, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./home/home')
, require('./appform/appform')
, require('./worker/worker')
, require('./group/group')
, require('./message/message')
, require('./file/file')
, require('./schedule/schedule')

, require('./analytics/analytics')
, require('./settings')
]);

//Initialising the application with required service, config and initialising script.
require('./initialisation');
