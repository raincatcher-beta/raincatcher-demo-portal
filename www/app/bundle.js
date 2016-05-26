require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/area.tpl.html',
    '<div flex hide-sm>\n' +
    '    <md-card>\n' +
    '      <div id="area-chart"></div>\n' +
    '      <md-card-content>\n' +
    '        <h2 class="md-title">Area Chart</h2>\n' +
    '        <p>\n' +
    '          This area chart compares the estimated workorder time <br>completion time with\n' +
    '          the real completion time.\n' +
    '        </p>\n' +
    '      </md-card-content>\n' +
    '    </md-card>\n' +
    '  </div>\n' +
    '');
}]);

},{}],2:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/chart.tpl.html',
    '<div flex>\n' +
    '  <md-card>\n' +
    '    <div id="bar-chart"></div>\n' +
    '    <md-card-content>\n' +
    '      <h2 class="md-title">Completion time / Estimated time</h2>\n' +
    '      <p>\n' +
    '        This bar chart compares the estimated workorder time <br>completion time with\n' +
    '        the real completion time.\n' +
    '      </p>\n' +
    '    </md-card-content>\n' +
    '  </md-card>\n' +
    '</div>\n' +
    '');
}]);

},{}],3:[function(require,module,exports){
require('./area.tpl.html.js');
require('./chart.tpl.html.js');
require('./pie.tpl.html.js');

},{"./area.tpl.html.js":1,"./chart.tpl.html.js":2,"./pie.tpl.html.js":4}],4:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/pie.tpl.html',
    '<div flex>\n' +
    '  <md-card>\n' +
    '    <div id="pie-chart"></div>\n' +
    '    <md-card-content>\n' +
    '      <h2 class="md-title">Workorders by assignee</h2>\n' +
    '      <p>\n' +
    '        This pie chart represents the number of workorders assigned to each worker.\n' +
    '      </p>\n' +
    '    </md-card-content>\n' +
    '  </md-card>\n' +
    '</div>\n' +
    '');
}]);

},{}],5:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = require('./directive');

},{"./directive":6}],6:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.analytics.directives', ['wfm.core.mediator']);
module.exports = 'wfm.analytics.directives';

require('../../dist');
var c3 = require('c3')

ngModule.directive('analyticsPiechart', function($templateCache, mediator, $window, $timeout) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/pie.tpl.html'),
    scope: {
      workers: '=',
      workorders: '='
    },
    link: function (scope, element, attrs, ctrl) {
    },
    controller: function($scope, $element) {
      var workerMap = {};
      $scope.workers.forEach(function(worker) {
        workerMap[worker.id] = worker;
      });

      var workorderCounts = {};
      $scope.workorders.forEach(function(workorder) {
        workorderCounts[workorder.assignee] = workorderCounts[workorder.assignee] || 0;
        workorderCounts[workorder.assignee]++;
      });

      var columns = [];
      _.forIn(workorderCounts, function(count, workerid) {
        var worker = workerMap[workerid];
        var name = worker ? worker.name : 'Unassigned';
        var column = [name, count];
        columns.push(column);
      });


      var pieChart = c3.generate({
        bindto: '#pie-chart',
        size: {
          width: 450
        },
        data: {
            columns: columns,
            type : 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
      });
    },
    controllerAs: 'ctrl'
  }})
  .directive('analyticsBarchart', function($templateCache, mediator, $window, $timeout) {
    return {
      restrict: 'E',
      template: $templateCache.get('wfm-template/chart.tpl.html'),
      scope: {
        workorders: '='
      },
      link: function (scope, element, attrs, ctrl) {
      },
      controller: function($scope, $element) {
        //add fake data for bar charts
        var columnEstimated = ["estimated"];
        var columnReal = ["real"];
        var xAxis = [];
        $scope.workorders.forEach(function(workorder) {
          var estimated  = Math.floor((Math.random() * 10) + 15);
          var real = Math.floor((Math.random() * 10) + 15);
          xAxis.push("#" + workorder.id + ":" + workorder.title);
          columnEstimated.push(estimated);
          columnReal.push(real);
        });

        var barChart = c3.generate({
          bindto: '#bar-chart',
          size: {
            width: 450
          },
          data: {
            columns: [
              columnEstimated,
              columnReal
            ],
            type: 'bar'
          },
          axis: {
             x: {
                 show: false,
                 type: 'category',
                 categories: xAxis
             }
         },
          bar: {
            width: {
              ratio: .8
            }
          }
      });


      },
      controllerAs: 'ctrl'
  }})
  .directive('analyticsAreachart', function($templateCache, mediator, $window, $timeout) {
    return {
      restrict: 'E',
      template: $templateCache.get('wfm-template/area.tpl.html'),
      scope: {
        workorders: '='
      },
      link: function (scope, element, attrs, ctrl) {
      },
      controller: function($scope, $element) {
        //add fake data for bar charts
        var columnEstimated = ["estimated"];
        var columnReal = ["real"];
        var xAxis = [];
        $scope.workorders.forEach(function(workorder) {
          var estimated  = Math.floor((Math.random() * 10) + 15);
          var real = Math.floor((Math.random() * 10) + 15);
          xAxis.push("#" + workorder.id + ":" + workorder.title);
          columnEstimated.push(estimated);
          columnReal.push(real);
        });

        var areaChart = c3.generate({
            bindto: '#area-chart',
            size: {
              width: 450
            },
            data: {
              columns: [
                columnEstimated,
                columnReal
              ],
            types: {
              estimated: 'area',
              real: 'area-spline'
            }
          }
        });


      },
      controllerAs: 'ctrl'
  }});

},{"../../dist":3,"c3":"c3"}],7:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-date.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '\n' +
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputDate" class="">{{field.props.name}}</label>\n' +
    '  <input type="date"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputDate"\n' +
    '    ng-model="ctrl.model.date"\n' +
    '    ng-change="ctrl.updateModel()"\n' +
    '    min="{{field.props.fieldOptions.validation.min}}"\n' +
    '    max="{{field.props.fieldOptions.validation.max}}"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid datae</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],8:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-datetime.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '\n' +
    '<p class="md-caption">{{field.props.name}}</p>\n' +
    '<div layout="row">\n' +
    '  <md-input-container flex class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '    <label for="inputDate" class="">Date</label>\n' +
    '    <input type="date"\n' +
    '      placeholder="{{ctrl.field.props.helpText}}"\n' +
    '      name="inputDate"\n' +
    '      ng-model="ctrl.model.date"\n' +
    '      ng-change="ctrl.updateModel()"\n' +
    '      min="{{field.props.fieldOptions.validation.min}}"\n' +
    '      max="{{field.props.fieldOptions.validation.max}}"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '      <div ng-message="number">You did not enter a valid date</div>\n' +
    '      <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '      <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container flex class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '    <label for="inputTime" class="">Time</label>\n' +
    '    <input type="time"\n' +
    '      placeholder="{{ctrl.field.props.helpText}}"\n' +
    '      name="inputTime"\n' +
    '      ng-model="ctrl.model.time"\n' +
    '      ng-change="ctrl.updateModel()"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '      <div ng-message="number">You did not enter a valid time</div>\n' +
    '      <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '      <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '');
}]);

},{}],9:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-location.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<p class="md-caption">{{field.props.name}}</p>\n' +
    '<p>{{field.props.helpText}}</p>\n' +
    '\n' +
    '<md-button type="button" ng-click="ctrl.setLocation($event)" class="md-raised md-primary">\n' +
    '  <md-icon md-font-set="material-icons">location_searching</md-icon>\n' +
    '  Get Location\n' +
    '</md-button>\n' +
    '\n' +
    '<div layout="row">\n' +
    '  <md-input-container class="{{field.props.fieldCode}} appform-field-location md-block" flex>\n' +
    '    <input type="number"\n' +
    '      placeholder="Latitude"\n' +
    '      name="inputNameX"\n' +
    '      ng-model="ctrl.model.value.lat"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '\n' +
    '    <div ng-messages="$parent.fieldForm.inputNameX.$error" ng-show="$parent.fieldForm.inputNameX.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} latitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="{{field.props.fieldCode}} appform-field-location md-block" flex>\n' +
    '    <input type="number"\n' +
    '      placeholder="Longitude"\n' +
    '      name="inputNameY"\n' +
    '      ng-model="ctrl.model.value.long"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputNameY.$error" ng-show="$parent.fieldForm.inputNameY.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} longitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '');
}]);

},{}],10:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-number.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputName" class="">{{field.props.name}}</label>\n' +
    '  <input type="number"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputName"\n' +
    '    ng-model="ctrl.model.value"\n' +
    '    min="{{field.props.fieldOptions.validation.min}}"\n' +
    '    max="{{field.props.fieldOptions.validation.max}}"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid number</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],11:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-photo.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div>\n' +
    '  <md-button type="button" ng-click="ctrl.capture($event)" class="md-raised md-primary">{{ctrl.model.value ? \'Replace\' : \'Take a\'}} photo</md-button>\n' +
    '  <br>\n' +
    '  <img class=\'appform-photo\' ng-if="field.value.localURI" ng-src="{{field.value.localURI}}" alt="photo"></img>\n' +
    '  <img class=\'appform-photo\' ng-if="ctrl.model.value" ng-src="{{ctrl.model.value}}" alt="photo"></img>\n' +
    '</div>\n' +
    '');
}]);

},{}],12:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-time.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '\n' +
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputTime" class="">{{field.props.name}}</label>\n' +
    '  <input type="time"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputTime"\n' +
    '    ng-model="ctrl.model.time"\n' +
    '    ng-change="ctrl.updateModel()"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid time</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],13:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<ng-form name="fieldForm" ng-submit="ctrl.submit()">\n' +
    '  <div ng-switch="ctrl.field.props.type">\n' +
    '\n' +
    '    <div ng-switch-when="number">\n' +
    '      <appform-field-number model="ctrl.model" field="ctrl.field"></appform-field-number>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="dateTime" ng-switch="ctrl.field.props.fieldOptions.definition.datetimeUnit">\n' +
    '      <div ng-switch-when="date">\n' +
    '        <appform-field-date model="ctrl.model" field="ctrl.field"></appform-field-date>\n' +
    '      </div>\n' +
    '       <div ng-switch-when="datetime">\n' +
    '         <appform-field-datetime model="ctrl.model" field="ctrl.field"></appform-field-datetime>\n' +
    '       </div>\n' +
    '       <div ng-switch-when="time">\n' +
    '         <appform-field-time model="ctrl.model" field="ctrl.field"></appform-field-time>\n' +
    '       </div>\n' +
    '       <div ng-switch-default>\n' +
    '         {{ctrl.field.props.fieldOptions.definition.datetimeUnit}}\n' +
    '       </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="location">\n' +
    '      <appform-field-location model="ctrl.model" field="ctrl.field"></appform-field-location>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="signature" flex class="appform-signature">\n' +
    '      <md-input-container class="md-block">\n' +
    '        <p class="md-caption">{{ctrl.field.props.name}}</p>\n' +
    '        <signature-form value="ctrl.model.value"></signature-form>\n' +
    '      </md-input-container>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="photo" flex class="appform-photo">\n' +
    '      <appform-field-photo model="ctrl.model" field="ctrl.field"></appform-field-photo>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-default flex>\n' +
    '      <md-input-container class="md-block">\n' +
    '        <label>{{ctrl.field.props.name}}</label>\n' +
    '        <input\n' +
    '          type="text"\n' +
    '          name="inputName"\n' +
    '          ng-model="ctrl.model.value"\n' +
    '          ng-required="ctrl.field.props.required"\n' +
    '          ng-class="ctrl.field.props.type"\n' +
    '        ></input>\n' +
    '        <div ng-messages="fieldForm.inputName.$error" ng-show="fieldForm.inputName.$dirty || fieldForm.$submitted">\n' +
    '          <div ng-message="required" ng-show="ctrl.field.props.helpText">{{ctrl.field.props.helpText}}</div>\n' +
    '          <div ng-message="required" ng-hide="ctrl.field.props.helpText">A {{ctrl.field.props.name}} is required.</div>\n' +
    '        </div>\n' +
    '      </md-input-container>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</ng-form>\n' +
    '');
}]);

},{}],14:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-submission.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '\n' +
    '<md-subheader>{{ctrl.form.props.name}}</md-subheader>\n' +
    '\n' +
    '<md-list class="appform-view">\n' +
    '\n' +
    '  <md-list-item ng-if="! ctrl.fields" class="loading">\n' +
    '    Loading appForm submission...\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <div ng-repeat="field in ctrl.fields">\n' +
    '    <ng-switch on="field.props.type">\n' +
    '      <div ng-switch-when="signature">\n' +
    '        <md-list-item class="md-2-line with-image">\n' +
    '          <md-icon md-font-set="material-icons">gesture</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>\n' +
    '              <signature ng-if="field.value.localURI" value="field.value.localURI" alt="Signature"></signature>\n' +
    '              <signature ng-if="!field.value.localURI" value="field.value.imgHeader + field.value.data" alt="Signature"></signature>\n' +
    '            </h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="location">\n' +
    '        <md-list-item class="md-3-line">\n' +
    '          <md-icon md-font-set="material-icons">place</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value.lat}}N, {{field.value.long}}W</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="number">\n' +
    '        <md-list-item class="md-2-line">\n' +
    '          <md-icon md-font-set="material-icons">filter_4</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value}}</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="photo">\n' +
    '        <md-list-item class="md-2-line with-image">\n' +
    '          <md-icon md-font-set="material-icons">camera</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>\n' +
    '              <img ng-if="field.value.localURI" ng-src="{{field.value.localURI}}" alt="photo"></img>\n' +
    '              <img ng-if="!field.value.localURI" ng-src="{{field.value.imgHeader + field.value.data}}" alt="photo"></img>\n' +
    '            </h3>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-default>\n' +
    '        <md-list-item class="md-2-line">\n' +
    '          <md-icon md-font-set="material-icons">text_format</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value}}</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '    </ng-switch>\n' +
    '  </div>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],15:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div class="app-form" layout-padding >\n' +
    '\n' +
    '<form name="workorderForm" novalidate>\n' +
    '  <div ng-repeat="field in ctrl.fields">\n' +
    '    <appform-field field="field" model="ctrl.model[field.props.fieldCode || field.props._id]"></appform-field>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '    <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '    <md-button type="button" ng-click="ctrl.done($event, workorderForm.$valid)" class="md-primary">Continue</md-button>\n' +
    '  </div><!-- workflow-actions-->\n' +
    '\n' +
    '</form>\n' +
    '\n' +
    '</div><!-- app-form -->\n' +
    '');
}]);

},{}],16:[function(require,module,exports){
require('./appform-field-date.tpl.html.js');
require('./appform-field-datetime.tpl.html.js');
require('./appform-field-location.tpl.html.js');
require('./appform-field-number.tpl.html.js');
require('./appform-field-photo.tpl.html.js');
require('./appform-field-time.tpl.html.js');
require('./appform-field.tpl.html.js');
require('./appform-submission.tpl.html.js');
require('./appform.tpl.html.js');

},{"./appform-field-date.tpl.html.js":7,"./appform-field-datetime.tpl.html.js":8,"./appform-field-location.tpl.html.js":9,"./appform-field-number.tpl.html.js":10,"./appform-field-photo.tpl.html.js":11,"./appform-field-time.tpl.html.js":12,"./appform-field.tpl.html.js":13,"./appform-submission.tpl.html.js":14,"./appform.tpl.html.js":15}],17:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.appform';

angular.module('wfm.appform', [
  'wfm.core.mediator'
, require('./directive')
])

.run(function(mediator) {
  require('../appform-mediator')(mediator);
});

},{"../appform-mediator":20,"./directive":18}],18:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.appform.directives', [
  'wfm.core.mediator',
  require('./service'),
  require('fh-wfm-signature')
]);
module.exports = 'wfm.appform.directives';

var _ = require('lodash');
require('../../dist');

ngModule.run(function(appformClient) {
  appformClient.init();
})

ngModule.directive('appformSubmission', function($templateCache, $q, appformClient) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-submission.tpl.html')
  , scope: {
      submissionLocalId: '=submissionLocalId'
    , submissionId: '=submissionId'
    , submission: '=submission'
    }
  , controller: function($scope) {
      var self = this;
      var submissionPromise;
      if ($scope.submission) {
        submissionPromise = $q.when($scope.submission);
      } else if ($scope.submissionId) {
        submissionPromise = appformClient.getSubmission($scope.submissionId);
      } else if ($scope.submissionLocalId) {
        submissionPromise = appformClient.getSubmissionLocal($scope.submissionLocalId);
      } else {
        console.error('appformSubmission called with no submission');
      }
      submissionPromise.then(function(submission) {
        var formPromise = submission.form ? $q.when(submission.form) : appformClient.getForm(submission.props.formId);
        return formPromise.then(function(form) {
          self.form = form;
        })
        .then(function() {
          return appformClient.getFields(submission);
        })
      })
      .then(function(fields) {
        self.fields = fields;
      }, function(error) {
        console.error(error);
      });
    }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appform', function($templateCache, $q, mediator, appformClient) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform.tpl.html')
  , scope: {
      form: '=',
      formId: '='
    }
  , controller: function($scope, $element) {
    var self = this;
    var form;
    var formPromise = $scope.form ? $q.when($scope.form) : appformClient.getForm($scope.formId);
    formPromise.then(function(_form) {
      form = _form;
      self.fields = form.fields;
      self.model = {};
      _.forEach(self.fields, function(field) {
        self.model[field.props.fieldCode || field.props._id] = {};
      });
    })
    self.back = function(event) {
      event.preventDefault();
      event.stopPropagation();
      mediator.publish('wfm:workflow:step:back');
    }
    self.done = function(event, isValid) {
      event.stopPropagation();
      event.stopPropagation();
      $scope.$broadcast('parentFormSubmitted');
      if (!isValid) {
        console.log('invalid', event)
        var firstInvalid = $element[0].querySelector('input.ng-invalid');
        // if we find one, set focus
        if (firstInvalid) {
          firstInvalid.focus();
        }
      } else {
        var submissionFields = [];
        _.forEach(self.fields, function(field) {
          var value = self.model[field.props.fieldCode || field.props._id].value;
          submissionFields.push({
            fieldId: field.props._id,
            value: value
          });
        })
        appformClient.createSubmission(form, submissionFields)
        .then(appformClient.submitSubmission)
        .then(appformClient.composeSubmissionResult)
        .then(function(submissionResult) {
          mediator.publish('wfm:workflow:step:done', submissionResult);
        }, function(error) {
          console.error('submissionFields', submissionFields);
          throw new Error(error);
        });
      };
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformField', function($templateCache, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field.tpl.html')
  , scope: {
      field: '=',
      model: '='
    }
  , link: function (scope, element, attrs, ctrl) {
      var parentForm = element.parent();
      while (parentForm && parentForm.prop('tagName') !== 'FORM') {
        parentForm = parentForm.parent();
      };
      if (parentForm) {
        var formController = element.find('ng-form').controller('form');
        scope.$on('parentFormSubmitted',function(event) {
          ctrl.submit(element);
          formController.$setSubmitted();
        });
      };
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = {};
    if ($scope.model && $scope.model.value) {
      self.model = angular.copy($scope.model);
    } else if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
      self.model.value = self.field.props.fieldOptions.definition.defaultValue;
    };
    self.submit = function(element) {

      if (self.field.props.type === 'location') {
        var inputs = element[0].getElementsByTagName('input');
        self.model.value = {
          lat: inputs[0].value,
          long: inputs[1].value
        }
      }
      $scope.model.value = self.model.value;
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldLocation', function($templateCache, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field-location.tpl.html')
  , scope: {
      field: '='
    , model: '='
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = $scope.model ? angular.copy($scope.model) : {};
    self.model.value = self.model.value || {};
    self.isValid = function(form, element) {
      console.log('form', form);
      console.log('element', element);
    }
    self.setLocation = function(event) {
      event.stopPropagation();
      event.stopPropagation();
      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.$apply(function() {
          self.model.value.lat = parseFloat(pos.coords.latitude);
          self.model.value.long = parseFloat(pos.coords.longitude);
          console.log('position set', self.model.value)
        });
      }, function(err) {
        alert('Unable to get current position');
        self.model.value.lat = -1;
        self.model.value.long = -1;
      });
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldPhoto', function($templateCache, $window, mediator, mobileCamera, desktopCamera) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field-photo.tpl.html')
  , scope: {
      field: '='
    , model: '='
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = $scope.model; // ? angular.copy($scope.model) : {};
    self.isValid = function(form, element) {
      console.log('form', form);
      console.log('element', element);
    }
    self.capture = function(event) {
      event.stopPropagation();
      event.stopPropagation();
      if ($window.cordova) {
        mobileCamera.capture()
        .then(function(capture) {
          self.model.value = capture;
        })
      } else {
        desktopCamera.capture()
        .then(function(dataUrl) {
          self.model.value = dataUrl;
        });
      }
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldNumber', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-number.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = parseFloat(self.field.props.fieldOptions.definition.defaultValue);
   };
 }
 , controllerAs: 'ctrl'
 };
});

function getDate(d){
  return 'YYYY-MM-DD'.replace('YYYY', d.getFullYear()).replace('MM', twoDigi(d.getMonth()+1)).replace('DD', twoDigi(d.getDate()));
};

function getTime(d){
  return 'HH:mm'.replace('HH', twoDigi(d.getHours())).replace('mm', twoDigi(d.getMinutes()));
};

function twoDigi(num){
  if (num < 10){
    return '0' + num.toString();
  } else {
    return num.toString();
  }
}

ngModule.directive('appformFieldDatetime', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-datetime.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var date = new Date(self.model.date);
     var time = new Date(self.model.time);
     $scope.model.value = getDate(date) + ' ' + getTime(time);
   }
 }
 , controllerAs: 'ctrl'
 };
});

ngModule.directive('appformFieldDate', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-date.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var date = new Date(self.model.date);
     $scope.model.value = getDate(date);
   }
 }
 , controllerAs: 'ctrl'
 };
});

ngModule.directive('appformFieldTime', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-time.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var time = new Date(self.model.time);
     $scope.model.value = getTime(time);
   }
 }
 , controllerAs: 'ctrl'
 };
});

},{"../../dist":16,"./service":19,"fh-wfm-signature":25,"lodash":"lodash"}],19:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var client = require('../appform')

module.exports = 'wfm.appform.service';

angular.module('wfm.appform.service', [])

.service('appformClient', function($q) {
  var service = {};

  var methods = [
    'init',
    'list',
    'getForm',
    'getSubmissionLocal',
    'getSubmission',
    'getSubmissions',
    'getFields',
    'createSubmission',
    'submitSubmission',
    'uploadSubmission',
    'composeSubmissionResult',
    'syncStepResult',
    'watchSubmissionModel'
  ];

  methods.forEach(function(method) {
    service[method] = function() {
      return $q.when(client[method].apply(client, arguments));
    };
  });

  return service;
});

},{"../appform":21}],20:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var client = require('./appform')

function wrapper(mediator) {
  var initPromise = client.init();
  mediator.subscribe('wfm:appform:init', function() {
    initPromise
    .then(function() {
      mediator.publish('done:wfm:appform:init');
    }, function(error) {
      mediator.publish('error:appform:init', error);
    });
  });

  mediator.subscribe('init', function() {
    mediator.publish('promise:init', initPromise);
  });

  mediator.subscribe('wfm:appform:form:list', function() {
    client.list()
    .then(function(forms) {
      mediator.publish('done:wfm:appform:form:list', forms);
    }, function(error) {
      mediator.publish('error:appform:form:list', error);
    });
  });

  mediator.subscribe('wfm:appform:form:read', function(formId) {
    client.getForm(formId)
    .then(function(form) {
      mediator.publish('done:wfm:appform:form:read:' + formId, form);
    }, function(error) {
      mediator.publish('error:appform:form:read:' + formId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:local:read', function(submissionLocalId) {
    client.getSubmissionLocal(submissionLocalId)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:local:read:'+submissionLocalId, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:local:read:'+submissionLocalId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:remote:read', function(submissionId) {
    client.getSubmission(submissionId)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:remote:read:'+submissionId, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:remote:read:'+submissionId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:list:remote:read', function(submissionIds, id) {
    client.getSubmissions(submissionIds)
    .then(function(submissions) {
      mediator.publish('done:wfm:appform:submission:list:remote:read:'+id, submissions);
    }, function(error) {
      mediator.publish('error:appform:submission:list:remote:read:'+id, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:field:list', function(submission) {
    client.getFields(submission)
    .then(function(fields) {
      mediator.publish('done:wfm:appform:submission:field:list:'+submission.getLocalId(), fields);
    }, function(error) {
      mediator.publish('error:appform:submission:field:list:'+submission.getLocalId(), error);
    });
  });

  mediator.subscribe('wfm:appform:submission:create', function(form, submissionFields, ts) {
    client.createSubmission(form, submissionFields)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:create:' + ts, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:create:' + ts, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:submit', function(submission) {
    client.submitSubmission(submission)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:submit:' + submission.getLocalId(), submission);
    }, function(error) {
      mediator.publish('error:appform:submission:submit:' + submission.getLocalId(), error);
    });
  });

  mediator.subscribe('wfm:appform:submission:upload', function(submission) {
    client.uploadSubmission(submission)
    .then(function(submissionId) {
      mediator.publish('done:wfm:appform:submission:upload:' + submission.props._ludid, submissionId);
    }, function(error) {
      mediator.publish('error:appform:submission:upload:' + submission.props._ludid, error);
    });
  });

  client.addSubmissionCompleteListener(function(submissionResult, metaData) {
    if (metaData) {
      var event = {
        submissionResult: submissionResult,
        metaData: metaData
      }
      console.log('metaData', metaData);
      mediator.publish('wfm:appform:submission:complete', event)
    }
  })
};

module.exports = wrapper;

},{"./appform":21}],21:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');

var client = {};
var initPromise;

client.init = function() {
  if (initPromise) {
    return initPromise;
  }
  var deferred = q.defer();
  var self = this;
  self.listeners = [];
  initPromise = deferred.promise;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    $fh.forms.init(function(error) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        console.log('Forms initialized.');
        deferred.resolve();
      }
    });
  });
  $fh.forms.on("submission:submitted", function(submissionId) {
    var submission = this;
    var metaData = submission.get('metaData');
    if (self.listeners.length) {
      self.composeSubmissionResult(submission).then(function(submissionResult) {
        self.listeners.forEach(function(listener) {
          listener(submissionResult, metaData);
        });
      });
    }
  });
  return initPromise;
};

client.addSubmissionCompleteListener = function(listener) {
  this.listeners.push(listener);
};

client.list = function() {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getForms(function(error, formsModel) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var forms = formsModel.props.forms;
      deferred.resolve(forms);
    });
  });
  return deferred.promise;
};

client.getForm = function(formId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getForm({formId: formId}, function (error, form) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      deferred.resolve(form);
    });
  });
  return deferred.promise;
}

client.getSubmissionLocal = function(submissionLocalId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getSubmissions(function(error, submissions) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      submissions.getSubmissionByMeta({_ludid: submissionLocalId}, function(error, submission) {
        if (error) {
          deferred.reject(new Error(error));
          return;
        }
        deferred.resolve(submission);
      });
    });
  });
  return deferred.promise;
}

client.getSubmission = function(submissionId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.downloadSubmission({submissionId: submissionId}, function(error, submission) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      deferred.resolve(submission);
    });
  });
  return deferred.promise;
}

client.getSubmissions = function(submissionIds) {
  var self = this;
  var promises = submissionIds.map(function(submissionId) {
    return initPromise.then(function() {
      self.getSubmission(submissionId);
    });
  });
  return q.allSettled(promises);
}

client.getFields = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.getForm(function(error, form) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var fields = form.fields;
      var qs = [];
      _.forOwn(fields, function(field, key) {
        var _deferred = q.defer();
        qs.push(_deferred.promise);
        submission.getInputValueByFieldId(field.getFieldId(), function(error, fieldValues) {
          if (error) {
            _deferred.reject(new Error(error));
            return;
          }
          field.value = fieldValues[0];
          _deferred.resolve(fieldValues);
        });
      });
      q.all(qs).then(function() {
        deferred.resolve(fields);
      }, function(error) {
        deferred.reject(new Error(error));
      });
    });
  });
  return deferred.promise;
}

/**
* The fields parameter is an array of {fieldId: <...>, value: <...>} objects
*/
client.createSubmission = function(form, submissionFields) {
  var deferred = q.defer();
  initPromise.then(function() {
    var submission = form.newSubmission();
    var ds = [];
    _.forEach(submissionFields, function(field) {
      var d = q.defer();
      ds.push(d.promise);
      submission.addInputValue(field, function(error, result) {
        if (error) {
          d.reject(error);
        } else {
          d.resolve(result);
        }
      });
    });
    q.all(ds)
    .then(function() {
      deferred.resolve(submission);
    }, function(error) {
      deferred.reject(new Error(error));
    });
  });
  return deferred.promise;
};

client.submitSubmission = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.submit(function(error, submitResponse) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      };
      deferred.resolve(submission);
    });
  });
  return deferred.promise;
};

client.uploadSubmission = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.upload(function(error, uploadTask) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      };
      uploadTask.submissionModel(function(error, submissionModel) {
        if (error) {
          deferred.reject(new Error(error));
          return;
        };
        deferred.resolve(submissionModel);
      })
    });
  });
  return deferred.promise;
};

client.composeSubmissionResult = function(submission) {
  var submissionResult = {
      submissionLocalId: submission.props._ludid
    , formId: submission.props.formId
    , status: submission.props.status
  };
  if (submission.props._id) {
    submissionResult.submissionId = submission.props._id;
  }
  return q.when(submissionResult);
};

client.syncStepResult = function(workorder, stepResult) {
  // kick-off an appform upload, update the workorder when complete
  var self = this;

  return initPromise
    .then(function() {
      return self.getSubmissionLocal(stepResult.submission.submissionLocalId);
    })
    .then(function(submission) {
      submission.set('metaData', {
        wfm: {
          workorderId: workorder.id,
          step: stepResult.step,
          timestamp: stepResult.timestamp
        }
      });
      return submission;
    })
    .then(self.uploadSubmission)
    .then(function(submissionModel) {
      self.watchSubmissionModel(submissionModel); // need this to trigget the global event
      return submissionModel;
    });
};

client.watchSubmissionModel = function(submissionModel) {
  var deferred = q.defer();
  submissionModel.on('submitted', function(submissionId) {
    $fh.forms.downloadSubmission({submissionId: submissionId}, function(error, remoteSubmission) {
      if (error) {
        deferred.reject(error);
        return;
      };
      deferred.resolve(remoteSubmission);
    });
  });
  //  TODO: Do we need a timeout here to cleanup submissionModel listeners?
  return deferred.promise;
};

module.exports = client;

},{"lodash":"lodash","q":"q"}],22:[function(require,module,exports){
require('./signature-form.tpl.html.js');
require('./signature.tpl.html.js');

},{"./signature-form.tpl.html.js":23,"./signature.tpl.html.js":24}],23:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.signature');
} catch (e) {
  ngModule = angular.module('wfm.signature', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/signature-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div class="signature-form">\n' +
    '  <canvas tabindex="0"></canvas>\n' +
    '</div>\n' +
    '');
}]);

},{}],24:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.signature');
} catch (e) {
  ngModule = angular.module('wfm.signature', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/signature.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<img ng-src="{{ctrl.signature}}"></img>\n' +
    '');
}]);

},{}],25:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var canvasDrawr = require('../canvas-drawr');

module.exports = 'wfm.signature';

var ngModule = angular.module('wfm.signature', ['wfm.core.mediator'])

require('../../dist');

ngModule.directive('signatureForm', function($templateCache, $document, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/signature-form.tpl.html')
  , scope: {
      value: '=',
      options: '='
    }
  , link: function (scope, element, attrs, ctrl) {
      var options = scope.options || {};
      console.log('touch support', 'ontouchstart' in $document[0]);
      var drawr = 'ontouchstart' in $document[0]
        ? new canvasDrawr.CanvasDrawr(element, options, $document)
        : new canvasDrawr.CanvasDrawrMouse(element, options, $document);

      var $canvas = angular.element(element[0].getElementsByTagName('canvas')[0]);
      $timeout(function() {
        $canvas.on('blur', function() {
          scope.$apply(function() {
            ctrl.submit(element);
          })
        });
      })
    }
  , controller: function($scope) {
      var self = this;
      self.submit = function(element) {
        var canvas = element[0].getElementsByTagName('canvas')[0];
        $scope.value = canvas.toDataURL();
      }
    }
  , controllerAs: 'ctrl'
  };
})

ngModule.directive('signature', function($templateCache) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/signature.tpl.html')
  , scope: {
      value: '='
    }
  , controller: function($scope) {
      var self = this;
      self.signature = $scope.value;
    }
  , controllerAs: 'ctrl'
  };
})
;

},{"../../dist":22,"../canvas-drawr":26}],26:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var CanvasDrawrMouse = function (element, options) {
  var canvas = element[0].getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");
  canvas.style.width = '100%';
  canvas.width = (window.innerWidth);
  canvas.height = 200;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctx.lineWidth = options.size || 5;
  ctx.lineCap = options.lineCap || "round";
  options.color = options.color || 'blue';

  // last known position
  var pos = { x: 0, y: 0 };

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', setPosition);
  canvas.addEventListener('mouseup', stop);
  canvas.addEventListener('mouseout', stop);

  // new position from mouse event
  function setPosition(e) {
    e.preventDefault();
    e.stopPropagation();
    canvas.focus();
    var rect = canvas.getBoundingClientRect();
    var offset = {
      top: rect.top,
      left: rect.left
    };
    pos.x = e.clientX - offset.left;
    pos.y = e.clientY - offset.top;
  }

  function draw(e) {
    e.preventDefault();
    e.stopPropagation();
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.strokeStyle = options.color;

    ctx.moveTo(pos.x, pos.y); // from

    var rect = canvas.getBoundingClientRect();
    var offset = {
      top: rect.top,
      left: rect.left
    };
    pos.x = e.clientX - offset.left;
    pos.y = e.clientY - offset.top;
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!

  }

  function stop() {
    canvas.blur();
  }
};

var CanvasDrawr = function(element, options, $document) {
  var canvas = element[0].getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');
  canvas.style.width = '100%'
  canvas.width = canvas.offsetWidth;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctx.lineWidth = options.size || 5;
  ctx.lineCap = options.lineCap || 'round';
  options.color = options.color || 'blue';
  ctx.pX = undefined;
  ctx.pY = undefined;

  var lines = [,,];
  var rect = canvas.getBoundingClientRect();

  var offset = {
    top: rect.top + $document[0].body.scrollTop,
    left: rect.left + $document[0].body.scrollLeft
  };

  var self = {
    //bind click events
    init: function() {
      // use anguler.element#on for automatic listener cleanup
      var canvasNg = angular.element(canvas);
      //set pX and pY from first click
      canvasNg.on('touchstart', self.preDraw);
      canvasNg.on('touchmove', self.draw);
      canvasNg.on('touchend', self.stop);
      canvasNg.on('touchcancel', self.stop);
    },

    preDraw: function(event) {
      canvas.focus();
      rect = canvas.getBoundingClientRect();
      offset = {
        top: rect.top + $document[0].body.scrollTop,
        left: rect.left + $document[0].body.scrollLeft
      };

      for (var i = 0; i < event.touches.length; i++) {
        var touch = event.touches[i];
        var id      = touch.identifier;

        lines[id] = {
          x     : touch.pageX - offset.left,
          y     : touch.pageY - offset.top,
          color : options.color
        };
      };
      event.preventDefault();
      event.cancelBubble = true;
    },

    draw: function(event) {
      for (var i = 0; i < event.touches.length; i++) {
        var touch = event.touches[i];
        var id = touch.identifier,

        moveX = touch.pageX - offset.left - lines[id].x,
        moveY = touch.pageY - offset.top - lines[id].y;

        var ret = self.move(id, moveX, moveY);
        lines[id].x = ret.x;
        lines[id].y = ret.y;
      };

      event.preventDefault();
    },

    move: function(i, changeX, changeY) {
      ctx.strokeStyle = lines[i].color;
      ctx.beginPath();
      ctx.moveTo(lines[i].x, lines[i].y);

      ctx.lineTo(lines[i].x + changeX, lines[i].y + changeY);
      ctx.stroke();
      ctx.closePath();

      return { x: lines[i].x + changeX, y: lines[i].y + changeY };
    },

    stop: function() {
      canvas.blur();
    }
  };

  return self.init();
}

module.exports = {
  CanvasDrawr: CanvasDrawr,
  CanvasDrawrMouse: CanvasDrawrMouse
};

},{}],27:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.camera.directives');
} catch (e) {
  ngModule = angular.module('wfm.camera.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/camera.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div class="wfm-camera" flex>\n' +
    '  <md-button class="md-icon-button" aria-label="Back" ng-click="ctrl.cancel()" flex>\n' +
    '    <md-icon md-font-set="material-icons">arrow_back</md-icon>\n' +
    '  </md-button>\n' +
    '  <video  ng-show="ctrl.cameraOn" autoplay></video>\n' +
    '  <canvas ng-hide="ctrl.cameraOn"></canvas>\n' +
    '  <div class="wfm-camera-actions" style="z-index: 1000">\n' +
    '    <md-button ng-show="ctrl.cameraOn" class="wfm-camera-btn" ng-click="ctrl.snap()"></md-button>\n' +
    '    <md-button ng-hide="ctrl.cameraOn" class="wfm-camera-confirmation-btn md-warn" ng-click="ctrl.startCamera()">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '    <md-button ng-hide="ctrl.cameraOn" class="wfm-camera-confirmation-btn" ng-click="ctrl.done()">\n' +
    '      <md-icon md-font-set="material-icons">check</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],28:[function(require,module,exports){
require('./camera.tpl.html.js');

},{"./camera.tpl.html.js":27}],29:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.camera';

angular.module('wfm.camera', [
  require('./directive')
, require('./service')
]);

},{"./directive":30,"./service":31}],30:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.camera.directives', ['wfm.core.mediator']);
module.exports = 'wfm.camera.directives';

require('../../dist');

ngModule.directive('camera', function($templateCache, mediator, $window, $timeout) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/camera.tpl.html'),
    scope: {
      model: '=',
      autostart: '='
    },
    compile: function (element) {
      element.attr('flex', true);
    },
    controller: function($scope, $element) {
      var self = this,
          element = $element[0],
          canvas = element.getElementsByTagName('canvas')[0],
          context = canvas.getContext('2d'),
          video = element.getElementsByTagName('video')[0],
          stream, width, height, zoom;

      $timeout(function() {
        height = element.offsetHeight;
        width = element.offsetWidth;
        video.height = height;
        canvas.height = height;
        canvas.width = width;

        self.cameraOn = false;
        if ($scope.autostart) {
          self.startCamera();
        }
      })

      context.scale(-1, 1);

      self.snap = function() {
        var sx = (video.clientWidth - width ) / 2;
        context.drawImage(video, sx/zoom, 0, width/zoom, height/zoom, 0, 0, width, height);
        self.stopCamera();
      };

      self.startCamera = function() {
        // TODO: https://www.npmjs.com/package/getusermedia-js
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        getUserMedia.call(navigator, { 'video': true }, function(_stream) {
          stream = _stream;
          video.src = $window.URL.createObjectURL(stream);
          video.play();
          $scope.$apply(function() {
            $scope.model = null;
            self.cameraOn = true;
            var videoWidth;
            video.onloadstart = function() {
              videoWidth = video.clientWidth;
            }
            video.oncanplay = function() {
              zoom = videoWidth / video.clientWidth;
              video.style.left = -(video.clientWidth - width ) / 2 + 'px';
            };
          });
        }, function(error) {
          console.error('Video capture error: ', error.code);
        });
      }

      self.stopCamera = function() {
        stream.getVideoTracks()[0].stop();
        self.cameraOn = false;
      }

      self.cancel = function() {
        self.stopCamera();
        mediator.publish('wfm:camera:cancel');
      }

      self.done = function() {
        $scope.model = canvas.toDataURL();
      }

      $scope.$on('$destroy', function() {
        self.stopCamera();
      });
    },
    controllerAs: 'ctrl'
  };
})

},{"../../dist":28}],31:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var camera = require('../camera');

module.exports = 'wfm.camera.service';

angular.module('wfm.camera.service', ['wfm.core.mediator'])

.factory('mobileCamera', function($q, $window, mediator) {
  return camera;
})

.factory('desktopCamera', function($mdDialog, mediator) {
  var camera = {};
  camera.capture = function(ev) {
    return $mdDialog.show({
      controller: function CameraCtrl($scope, mediator) {
        var self = this;
        $scope.data = null;

        $scope.$watch('data', function() {
          if (! _.isEmpty($scope.data) ) {
            $mdDialog.hide($scope.data);
          }
        })

        mediator.subscribeForScope('wfm:camera:cancel', $scope, function() {
          $mdDialog.cancel('Photo capture cancelled.');
        });
      },
      template: '<camera model="data" autostart="true"></camera>',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true
    });
  };

  return camera;
})
;

},{"../camera":32}],32:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');

function Camera() {
  this.init();
};

Camera.prototype.init = function() {
  var self = this;
  var deferred = q.defer();
  if (window.cordova) {
    document.addEventListener("deviceready", function cameraReady() {
      deferred.resolve();
    }, false);
  } else {
    deferred.resolve();
  };

  self.initPromise = deferred.promise;
  return self.initPromise;
};

Camera.prototype.clearCache = function() {
  window.navigator.camera.cleanup();
};

Camera.prototype.capture = function () {
  var self = this;
  var deferred = q.defer();
  self.initPromise.then(function() {
    window.navigator.camera.getPicture(function captureSuccess(fileURI) {
      var fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
      deferred.resolve({
        fileName: fileName,
        fileURI: fileURI
      });
    }, function captureFailure(error) {
      deferred.reject(error);
    }, {
      quality: 100,
      destinationType: window.navigator.camera.DestinationType.FILE_URI,
      encodingType: window.Camera.EncodingType.JPEG,
      correctOrientation: true
    });
  });
  return deferred.promise;
};

var camera = new Camera();
module.exports = camera;

},{"q":"q"}],33:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('../config');

module.exports = 'wfm.file.directives';

angular.module('wfm.file.directives', [])

.directive('wfmImg', function($q) {
  function init() {
    var self = this;
    var deferred = $q.defer();
    $fh.on('fhinit', function(error, host) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var cloudUrl = $fh.getCloudURL();
      deferred.resolve(cloudUrl);
    });

    return deferred.promise;
  };

  var initPromise = init();

  return {
    restrict: 'A',
    scope: {
      uid: '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('uid', function(uid) {
        initPromise.then(function(cloudUrl) {
          element[0].src = cloudUrl + config.apiPath + '/get/' + uid;
          console.log(element[0].src);
        });
      });
    }
  }
})
;

},{"../config":35}],34:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var client = require('../file'),
    config = require('../config'),
    _ = require('lodash');

module.exports = 'wfm.file.service';

angular.module('wfm.file.service', [
  require('./directive')
])

.factory('fileClient', function($q) {
  var fileClient = {};

  _.forOwn(client, function(value, key) {
    if (typeof value  === 'function') {
      fileClient[key] = function() {
        return $q.when(client[key].apply(client, arguments));
      }
    } else {
      fileClient[key] = value;
    }
  });

  return fileClient;
})
;

},{"../config":35,"../file":36,"./directive":33,"lodash":"lodash"}],35:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080'
, apiPath: '/file/wfm'
}

},{}],36:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('./config'),
    q = require('q');

var client = {};

client.init = function() {
  var deferredFhinit = q.defer();
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferredFhinit.reject(new Error(error));
      return;
    }
    client.cloudUrl = $fh.getCloudURL();
    deferredFhinit.resolve();
  });

  var deferredReady = q.defer();
  if (window.cordova) {
    document.addEventListener("deviceready", function cameraReady() {
      deferredReady.resolve();
    }, false);
  } else {
    deferredReady.resolve();
  };

  client.initPromise = q.all([deferredFhinit.promise, deferredReady.promise])
  return client.initPromise;
};

client.uploadDataUrl = function(userId, dataUrl) {
  var deferred = q.defer();
  if (arguments.length < 2) {
    deferred.reject('Both userId and a dataUrl parameters are required.');
  } else {
    $fh.cloud({
      path: config.apiPath + '/owner/'+userId+'/upload/base64/photo.png',
      method: 'post',
      data: dataUrl
    },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    });
  }
  return deferred.promise;
}

client.list = function(userId) {
  var url = arguments.length === 0 ? config.apiPath + '/all'
    : config.apiPath + '/owner/' + userId;
  var deferred = q.defer();
  $fh.cloud({
      path: url,
      method: 'get'
    },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    }
  );
  return deferred.promise;
};

function fileUpload(fileURI, serverURI, fileUploadOptions) {
  var deferred = q.defer();
  var transfer = new FileTransfer();
  transfer.upload(fileURI, serverURI, function uploadSuccess(response) {
    deferred.resolve(response);
  }, function uploadFailure(error) {
    deferred.reject(error);
  }, fileUploadOptions);
  return deferred.promise;
};

function fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries) {
  return fileUpload(fileURI, serverURI, fileUploadOptions)
  .then(function (response) {
    return response;
  }, function (error) {
    if (retries == 0) {
      throw new Error("Can't upload to " + JSON.stringify(serverURI));
    };
    return q.delay(timeout)
    .then(function () {
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries - 1);
    });
  });
};

client.uploadFile = function(userId, fileURI, options) {
  if (arguments.length < 2) {
    return q.reject('userId and fileURI parameters are required.');
  } else {
    options = options || {};
    var fileUploadOptions = new FileUploadOptions();
    fileUploadOptions.fileKey = options.fileKey || 'binaryfile';
    fileUploadOptions.fileName = options.fileName;
    fileUploadOptions.mimeType = options.mimeType || 'image/jpeg';
    fileUploadOptions.params = {
      ownerId: userId,
      fileName: options.fileName
    };
    var timeout = options.timeout || 2000;
    var retries = options.retries || 1;
    return client.initPromise.then(function() {
      var serverURI = window.encodeURI(client.cloudUrl + config.apiPath + '/upload/binary');
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries);
    })
  };
};

client.init();

module.exports = client;

},{"./config":35,"q":"q"}],37:[function(require,module,exports){
require('./workorder-map.tpl.html.js');

},{"./workorder-map.tpl.html.js":38}],38:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.map.directives');
} catch (e) {
  ngModule = angular.module('wfm.map.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-map.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div id=\'gmap_canvas\'></div>\n' +
    '');
}]);

},{}],39:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.map.directives', ['wfm.core.mediator']);
module.exports = 'wfm.map.directives';

require('../../dist');

ngModule.directive('workorderMap', function($templateCache, mediator, $window, $document, $timeout) {
  function initMap(element, center) {
    var myOptions = {
      zoom:14,
      center:new google.maps.LatLng(center[0], center[1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(element[0].querySelector('#gmap_canvas'), myOptions);
    return map;
  };

  function resizeMap(element, parent) {
    var mapElement = element[0].querySelector('#gmap_canvas')
    var height = parent.clientHeight;
    var width = parent.clientWidth;
    mapElement.style.height = height + 'px';
    mapElement.style.width = width + 'px';

    console.log('Map dimensions:', width, height);
    google.maps.event.trigger(mapElement, 'resize');
  };

  function addMarkers(map, element, workorders) {
    workorders.forEach(function(workorder) {
      if (workorder.location) {
        // var lat = center[0] + (Math.random() - 0.5) * 0.05;
        // var long = center[1] + (Math.random() - 0.5) * 0.2;
        var lat = workorder.location[0];
        var long = workorder.location[1];
        var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat, long)});
        var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #'+workorder.id+'</strong><br>'+workorder.address+'<br>'});
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(map,marker);
        });
      }
    });
  };

  function findParent(document, element, selector) {
    if (!selector) {
      return element.parentElement;
    }
    var matches = document.querySelectorAll(selector);
    var parent = element.parentElement;
    while(parent) {
      var isParentMatch = Array.prototype.some.call(matches, function(_match) {
        return parent === _match;
      });
      if (isParentMatch) {
        break;
      };
      var parent = parent.parentElement;
      console.log('parent', parent)
    }
    return parent || element.parentElement;
  }

  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/workorder-map.tpl.html'),
    scope: {
      list: '=',
      center: '=',
      workorders: '=',
      containerSelector: '@'
    },
    link: function (scope, element, attrs, ctrl) {
      var map = initMap(element, scope.center || [49.27, -123.08]);
      addMarkers(map, element, scope.workorders);
      var parent = findParent($document[0], element[0], scope.containerSelector);
      var resizeListener = function() {
        resizeMap(element, parent);
      }
      $timeout(resizeListener);
      angular.element($window).on('resize', resizeListener); // TODO: throttle this
      scope.$on('$destroy', function() {
        angular.element($window).off('resize', resizeListener);
      });
    },
    controller: function($scope, $window, $element) {

    },
    controllerAs: 'ctrl'
  };
})

},{"../../dist":37}],40:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.map';

angular.module('wfm.map', [
  require('./directive')
, require('./service')
])

},{"./directive":39,"./service":41}],41:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.map.services', ['wfm.core.mediator']);
module.exports = 'wfm.map.services';

ngModule.factory('mapClient', function() {
  var mapClient = {};
  mapClient.getCoords = function(address) {
    // invoke the google API to return the co-ordinates of the given location
    // https://developers.google.com/maps/documentation/geocoding/intro
  }
})

},{}],42:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var mediator = require('../mediator');

angular.module('wfm.core.mediator', ['ng'])

.factory('mediator', function mediatorService($q, $log) {
  var originalRequest = mediator.request;

  // monkey patch the request function, wrapping the returned promise as an angular promise
  mediator.request = function() {
    var promise = originalRequest.apply(mediator, arguments);
    return $q.when(promise);
  };

  mediator.subscribeForScope = function(topic,scope,fn) {
    var subscriber = mediator.subscribe(topic,fn);
    scope.$on("$destroy", function() {
      mediator.remove(topic, subscriber.id);
    });

  };

  return mediator;
});

module.exports = 'wfm.core.mediator';

},{"../mediator":43}],43:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');
var Mediator = require('mediator-js').Mediator;
var q = require('q');

var mediator = new Mediator();

mediator.promise = function() {
  var deferred = q.defer();
  var cb = function(data) {
    deferred.resolve(data);
  };
  var args = [];
  Array.prototype.push.apply(args, arguments);
  args.splice(1, 0, cb);
  mediator.once.apply(mediator, args);
  return deferred.promise;
}

mediator.request = function(topic, parameters, options) {
  var topics = {}, subs = {}, complete = false, timeout;
  var deferred = q.defer();
  options = options || {};

  topics.request = topic;
  topics.done = options.doneTopic || 'done:' + topic;
  topics.error = options.errorTopic || 'error:' + topic;

  var uid = null;
  if (_.has(options, 'uid')) {
    uid = options.uid;
  } else if (typeof parameters !== "undefined" && parameters !== null) {
    uid = parameters instanceof Array ? parameters[0] : parameters;
  }

  if (uid !== null) {
     topics.done += ':' + uid;
     topics.error += ':' + uid;
  }

  if (!options.timeout) {
    options.timeout = 2000;
  };

  var cleanUp = function() {
    complete = true;
    clearTimeout(timeout);
    mediator.remove(topics.done, subs.done.id);
    mediator.remove(topics.error, subs.error.id);
  };

  subs.done = mediator.subscribe(topics.done, function(result) {
    cleanUp();
    deferred.resolve(result);
  });

  subs.error = mediator.subscribe(topics.error, function(error) {
    cleanUp();
    deferred.reject(error);
  });

  var args = [topics.request];
  if (parameters instanceof Array) {
    Array.prototype.push.apply(args, parameters);
  } else {
    args.push(parameters);
  }
  mediator.publish.apply(mediator, args);

  timeout = setTimeout(function() {
    if (!complete) {
      cleanUp();
      deferred.reject(new Error('Mediator request timeout for topic ' +  topic));
    }
  }, options.timeout);

  return deferred.promise;
};

module.exports = mediator;

},{"lodash":"lodash","mediator-js":"mediator-js","q":"q"}],44:[function(require,module,exports){
require('./message-detail.tpl.html.js');
require('./message-form.tpl.html.js');
require('./message-list.tpl.html.js');

},{"./message-detail.tpl.html.js":45,"./message-form.tpl.html.js":46,"./message-list.tpl.html.js":47}],45:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-detail.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <md-button ng-click="ctrl.closeMessage($event, ctrl.message)" hide-gt-sm class="md-icon-button">\n' +
    '      <md-icon aria-label="Close" md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '    <h3>\n' +
    '     {{ctrl.message.subject}}\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '  <div class="message" layout-padding layout-margin>\n' +
    '\n' +
    '    <div class="message-header">\n' +
    '      <div class="md-body-1">\n' +
    '        <span>From:</span> {{ctrl.message.sender.name}}\n' +
    '      </div>\n' +
    '      <div class="md-body-1">\n' +
    '        <span>To:</span> {{ctrl.message.receiver.name}}\n' +
    '      </div>\n' +
    '      <div class="md-body-1">\n' +
    '        <span>Status:</span> {{ctrl.message.status}}\n' +
    '      </div>\n' +
    '      <!--<div class="md-body-1 time-stamp">11:38 AM (3 hours ago)</div>-->\n' +
    '    </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <p class="md-body-1">{{ctrl.message.content}}</p>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],46:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>New message</h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '\n' +
    '<form name="messageForm" ng-submit="ctrl.done(messageForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '  <!--\n' +
    '  <md-input-container>\n' +
    '    <label for="messageState">Status</label>\n' +
    '    <input type="text" id="inputmessageType" name="messageStatus" ng-model="ctrl.model.status" disabled="true">\n' +
    '  </md-input-container>\n' +
    '  -->\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.receiver.$invalid && !messageForm.receiver.$pristine }">\n' +
    '    <label for="selectReceiver">To</label>\n' +
    '    <md-select ng-model="ctrl.model.receiver" name="receiver" id="selectReceiver" required>\n' +
    '       <md-option ng-repeat="worker in ctrl.workers" value="{{worker}}">{{worker.name}} ({{worker.position}})</md-option>\n' +
    '     </md-select>\n' +
    '     <div ng-messages="messageForm.receiver.$error" ng-if="ctrl.submitted || messageForm.receiver.$dirty">\n' +
    '       <div ng-message="required">The To: field is required.</div>\n' +
    '     </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.subject.$invalid && !messageForm.subject.$pristine }">\n' +
    '    <label for="inputSubject">Subject</label>\n' +
    '    <input type="text" id="inputSubject" name="subject" ng-model="ctrl.model.subject" required>\n' +
    '    <div ng-messages="messageForm.subject.$error" ng-if="ctrl.submitted || messageForm.subject.$dirty">\n' +
    '      <div ng-message="required">A subject is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.content.$invalid && !messageForm.content.$pristine }">\n' +
    '    <label for="inputContent">Message</label>\n' +
    '    <textarea id="inputContent" name="content" ng-model="ctrl.model.content" required md-maxlength="350"></textarea>\n' +
    '\n' +
    '    <div ng-messages="messageForm.content.$error" ng-show="ctrl.submitted || messageForm.content.$dirty">\n' +
    '      <div ng-message="required">Message content is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">Send message</md-button>\n' +
    '</form>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

},{}],47:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-list.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Messages</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search"  hide-xs hide-sm>\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" id="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '\n' +
    '<div class="messages">\n' +
    '\n' +
    '  <md-list>\n' +
    '    <md-list-item class="md-3-line" ng-repeat="message in ctrl.list | reverse" ng-click="ctrl.selectMessage($event, message)" class="md-3-line workorder-item"\n' +
    '     ng-class="{active: ctrl.selected.id === message.id, new: message.status === \'unread\'}">\n' +
    '      <img ng-src="{{message.sender.avatar}}" class="md-avatar" alt="{{message.sender.name}}" />\n' +
    '      <div class="md-list-item-text" layout="column">\n' +
    '        <!--<span class="md-caption time-stamp">13 mins ago</span>-->\n' +
    '        <h3>{{message.sender.name}}</h3>\n' +
    '        <h4>{{message.subject}}</h4>\n' +
    '        <p>{{message.content}}</p>\n' +
    '      </div>\n' +
    '      <md-divider md-inset></md-divider>\n' +
    '    </md-list-item>\n' +
    '  </md-list>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

},{}],48:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.message.directives', ['wfm.core.mediator']);
module.exports = 'wfm.message.directives';

require('../../dist');

ngModule.directive('messageList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-list.tpl.html')
  , scope: {
      list : '=list',
      selectedModel: '='
    }
  , controller: function($scope) {
        var self = this;
        self.list = $scope.list;
        self.selected = $scope.selectedModel;
        self.selectMessage = function(event, message) {
        self.selectedMessageId = message.id;
        mediator.publish('wfm:message:selected', message);
        event.preventDefault();
        event.stopPropagation();
      }
      self.ismessageShown = function(message) {
        return self.shownmessage === message;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.list = $scope.list.filter(function(message) {
          return String(message.sender.name).toLowerCase().indexOf(term) !== -1
            || String(message.subject).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})

.directive('messageForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-form.tpl.html')
  , scope: {
    message : '=value'
  , workers: '='
    }
  , controller: function($scope) {
      var self = this;
      self.model = angular.copy($scope.message);
      self.workers = $scope.workers;
      self.submitted = false;
      self.done = function(isValid) {
        self.submitted = true;
        self.model.receiver = JSON.parse(self.model.receiver);
        self.model.receiverId = self.model.receiver.id;
        self.model.status = "unread";
        if (isValid) {
            mediator.publish('wfm:message:created', self.model);
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('messageDetail', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-detail.tpl.html')
  , scope: {
    message : '=message'
    }
  , controller: function($scope) {
      var self = this;
      self.message = $scope.message;
      self.showSelectButton = !! $scope.$parent.messages;
      self.selectmessage = function(event, message) {
        mediator.publish('wfm:message:selected', message);
        event.preventDefault();
        event.stopPropagation();
      }
      self.closeMessage = function(event, message) {
        mediator.publish('wfm:message:close:' + message.id);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})
;

},{"../../dist":44}],49:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.message';

angular.module('wfm.message', [
  require('./directive')
, require('./sync-service')
])

},{"./directive":48,"./sync-service":50}],50:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.message.sync';

function removeLocalVars(object) {
  _.keys(object).filter(function(key) {
    return key.indexOf('_') === 0;
  }).forEach(function(localKey) {
    delete object[localKey];
  });
  if (object.results) {
    _.values(object.results).forEach(function(result) {
      _.keys(result.submission).filter(function(key) {
        return key.indexOf('_') === 0;
      }).forEach(function(localKey) {
        delete result.submission[localKey];
      });
    });
  };
};

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var message = {
        type: 'Message'
      , status: 'New'
      };
      deferred.resolve(message);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.message.sync', [require('fh-wfm-sync')])
.factory('messageSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var messageSync = {};
  messageSync.createManager = function(queryParams) {
    if (messageSync.manager) {
      return $q.when(messageSync.manager);
    } else {
      return messageSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        messageSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        return messageSync.manager;
      })
    }
  };
  messageSync.removeManager = function() {
    if (messageSync.manager) {
      return messageSync.manager.safeStop()
      .then(function() {
        delete messageSync.manager;
      })
    }
  }
  return messageSync;
})
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
;

},{"../config":51,"fh-wfm-sync":69,"lodash":"lodash"}],51:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/message',
  datasetId : 'messages',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],52:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.result';

angular.module('wfm.result', [
  require('./service')
])

},{"./service":53}],53:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.result.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.getByWorkorderId = function(workorderId) {
    return wrappedManager.list()
    .then(function(results) {
      return wrappedManager.filterByWorkorder(results, workorderId);
    });
  };
  wrappedManager.filterByWorkorder = function(resultsArray, workorderId) {
    var deferred = $q.defer();
    var filtered = resultsArray.filter(function(result) {
      return String(result.workorderId) === String(workorderId);
    });
    var result =  filtered && filtered.length ? filtered[0] : {};
    deferred.resolve(result);
    return deferred.promise;
  };
  wrappedManager.extractAppformSubmissionIds = function(result) {
    var submissionIds = null;
    if ( result && result.stepResults && ! _.isEmpty(result.stepResults)) {
      var appformStepResults = _.filter(result.stepResults, function(stepResult) {
        return !! stepResult.step.formId;
      });
      if (! _.isEmpty(appformStepResults)) {
        submissionIds = _.map(appformStepResults, function(stepResult) {
          return stepResult.submission.submissionId;
        }).filter(function(id) {
          return !! id;
        });
      };
    };
    return submissionIds;
  }
  return wrappedManager;
}

angular.module('wfm.result.sync', [require('fh-wfm-sync')])
.factory('resultSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var resultSync = {};
  resultSync.managerPromise = syncService.manage(config.datasetId)
  .then(function(manager) {
    resultSync.manager = wrapManager($q, $timeout, manager);
    console.log('Sync is managing dataset:', config.datasetId);
    return resultSync.manager;
  });
  return resultSync;
})

.filter('isEmpty', function () {
  return function (object) {
    return (Object.keys(object).length === 0);
  };
})

.run(function(mediator, resultSync) {
  mediator.subscribe('wfm:appform:submission:complete', function(event) {
    var metaData = event.metaData.wfm;
    var submissionResult = event.submissionResult;
    resultSync.managerPromise
    .then(function(manager) {
      return manager.getByWorkorderId(metaData.workorderId)
      .then(function(result) {
        var stepResult = result.stepResults[metaData.step.code];
        stepResult.submission = submissionResult;
        return manager.update(result);
      })
    })
    .then(function(result) {
      mediator.publish('wfm:result:remote-update:' + result.workorderId, result);
    })
  })
})
;

},{"../config":54,"fh-wfm-sync":69,"lodash":"lodash"}],54:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/result',
  datasetId : 'result',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],55:[function(require,module,exports){
require('./risk-assessment-form.tpl.html.js');
require('./risk-assessment.tpl.html.js');

},{"./risk-assessment-form.tpl.html.js":56,"./risk-assessment.tpl.html.js":57}],56:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.risk-assessment');
} catch (e) {
  ngModule = angular.module('wfm.risk-assessment', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/risk-assessment-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '  <div ng-show="riskAssessmentStep === 0" layout-padding class="risk-assesssment">\n' +
    '      <h2 class="md-title">Risk assessment complete?</h2>\n' +
    '      <p class="md-body-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n' +
    '\n' +
    '      <p class="md-body-1">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-warn" ng-click="ctrl.answerComplete($event, true)">No</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.answerComplete($event, true)">Yes</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '\n' +
    '  </div>\n' +
    '\n' +
    '  <div ng-if="riskAssessmentStep == 1" layout-padding>\n' +
    '\n' +
    '    <h3 class="md-title">Signature</h3>\n' +
    '    <p class="md-caption">Draw your signature inside the square</p>\n' +
    '    <signature-form value="ctrl.model.signature"></signature-form>\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.done($event)">Continue</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '  </div>\n' +
    '');
}]);

},{}],57:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.risk-assessment');
} catch (e) {
  ngModule = angular.module('wfm.risk-assessment', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/risk-assessment.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '  <md-subheader>Risk Assessment</md-subheader>\n' +
    '\n' +
    '  <md-list class="risk-assessment">\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="riskAssessment.complete" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! riskAssessment.complete" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="riskAssessment.complete">Complete</h3>\n' +
    '        <h3 ng-if="! riskAssessment.complete">Uncompleted</h3>\n' +
    '        <p>Risk Assessment</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line with-image">\n' +
    '      <md-icon md-font-set="material-icons">gesture</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3><signature value="riskAssessment.signature"></signature></h3>\n' +
    '        <p>Risk Assessment signature</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '</md-list>\n' +
    '');
}]);

},{}],58:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.risk-assessment', ['wfm.core.mediator', require('fh-wfm-signature')])

require('../../dist');

ngModule.directive('riskAssessment', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/risk-assessment.tpl.html')
  , scope: {
      riskAssessment: "=value"
    }
  , controller: function($scope) {
      var self = this;
    }
  , controllerAs: 'ctrl'
  };
})

ngModule.directive('riskAssessmentForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/risk-assessment-form.tpl.html')
  , scope: {
    }
  , controller: function($scope) {
      var self = this;
      $scope.riskAssessmentStep = 0
      self.model = {};
      self.answerComplete = function(event, answer) {
        self.model.complete = answer;
        $scope.riskAssessmentStep++;
        event.preventDefault();
        event.stopPropagation();
      };
      self.back = function(event) {
        mediator.publish('wfm:workflow:step:back');
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(event) {
        mediator.publish('wfm:workflow:step:done', self.model);
        event.preventDefault();
        event.stopPropagation();
      };
    }
  , controllerAs: 'ctrl'
  };
})
;

module.exports = 'wfm.risk-assessment';

},{"../../dist":55,"fh-wfm-signature":62}],59:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"./signature-form.tpl.html.js":60,"./signature.tpl.html.js":61,"dup":22}],60:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],61:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],62:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../../dist":59,"../canvas-drawr":63,"dup":25}],63:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],64:[function(require,module,exports){
require('./schedule-workorder-chip.tpl.html.js');
require('./schedule.tpl.html.js');

},{"./schedule-workorder-chip.tpl.html.js":65,"./schedule.tpl.html.js":66}],65:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.schedule.directives');
} catch (e) {
  ngModule = angular.module('wfm.schedule.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/schedule-workorder-chip.tpl.html',
    '<span class="wfm-chip wfm-chip-no-picture" style="width:300px;">\n' +
    '  <span class="wfm-chip-name" >{{ctrl.workorder.type}} #{{ctrl.workorder.id}}</span>\n' +
    '</span>\n' +
    '');
}]);

},{}],66:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.schedule.directives');
} catch (e) {
  ngModule = angular.module('wfm.schedule.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/schedule.tpl.html',
    '<!--\n' +
    'CONFIDENTIAL\n' +
    'Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    'This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="wfm-scheduler-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Scheduler</span>\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-datepicker ng-model="ctrl.scheduleDate" md-placeholder="Enter date" ng-change="ctrl.dateChange()"></md-datepicker>\n' +
    '    <!--\n' +
    '    <md-button class="md-icon-button" aria-label="Favorite">\n' +
    '    <md-icon md-font-set="material-icons">date_range</md-icon>\n' +
    '  </md-button>\n' +
    '-->\n' +
    '</div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<div layout="row">\n' +
    '  <div flex="70">\n' +
    '\n' +
    '    <table class="wfm-scheduler">\n' +
    '      <col width="30">\n' +
    '      <col width="70">\n' +
    '      <tr>\n' +
    '        <td class="wfm-scheduler-worker">\n' +
    '          <div class="wfm-toolbar-sm">\n' +
    '            <h3 class="md-subhead">\n' +
    '              Workers\n' +
    '            </h3>\n' +
    '          </div>\n' +
    '          <md-list>\n' +
    '            <md-list-item ng-repeat="worker in ctrl.workers">\n' +
    '              <img alt="Name" ng-src="{{worker.avatar}}" class="md-avatar" />\n' +
    '              <p>{{worker.name}}</p>\n' +
    '            </md-list-item>\n' +
    '          </md-list>\n' +
    '        </td>\n' +
    '        <td class="wfm-scheduler-calendar">\n' +
    '          <table>\n' +
    '            <tr><th ng-repeat="hour in [\'7am\', \'8am\', \'9am\', \'10am\', \'11am\', \'12pm\', \'1pm\', \'2pm\', \'3pm\', \'4pm\', \'5pm\', \'6pm\', \'7pm\']">{{hour}}</th></tr>\n' +
    '            <tr ng-repeat="worker in ctrl.workers">\n' +
    '              <td ng-repeat="hour in [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]" droppable="true" data-hour="{{hour}}" data-workerId="{{worker.id}}"></td>\n' +
    '            </tr>\n' +
    '          </table>\n' +
    '          <div class="wfm-scheduler-scheduled"></div>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '    </table>\n' +
    '  </div>\n' +
    '\n' +
    '  <div flex="30" class="wfm-scheduler-unscheduled" id="workorders-list" droppable="true">\n' +
    '    <div class="wfm-toolbar-sm">\n' +
    '      <h3 class="md-subhead">\n' +
    '        Workorders\n' +
    '      </h3>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],67:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.schedule.directives', ['wfm.core.mediator']);
module.exports = 'wfm.schedule.directives';

var _ = require('lodash');

require('../../dist');

ngModule.directive('schedule', function($templateCache, $compile, $timeout, mediator) {
  function getWorkerRowElements(element, workerId) {
    return element.querySelectorAll('[data-workerId="'+workerId+'"]');
  }

  function getHourElement(rowElements, hour) {
    var hourElement = Array.prototype.filter.call(rowElements, function(_hourElement) {
      return _hourElement.dataset.hour === String(hour);
    });
    return (hourElement.length) ? hourElement[0] : null;
  }

  function renderWorkorder(scope, parentElement, workorder) {
    var element = angular.element(parentElement);
    var _workorder = scope.workorder;
    scope.workorder = workorder;
    var chip = angular.element('<schedule-workorder-chip workorder="workorder" draggable="true"></schedule-workorder-chip>');

    if (!parentElement.classList.contains('wfm-scheduler-unscheduled')) {
      var hourElement = parentElement;
      parentElement = document.querySelector('.wfm-scheduler-scheduled');
      angular.element(parentElement).append(chip);
      $compile(chip)(scope);
      $timeout(function() {
        chip[0].style.position = 'absolute'
        chip[0].style.left = hourElement.offsetLeft + 'px';
        chip[0].style.top = hourElement.offsetTop + 'px';
      })
    } else {
      element.append(chip);
      $compile(chip)(scope);
    }
    chip[0].id = workorder.id;
    chip[0].dataset.workorderId = workorder.id;
    scope.workorder = _workorder;
  }

  function renderWorkorders(scope, element, workorders) {
    var workordersByWorker = {};
    workorders.forEach(function(workorder) {
      workordersByWorker[workorder.assignee] = workordersByWorker[workorder.assignee] || [];
      workordersByWorker[workorder.assignee].push(workorder);
    });

    _.forIn(workordersByWorker, function(workorders, workerId) {
      var workerRowElements = getWorkerRowElements(element, workerId);
      workorders.forEach(function(workorder) {
        var hour = new Date(workorder.startTimestamp).getHours();
        var hourElement = getHourElement(workerRowElements, hour);
        if (hourElement) {
          renderWorkorder(scope, hourElement, workorder);
        }
      });
    });
  }

  function renderUnscheduledWorkorderList(scope, ctrl, element) {
    var unscheduled = scope.workorders.filter(function(workorder) {
      return workorder.assignee == null || workorder.startTimestamp == null;
    });
    var unscheduledWorkorderList = element.querySelector('.wfm-scheduler-unscheduled');
    unscheduled.forEach(function(workorder) {
      renderWorkorder(scope, unscheduledWorkorderList, workorder);
    })
  }

  function scheduleWorkorder(workorder, workerId, date, hour) {
    workorder.assignee = workerId;
    if (date != null && hour !== null) {
      date.setHours(hour);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      workorder.startTimestamp = date.getTime();
    } else {
      workorder.startTimestamp = null;
    }
  }

  function getWorkorder(workorders, id) {
    var filtered = workorders.filter(function(workorder) {
      return String(workorder.id) === String(id);
    })
    return filtered.length ? filtered[0] : null;
  }

  function getWorker(workers, id) {
    var filtered = workers.filter(function(worker) {
      return worker.id === id;
    })
    return filtered.length ? filtered[0] : null;
  }

  function removeWorkorders(element) {
    var scheduled = element.querySelector('.wfm-scheduler-scheduled');
    while(scheduled.hasChildNodes()) {
      scheduled.removeChild(scheduled.firstChild);
    }
  }

  function render(scope, ctrl, element) {
    var workordersOnDate = scope.workorders.filter(function(workorder) {
      return new Date(workorder.startTimestamp).toDateString() === ctrl.scheduleDate.toDateString();
    });
    renderWorkorders(scope, element, workordersOnDate);
  }

  function updateWorkorder(workorder) {
    return mediator.request('wfm:schedule:workorder', workorder, {uid: workorder.id})
  }

  function workorderUpdated(scope, schedulerElement, workorder) {
    var previousChipElement = document.getElementById(workorder.id);
    if (previousChipElement) {
      previousChipElement.parentNode.removeChild(previousChipElement);
    }
    var parentElement;
    if (workorder.assignee && workorder.startTimestamp) {
      var workerRowElements = getWorkerRowElements(schedulerElement[0], workorder.assignee);
      var hour = new Date(workorder.startTimestamp).getHours();
      parentElement = getHourElement(workerRowElements, hour);
    }
    parentElement = parentElement || schedulerElement[0].querySelector('.wfm-scheduler-unscheduled');
    renderWorkorder(scope, parentElement, workorder);
    var index = _.findIndex(scope.workorders, function(_workorder) {
      return _workorder.id === workorder.id;
    })
    if (index >= 0) {
      scope.workorders[index] = workorder;
    }
  }

  function dragover(e, scope) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  };

  function dragenter(e) {
    this.classList.add('dragover');
  };

  function dragleave(e) {
    this.classList.remove('dragover');
  };

  function drop(e, scope, schedulerElement, unscheduledWorkorderList) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    var workorder = getWorkorder(scope.workorders, e.dataTransfer.getData('workorderid'));
    var dropElement = e.currentTarget;
    dropElement.classList.remove('dragover');
    var scheduledWorkorder = angular.copy(workorder);
    if (dropElement.id === 'workorders-list') {
      scheduleWorkorder(scheduledWorkorder, null, null, null);
    } else {
      var workerId = dropElement.dataset.workerid;
      var hour = dropElement.dataset.hour;
      scheduleWorkorder(scheduledWorkorder, workerId, scope.ctrl.scheduleDate, hour);
    }
    updateWorkorder(scheduledWorkorder)
      .then(function(updated) {
        workorderUpdated(scope, schedulerElement, updated)
      })
      .catch(function(error) {
        console.error(error);
      })
    return false;
  }

  function sizeCalendar(element) {
    var calendar = element[0].querySelector('.wfm-scheduler-calendar');
    calendar.style.position = 'inherit';
    var width =  calendar.clientWidth;
    calendar.style.position = 'absolute';
    calendar.style.width = width + 'px';
  }

  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/schedule.tpl.html'),
    scope: {
      workorders : '=',
      workers: '='
    },
    link: function (scope, element, attrs) {
      // Get the three major events
      $timeout(function afterDigest() {
        sizeCalendar(element);
        element[0].addEventListener('dragstart', function(event) {
          if (!event.srcElement.getAttribute || event.srcElement.getAttribute('draggable') !== 'true') {
            event.preventDefault();
            return;
          }
          var chip = event.srcElement;
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('workorderid', chip.dataset.workorderId);
        });
        var droppables = element[0].querySelectorAll('[droppable=true]');
        var unscheduledWorkorderList = element[0].querySelector('.wfm-scheduler-unscheduled');

        Array.prototype.forEach.call(droppables, function(droppable) {
          droppable.addEventListener('dragover', dragover);
          droppable.addEventListener('dragenter', dragenter);
          droppable.addEventListener('dragleave', dragleave);
          droppable.addEventListener('drop', function(e) {
            return drop(e, scope, element);
          });
        });
      });
    },
    controller: function($scope, $timeout, $element, $window) {
      var self = this;
      self.scheduleDate = new Date();
      $window.addEventListener('resize', function() {
        sizeCalendar($element);
      })
      renderUnscheduledWorkorderList($scope, self, $element[0]);
      self.dateChange = function() {
        removeWorkorders($element[0]);
        render($scope, self, $element[0]);

      }
      $timeout(function() {
        render($scope, self, $element[0]);
      })
      self.workers = $scope.workers;
    },
    controllerAs: 'ctrl'
  };
});

ngModule.directive('scheduleWorkorderChip', function($templateCache) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/schedule-workorder-chip.tpl.html'),
    scope: {
      workorder : '='
    },
    controller: function($scope) {
      this.workorder = $scope.workorder;
    },
    controllerAs: 'ctrl'
  };
});

},{"../../dist":64,"lodash":"lodash"}],68:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./directive":67,"dup":5}],69:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var sync = require('../client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};
  var managerPromise;

  function ManagerWrapper(_manager) {
    this.manager = _manager;
    var self = this;

    var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'getQueueSize', 'forceSync', 'waitForSync'];
    methodNames.forEach(function(methodName) {
      self[methodName] = function() {
        return $q.when(self.manager[methodName].apply(self.manager, arguments));
      }
    });
  };

  syncService.init = function($fh, syncOptions) {
    sync.init($fh, syncOptions);
  }

  syncService.manage = function(datasetId, options, queryParams, metaData) {
    return $q.when(sync.manage(datasetId, options, queryParams, metaData))
    .then(function(_manager) {
      var manager = new ManagerWrapper(_manager);
      manager.stream = _manager.stream;
      return manager;
    });
  };

  return syncService;
})
;

},{"../client":70}],70:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./config')
  , Rx = require('rx')
  ;

var $fh, initialized = false, notificationStream, listeners = [];

function transformDataSet(syncData) {
  var result = _.values(syncData).map(function(syncData) {
    return syncData.data;
  });
  return _.sortBy(result, function(o) { return o.id; });
}

function formatError(code, msg) {
  var error = 'Error';
  if (code && msg) {
    error += ' ' + code + ': ' + msg;
  } else if (code && !msg) {
    error += ': ' + code;
  } else if (!code && msg) {
    error += ': ' + msg;
  } else {
    error += ': no error details available'
  }
  return error;
}

function init(_$fh, _syncOptions) {
  if (initialized) {
    console.log('sync-client already initalized.');
  } else {
    console.log('sync-client initalizing.');
    $fh = _$fh;
    notificationStream = Rx.Observable.create(function (observer) {
      addListener(function(notification) {
        observer.onNext(notification);
      });
    })
    .share();
    var syncOptions = _.defaults(_syncOptions, defaultConfig.syncOptions);

    $fh.sync.init(syncOptions);
    initialized = true;
    $fh.sync.notify(function(notification) {
      listeners.forEach(function(listener) {
        listener.call(undefined, notification);
      });
    });
  }
};

function manage(datasetId, options, queryParams, metaData) {
  var deferred = q.defer();
  if (!initialized) {
    deferred.resolve('Sync not yet initialized.  Call sync-client.init() first.');
  } else {
    //manage the dataSet
    $fh.sync.manage(datasetId, options, queryParams, metaData, function() {
      var manager = new DataManager(datasetId);
      manager.stream = notificationStream.filter(function(notification) {
        return notification.dataset_id == datasetId;
      })
      deferred.resolve(manager);
    });
  }
  return deferred.promise;
}

function addListener(listener) {
  listeners.push(listener);
}

function DataManager(datasetId) {
  this.datasetId = datasetId;
}

DataManager.prototype.list = function() {
  var deferred = q.defer();
  $fh.sync.doList(this.datasetId, function(res) {
    var objects = transformDataSet(res);
    deferred.resolve(objects);
  }, function(code, msg) {
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.create = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doCreate(self.datasetId, object, function(msg) {
    // success
    self.stream.filter(function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'create'
        ; // && notification.uid == object._localuid;  TODO: get the sync framework to include the temporary uid in the notification
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      object._localuid = msg.uid;
      return self.update(object);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.read = function(id) {
  var deferred = q.defer();
  $fh.sync.doRead(this.datasetId, id, function(res) {
    // success
    deferred.resolve(res.data);
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.update = function(object) {
  var deferred = q.defer();
  var self = this;
  var uidPromise = _.has(object, 'id')
    ? q.when(String(object.id))
    : self.read(object._localuid).then(function(_object) {
      console.log('_object', _object)
      if (_.has(_object, 'id')) {
        object.id = _object.id;
        return String(_object.id);
      } else {
        return object._localuid;
      }
    });
  uidPromise.then(function(uid) {
    console.log('updating with id', uid)
  $fh.sync.doUpdate(self.datasetId, uid, object, function(msg) {
    // success
    self.stream.filter(function(notification) {
      return notification.code === 'local_update_applied'
        && notification.message === 'update'
        && notification.uid === uid;
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      return self.read(uid);
    })
    .then(function(result) {
      console.log('result', result)
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    console.error('Error updating', object);
    deferred.reject(new Error(formatError(code, msg)));
  });
});
  return deferred.promise;
};

DataManager.prototype.delete = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doDelete(self.datasetId, object.id, function(res) {
    // success
    var uid = String(object.id);
    self.stream.filter(function(notification) {
      return notification.code === 'local_update_applied'
        && notification.message === 'delete'
        && String(notification.uid) === uid;
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      deferred.resolve(notification.message);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.start = function() {
  var deferred = q.defer();
  $fh.sync.startSync(this.datasetId, function(){
    deferred.resolve('sync loop started');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.stop = function() {
  var deferred = q.defer();
  var self = this;
  $fh.sync.stopSync(this.datasetId, function(){
    if (self.recordDeltaReceivedSubscription) {
      self.recordDeltaReceivedSubscription.dispose();
    }
    deferred.resolve('sync loop stopped');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.forceSync = function() {
  var deferred = q.defer();
  $fh.sync.forceSync(this.datasetId, function(){
    deferred.resolve('sync loop will run');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.getQueueSize = function() {
  var deferred = q.defer();
  $fh.sync.getPending(this.datasetId, function(pending) {
    deferred.resolve(_.size(pending));
  });
  return deferred.promise;
}

DataManager.prototype.safeStop = function(userOptions) {
  var deferred = q.defer();
  var defaultOptions = {
    timeout: 2000
  }
  var self = this;
  var options = _.defaults(userOptions, defaultOptions);
  self.getQueueSize()
  .then(function(size) {
    if (size === 0) {
      self.stop().then(deferred.resolve);
    } else {
      deferred.notify('Calling forceSync sync before stop');
      return self.forceSync()
      .then(self.waitForSync.bind(self))
      .timeout(options.timeout)
      .then(self.getQueueSize.bind(self))
      .then(function(size) {
        if (size > 0) {
          deferred.reject(new Error('forceSync failed, outstanding results still present'));
        };
      })
      .then(self.stop.bind(self))
      .then(function() {
        deferred.resolve()
      }, function(error) {
        deferred.reject(new Error('forceSync timeout'));
      });
    }
  });
  return deferred.promise;
}

DataManager.prototype.waitForSync = function() {
  var deferred = q.defer();
  var self = this;
  self.stream.filter(function(notification) {
    return notification.code == 'sync_complete' || notification.code == 'sync_failed';
  }).take(1).toPromise(q.Promise)
  .then(function(notification) {
    if (notification.code === 'sync_complete') {
      deferred.resolve(notification);
    } else if (notification.code === 'sync_failed') {
      deferred.reject(new Error('Sync Failed', notification));
    }
  });
  return deferred.promise;
}

DataManager.prototype.publishRecordDeltaReceived = function(mediator) {
  var self = this;
  self.recordDeltaReceivedSubscription = self.stream.filter(function(notification) {
    return notification.code == 'record_delta_received'
  }).subscribe(function(notification) {
    mediator.publish('wfm:sync:record_delta_received:' + self.datasetId, notification);
  })
};

module.exports = {
  init: init
, manage: manage
, addListener: addListener
}

},{"./config":71,"lodash":"lodash","q":"q","rx":"rx"}],71:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],72:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Group #{{ctrl.model.id}}\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectGroup($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-button class="md-fab" aria-label="New group" ui-sref="app.group.new">\n' +
    '  <md-icon md-font-set="material-icons">add</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '<form name="groupForm" ng-submit="ctrl.done(groupForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="groupname">Group Name</label>\n' +
    '    <input type="text" id="groupname" name="groupname" ng-model="ctrl.model.name" required>\n' +
    '    <div ng-messages="workorderForm.groupname.$error" ng-if="ctrl.submitted || groupForm.groupname.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Role</label>\n' +
    '    <md-select ng-model="ctrl.model.role" name="assignee" id="assignee">\n' +
    '       <md-option value="admin">Admin</md-option>\n' +
    '       <md-option value="manager">Manager</md-option>\n' +
    '       <md-option value="worker">Worker</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id || ctrl.model.id === 0 ? \'Update\' : \'Create\'}} Group</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],73:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group-list.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Groups</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search">\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" id="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectGroup($event, group)" ng-repeat="group in ctrl.groups" ng-class="{active: ctrl.selected.id === group.id}">\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{group.name}}</h3>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],74:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.id}}</h3>\n' +
    '      <p>Group id</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.name}}</h3>\n' +
    '      <p>Group name</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.role}}</h3>\n' +
    '      <p>Role</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Members\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectMember($event, member)" ng-repeat="member in ctrl.members">\n' +
    '    <img alt="user.name" ng-src="{{member.avatar}}" class="md-avatar" />\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{member.name}}</h3>\n' +
    '      <p>{{member.position}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],75:[function(require,module,exports){
require('./group-form.tpl.html.js');
require('./group-list.tpl.html.js');
require('./group.tpl.html.js');
require('./worker-form.tpl.html.js');
require('./worker-list.tpl.html.js');
require('./worker.tpl.html.js');

},{"./group-form.tpl.html.js":72,"./group-list.tpl.html.js":73,"./group.tpl.html.js":74,"./worker-form.tpl.html.js":76,"./worker-list.tpl.html.js":77,"./worker.tpl.html.js":78}],76:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Worker ID {{ctrl.model.id}}\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorker($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-button class="md-fab" aria-label="New Workorder" ui-sref="app.worker.new">\n' +
    '  <md-icon md-font-set="material-icons">add</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '\n' +
    '<form name="workerForm" ng-submit="ctrl.done(workerForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Worker Name</label>\n' +
    '    <input type="text" id="workername" name="workername" ng-model="ctrl.model.name" required>\n' +
    '    <div ng-messages="workerForm.workername.$error" ng-if="ctrl.submitted || workerForm.workername.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Username</label>\n' +
    '    <input type="text" id="username" name="username" ng-model="ctrl.model.username" required>\n' +
    '    <div ng-messages="workerForm.username.$error" ng-if="ctrl.submitted || workerForm.username.$dirty">\n' +
    '      <div ng-message="required">A username is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Banner</label>\n' +
    '    <input type="text" id="banner" name="banner" ng-model="ctrl.model.banner">\n' +
    '    <div ng-messages="workerForm.banner.$error" ng-if="ctrl.submitted || workerForm.banner.$dirty"></div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Avatar</label>\n' +
    '    <input type="text" id="avatar" name="avatar" ng-model="ctrl.model.avatar">\n' +
    '    <div ng-messages="workerForm.avatar.$error" ng-if="ctrl.submitted || workerForm.avatar.$dirty"></div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Phone number</label>\n' +
    '    <input type="text" id="phonenumber" name="phonenumber" ng-model="ctrl.model.phone" required>\n' +
    '    <div ng-messages="workerForm.phonenumber.$error" ng-if="ctrl.submitted || workerForm.phonenumber.$dirty">\n' +
    '      <div ng-message="required">A phone number is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Email</label>\n' +
    '    <input type="text" id="email" name="email" ng-model="ctrl.model.email" required>\n' +
    '    <div ng-messages="workerForm.email.$error" ng-if="ctrl.submitted || workerForm.email.$dirty">\n' +
    '      <div ng-message="required">An email is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Position</label>\n' +
    '    <input type="text" id="position" name="position" ng-model="ctrl.model.position" required>\n' +
    '    <div ng-messages="workerForm.position.$error" ng-if="ctrl.submitted || workerForm.position.$dirty">\n' +
    '      <div ng-message="required">An position is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Group</label>\n' +
    '    <md-select ng-model="ctrl.model.group" name="group" id="group">\n' +
    '       <md-option ng-repeat="group in ctrl.groups" value="{{group.id}}">{{group.name}}</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container> \n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id || ctrl.model.id === 0 ? \'Update\' : \'Create\'}} Worker</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],77:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker-list.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Workers</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search">\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" name="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectWorker($event, user)"  ng-repeat="user in ctrl.workers" ng-class="{active: ctrl.selected.id === user.id}">\n' +
    '    <img alt="user.name" ng-src="{{user.avatar}}" class="md-avatar" />\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{user.name}}</h3>\n' +
    '      <p>{{user.position}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],78:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-content class="wfm-maincol-scroll wfm-maincol-scroll_with-menu">\n' +
    '  <div class="user-info-header" ng-style="ctrl.style">\n' +
    '    <h1 class="md-display-1">{{ctrl.worker.name}}</h1>\n' +
    '  </div>\n' +
    '  <md-list>\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">person</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.username}}</h3>\n' +
    '        <p>Username</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">phone</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.phone}}</h3>\n' +
    '        <p>Phone Number</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">email</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.email}}</h3>\n' +
    '        <p>Email</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">portrait</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.position}}</h3>\n' +
    '        <p>Position</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.group.name}}</h3>\n' +
    '        <p>Group</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-subheader class="md-no-sticky">Notes</md-subheader>\n' +
    '    <p class="md-body-1" layout-padding layout-margin>{{ctrl.worker.notes}}</p>\n' +
    '  </md-content>\n' +
    '');
}]);

},{}],79:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.user.directives', ['wfm.core.mediator']);
module.exports = 'wfm.user.directives';

require('../../dist');

ngModule.directive('workerList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-list.tpl.html')
  , scope: {
      workers : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.workers = $scope.workers;
      self.selected = $scope.selectedModel;
      self.selectWorker = function(event, worker) {
        mediator.publish('wfm:worker:selected', worker);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isWorkerShown = function(worker) {
        return self.shownWorker === worker;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.workers = $scope.workers.filter(function(worker) {
          return String(worker.id).indexOf(term) !== -1
            || String(worker.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('worker', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker.tpl.html')
  , scope: {
      worker : '=',
      group : '='
    }
  , controller: function($scope) {
      var self = this;
      self.worker = $scope.worker;
      self.group = $scope.group;
      var bannerUrl = self.worker.banner || self.worker.avatar;
      self.style = {
        'background-image': 'url(' + bannerUrl + ')',
        'background-position': self.worker.banner ? 'center center' : 'top center',
        'background-size': self.worker.banner ? 'auto' : 'contain',
        'background-repeat': 'no-repeat'
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('workerForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-form.tpl.html')
  , scope: {
      worker : '=value',
      groups : '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.model = angular.copy($scope.worker);
      self.submitted = false;
      self.selectWorker = function(event, worker) {
        if(worker.id) {
          mediator.publish('wfm:worker:selected', worker);
        }
        else {
          mediator.publish('wfm:worker:list');
        }
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          if (!self.model.id && self.model.id !== 0) {
            mediator.publish('wfm:worker:created', self.model);
          } else {
            mediator.publish('wfm:worker:updated', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group-list.tpl.html')
  , scope: {
      groups : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.selected = $scope.selectedModel;
      self.selectGroup = function(event, group) {
        mediator.publish('wfm:group:selected', group);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isGroupShown = function(group) {
        return self.shownGroup === group;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.groups = $scope.groups.filter(function(group) {
          return String(group.id).indexOf(term) !== -1
            || String(group.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('group', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group.tpl.html')
  , scope: {
      group : '=',
      members : '='
    }
  , controller: function($scope) {
      var self = this;
      self.group = $scope.group;
      self.members = $scope.members;
      self.selectMember = function(event, member) {
        mediator.publish('wfm:worker:selected', member);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/group-form.tpl.html')
    , scope: {
        group : '=value'
      }
    , controller: function($scope) {
        var self = this;
        self.model = angular.copy($scope.group);
        self.submitted = false;
        self.selectGroup = function(event, group) {
          if(group.id) {
            mediator.publish('wfm:group:selected', group);
          }
          else {
            mediator.publish('wfm:group:list');
          }
          event.preventDefault();
          event.stopPropagation();
        }
        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
            if (!self.model.id && self.model.id !== 0) {
              mediator.publish('wfm:group:created', self.model);
            } else {
              mediator.publish('wfm:group:updated', self.model);
            }
          }
        }
      }
    , controllerAs: 'ctrl'
    };
  });

},{"../../dist":75}],80:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.user.services', ['wfm.core.mediator'])
module.exports = 'wfm.user.services';

var UserClient = require('../user/user-client'),
    GroupClient = require('../group/group-client'),
    MembershipClient = require('../membership/membership-client');
 
function wrapClient($q, client, methodNames) {
  var wrapper = {};
  methodNames.forEach(function(methodName) {
    wrapper[methodName] = function() {
      return $q.when(client[methodName].apply(client, arguments));
    }
  });
  return wrapper;
}

ngModule.factory('userClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'auth', 'hasSession', 'clearSession', 'verify', 'getProfile'];
  var userClient = wrapClient($q, new UserClient(mediator), methodNames);
  return userClient;
});

ngModule.factory('groupClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new GroupClient(mediator), methodNames);
  return groupClient;
});

ngModule.factory('membershipClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new MembershipClient(mediator), methodNames);
  return groupClient;
});

},{"../group/group-client":83,"../membership/membership-client":85,"../user/user-client":87}],81:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.user';

angular.module('wfm.user', [
  require('./directive')
, require('./service.js')
])

},{"./directive":79,"./service.js":80}],82:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiPath: '/api/wfm/group'
}

},{}],83:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-group');

var GroupClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

GroupClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  return deferred.promise;
}

GroupClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

GroupClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

GroupClient.prototype.update = function(group) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + group.id,
    method: 'put',
    data: group
  });
};

GroupClient.prototype.create = function(group) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: group
  });
};

GroupClient.prototype.delete = function(group) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + group.id,
    method: 'delete',
    data: group
  });
};

module.exports = function(mediator) {
  return new GroupClient(mediator);
}

},{"./config-group":82,"lodash":"lodash","q":"q"}],84:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiPath: '/api/wfm/membership'
}

},{}],85:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-membership');

var MembershipClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

MembershipClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  return deferred.promise;
}

MembershipClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

MembershipClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

MembershipClient.prototype.update = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'put',
    data: membership
  });
};

MembershipClient.prototype.create = function(membership) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: membership
  });
};

MembershipClient.prototype.delete = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'delete',
    data: membership
  });
};

module.exports = function(mediator) {
  return new MembershipClient(mediator);
}

},{"./config-membership":84,"lodash":"lodash","q":"q"}],86:[function(require,module,exports){
(function (process){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/user',
  authpolicyPath: '/box/srv/1.1/admin/authpolicy',
  policyId: process.env.WFM_AUTH_POLICY_ID || 'wfm'
}

}).call(this,require('_process'))

},{"_process":109}],87:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-user');
var policyId;

var UserClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

var storeProfile = function(profileData) {
  localStorage.setItem('fh.wfm.profileData', JSON.stringify(profileData));
};

var retrieveProfileData = function() {
  var json = localStorage.getItem('fh.wfm.profileData');
  return json ? JSON.parse(json) : null;
}

UserClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  var promiseConfig = xhr({
    path: config.apiPath + '/config/authpolicy'
  }).then(function(_policyId) {
    policyId = _policyId;
    return policyId;
  })
  return q.all([deferred.promise, promiseConfig]);
}

UserClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

UserClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

UserClient.prototype.update = function(user) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + user.id,
    method: 'put',
    data: user
  });
};

UserClient.prototype.delete = function(user) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + user.id,
    method: 'delete',
    data: user
  });
};

UserClient.prototype.create = function(user) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: user
  });
};

UserClient.prototype.auth = function(username, password) {
  var deferred = q.defer();
  var self = this;
  this.initPromise.then(function() {
    $fh.auth({
      policyId: policyId,
      clientToken: self.appid,
      params: {
        userId: username,
        password: password
      }
    }, function (res) {
      // res.sessionToken; // The platform session identifier
      // res.authResponse; // The authetication information returned from the authetication service.
      var profileData = res.authResponse;
      if (typeof profileData === 'string' || profileData instanceof String) {
        try {
          profileData = JSON.parse(profileData);
        } catch(e) {
          console.error(e)
          console.log('Unable to parse the $fh.auth response. Using a workaround');
          profileData = JSON.parse(profileData.replace(/,\s/g, ',').replace(/[^,={}]+/g, '"$&"').replace(/=/g, ':'))
        }
      }
      storeProfile(profileData);
      self.mediator.publish('wfm:auth:profile:change', profileData);
      deferred.resolve(res);
    }, function (msg, err) {
      console.log(msg, err);
      var errorMsg = err.message;
      /* Possible errors:
      unknown_policyId - The policyId provided did not match any defined policy. Check the Auth Policies defined. See Auth Policies Administration
      user_not_found - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating exist on the platform, but this user does not exists.
      user_not_approved - - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating are in a list of approved users, but this user is not in that list.
      user_disabled - The user has been disabled from logging in.
      user_purge_data - The user has been flagged for data purge and all local data should be deleted.
      device_disabled - The device has been disabled. No user or apps can log in from the requesting device.
      device_purge_data - The device has been flagged for data purge and all local data should be deleted.
      */
      if (errorMsg == "user_purge_data" || errorMsg == "device_purge_data") {
        // TODO: User or device has been black listed from administration console and all local data should be wiped
        console.log('User or device has been black listed from administration console and all local data should be wiped');
      } else {
        console.log("Authentication failed - " + errorMsg);
        deferred.reject(errorMsg);
      }
    });
  })
  return deferred.promise;
}

UserClient.prototype.hasSession = function() {
  var deferred = q.defer();
  $fh.auth.hasSession(function(err, exists){
    if(err) {
      console.log('Failed to check session: ', err);
      deferred.reject(err);
    } else if (exists){
      //user is already authenticated
      //optionally we can also verify the session is acutally valid from client. This requires network connection.
      deferred.resolve(true)
    } else {
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

UserClient.prototype.clearSession = function() {
  var deferred = q.defer();
  var self = this;
  $fh.auth.clearSession(function(err){
    if(err) {
      console.log('Failed to clear session: ', err);
      deferred.reject(err);
    } else {
      storeProfile(null);
      self.mediator.publish('wfm:auth:profile:change', null);
      deferred.resolve(true);
    }
  });
  return deferred.promise;
}

UserClient.prototype.verify = function() {
  var deferred = q.defer();
  $fh.auth.verify(function(err, valid){
    if(err){
      console.log('failed to verify session');
      deferred.reject(err);
      return;
    } else if(valid) {
      console.log('session is valid');
      deferred.resolve(true)
    } else {
      console.log('session is not valid');
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

UserClient.prototype.getProfile = function() {
  return q.when(retrieveProfileData());
}

module.exports = function(mediator) {
  return new UserClient(mediator);
}

},{"./config-user":86,"lodash":"lodash","q":"q"}],88:[function(require,module,exports){
require('./vehicle-inspection-form.tpl.html.js');
require('./vehicle-inspection.tpl.html.js');

},{"./vehicle-inspection-form.tpl.html.js":89,"./vehicle-inspection.tpl.html.js":90}],89:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder');
} catch (e) {
  ngModule = angular.module('wfm.workorder', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/vehicle-inspection-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="40" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">local_gas_station</md-icon>\n' +
    '        Fuel (%)\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <md-slider flex md-discrete ng-model="ctrl.model.fuel" step="25" min="0" max="100" aria-label="rating">\n' +
    '    </md-slider>\n' +
    '  </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="30" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">album</md-icon>\n' +
    '        Tires\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <div flex layout-align="start start">\n' +
    '      <md-radio-group layout ng-model="ctrl.model.tires">\n' +
    '        <md-radio-button ng-value="false" >Fail</md-radio-button>\n' +
    '        <md-radio-button ng-value="true"> Pass </md-radio-button>\n' +
    '      </md-radio-group>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="30" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">brightness_low</md-icon>\n' +
    '        Lights\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <div flex layout-align="start start">\n' +
    '      <md-radio-group layout ng-model="ctrl.model.lights">\n' +
    '        <md-radio-button ng-value="false">Fail</md-radio-button>\n' +
    '        <md-radio-button ng-value="true"> Pass </md-radio-button>\n' +
    '      </md-radio-group>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.done($event)">Continue</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '');
}]);

},{}],90:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder');
} catch (e) {
  ngModule = angular.module('wfm.workorder', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/vehicle-inspection.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '\n' +
    '  <md-subheader>Vehicle Inspection</md-subheader>\n' +
    '\n' +
    '  <md-list class="risk-assessment">\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">local_gas_station</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{vehicleInspection.fuel}} %</h3>\n' +
    '        <p>Fuel</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="vehicleInspection.tires" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! vehicleInspection.tires" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="vehicleInspection.tires">Pass</h3>\n' +
    '        <h3 ng-if="! vehicleInspection.tires">Fail</h3>\n' +
    '        <p>Tires</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="vehicleInspection.lights" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! vehicleInspection.lights" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="vehicleInspection.lights">Pass</h3>\n' +
    '        <h3 ng-if="! vehicleInspection.lights">Fail</h3>\n' +
    '        <p>Lights</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '</md-list>\n' +
    '');
}]);

},{}],91:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

var ngModule = angular.module('wfm.vehicle-inspection', ['wfm.core.mediator']);

require('../../dist');

ngModule.directive('vehicleInspection', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/vehicle-inspection.tpl.html')
  , scope: {
      vehicleInspection: '=value'
    }
  };
})

ngModule.directive('vehicleInspectionForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/vehicle-inspection-form.tpl.html')
  , scope: {
    }
  , controller: function() {
    var self = this;
    self.model = {};
    self.back = function(event) {
      mediator.publish('wfm:workflow:step:back');
      event.preventDefault();
      event.stopPropagation();
    }
    self.done = function(event) {
      mediator.publish('wfm:workflow:step:done', self.model);
      event.preventDefault();
      event.stopPropagation();
    }
  }
  , controllerAs: 'ctrl'
  };
})

module.exports = 'wfm.vehicle-inspection';

},{"../../dist":88,"lodash":"lodash"}],92:[function(require,module,exports){
require('./workflow-form.tpl.html.js');
require('./workflow-progress.tpl.html.js');
require('./workflow-step-detail.tpl.html.js');
require('./workflow-step-form.tpl.html.js');

},{"./workflow-form.tpl.html.js":93,"./workflow-progress.tpl.html.js":94,"./workflow-step-detail.tpl.html.js":95,"./workflow-step-form.tpl.html.js":96}],93:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>{{ctrl.model.id ? \'Update\' : \'Create\'}} workflow</h3>\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkflow($event, workflow)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '<form name="workflowForm" ng-submit="ctrl.done(workflowForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Title</label>\n' +
    '    <input type="text" id="title" name="title" ng-model="ctrl.model.title" required>\n' +
    '    <div ng-messages="workflow.title.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A title is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id ? \'Update\' : \'Create\'}} Workflow</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],94:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-progress.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div class="workflow-progress" ng-class="{close: ctrl.closed}">\n' +
    '\n' +
    '<md-button class="md-icon-button md-warm expand-collapse">\n' +
    '  <md-icon ng-show="ctrl.closed" md-font-set="material-icons" ng-click="ctrl.open()">keyboard_arrow_down</md-icon>\n' +
    '  <md-icon ng-show="!ctrl.closed" md-font-set="material-icons" ng-click="ctrl.close()">keyboard_arrow_up</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="scroll-box">\n' +
    '  <ol>\n' +
    '    <li ng-class="{active: \'-1\' == ctrl.stepIndex, complete: -1 < ctrl.stepIndex}">\n' +
    '      <span class="md-caption"><md-icon md-font-set="material-icons">visibility</md-icon></span>Overview\n' +
    '    </li>\n' +
    '    <li ng-repeat="step in ctrl.steps" ng-class="{active: $index == ctrl.stepIndex, complete: $index < ctrl.stepIndex}">\n' +
    '      <span class="md-caption">{{$index + 1}}</span>{{step.name}}\n' +
    '    </li>\n' +
    '    <li ng-class="{active: ctrl.steps.length <= ctrl.stepIndex, complete: ctrl.steps.length <= ctrl.stepIndex}">\n' +
    '      <span class="md-caption"><md-icon md-font-set="material-icons">done</md-icon></span>Summary\n' +
    '    </li>\n' +
    '  </ol>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '</div><!-- workflow-progress -->\n' +
    '');
}]);

},{}],95:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-step-detail.tpl.html',
    '<h2 class="md-title">Step: {{step.name}}</h2>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.code}}</h3>\n' +
    '      <p>Step code</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.formId">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.formId}}</h3>\n' +
    '      <p>FormId</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.templates && step.templates.view">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.templates.view}}</h3>\n' +
    '      <p>View template</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.templates.form">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.templates.form}}</h3>\n' +
    '      <p>Form template</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],96:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-step-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar md-primary" ng-show="step">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>Update step</h3>\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkflow($event, workflow)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form name="workflowStepForm" ng-submit="ctrl.done(workflowStepForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Code</label>\n' +
    '    <input type="text" id="code" name="code" ng-model="ctrl.model.step.code" required>\n' +
    '    <div ng-messages="workflow.model.step.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A code is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Name</label>\n' +
    '    <input type="text" id="name" name="name" ng-model="ctrl.model.step.name" required>\n' +
    '    <div ng-messages="workflow.name.$error" ng-if="ctrl.submitted || workflowForm.name.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>FormID</label>\n' +
    '    <md-select ng-model="ctrl.model.step.formId" name="formId" id="formId">\n' +
    '       <md-option ng-repeat="form in ctrl.forms" value="{{form._id}}">{{form._id}} ({{form.name}})</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>form template</label>\n' +
    '    <input type="text" id="form" name="form" ng-model="ctrl.model.step.templates.form">\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>view template</label>\n' +
    '    <input type="text" id="view" name="view" ng-model="ctrl.model.step.templates.view">\n' +
    '  </md-input-container>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.isNew ? \'Add\' : \'Update\'}} step</md-button>\n' +
    '</form>\n' +
    '');
}]);

},{}],97:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

var ngModule = angular.module('wfm.workflow.directives', [
  'wfm.core.mediator'
]);
module.exports = 'wfm.workflow.directives';

require('../../dist');

ngModule.directive('workflowProgress', function($templateCache, $timeout) {
  function parseStepIndex(ctrl, stepIndex) {
    ctrl.stepIndex = stepIndex;
    ctrl.step = ctrl.steps[ctrl.stepIndex];
  }
  function scrollToActive(element) {
    element = element[0];
    var active = element.querySelector('li.active');
    if (!active) {
      active = element.querySelector('li');
    };
    var scroller = element.querySelector('.scroll-box');
    var offset = active.offsetTop;
    scroller.scrollTop = offset;
  }
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workflow-progress.tpl.html')
  , scope: {
      stepIndex: '=',
      workflow: '='
    }
  , link: function (scope, element, attrs) {
      $timeout(function() {
        scrollToActive(element);
      }, 0);
    }
  , controller: function($scope, $element) {
      var self = this;
      self.workflow = $scope.workflow;
      self.steps = $scope.workflow.steps;
      self.open = function() {
        self.closed = false;
      }
      self.close = function() {
        scrollToActive($element);
        self.closed = true;
      }
      parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0)

      $scope.$watch('stepIndex', function() {
        console.log('stepIndex changed')
        parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0);
        self.closed = true;
        $timeout(function() {
          scrollToActive($element);
        }, 0);
      });
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowStep', function($templateRequest, $compile, mediator) {
  return {
    restrict: 'E'
  , scope: {
      step: '=' // { ..., template: "an html template to use", templatePath: "a template path to load"}
    , workorder: '='
    }
  , link: function (scope, element, attrs) {
      scope.$watch('step', function(step) {
        if (scope.step) {
          if (scope.step.formId) {
            element.html('<appform form-id="step.formId"></appform>');
            $compile(element.contents())(scope);
          } else if (scope.step.templatePath) {
            $templateRequest(scope.step.templatePath).then(function(template) {
              element.html(template);
              $compile(element.contents())(scope);
            });
          } else {
            element.html(scope.step.templates.form);
            $compile(element.contents())(scope);
          };
        };
      });
    }
  , controller: function() {
      var self = this;
      self.mediator = mediator;
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowResult', function($compile) {
  var render = function(scope, element, attrs) {
    if (scope.workflow.steps && scope.result) {
      element.children().remove();
      scope.workflow.steps.forEach(function(step, stepIndex) {
        if (scope.result.stepResults && scope.result.stepResults[step.code]) {
          element.append('<md-divider></md-divider>');
          var template = '';
          template = '<workorder-submission-result'
          template += ' result="result.stepResults[\''+step.code+'\']"'
          template += ' step="workflow.steps[\''+stepIndex+'\']"'
          template += '></workorder-submission-result>';
          console.log(template);
          element.append(template);
        }
      });
      $compile(element.contents())(scope);
    };
  }
  return {
    restrict: 'E'
  , scope: {
      workflow: '='
    , result: '='
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
.directive('workflowForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/workflow-form.tpl.html')
    , scope: {
      workflow : '=value'
      }
    , controller: function($scope) {
        var self = this;
        self.model = angular.copy($scope.workflow);
        self.submitted = false;
        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
            if (!self.model.id && self.model.id !== 0) {
              self.model.steps = [];
              mediator.publish('wfm:workflow:created', self.model);
            }  else {
              mediator.publish('wfm:workflow:updated', self.model);
            }
          }
        };
        self.selectWorkflow = function(event, workflow) {
          if(workflow.id) {
            mediator.publish('wfm:workflow:selected', workflow);
          }
          else {
            mediator.publish('wfm:workflow:list');
          }
          event.preventDefault();
          event.stopPropagation();
        }
      }
    , controllerAs: 'ctrl'
    };
  })
.directive('workflowStepForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/workflow-step-form.tpl.html')
    , scope: {
      workflow : '=',
      step : '=',
      forms: '='
      }
    , controller: function($scope) {
        var self = this;
        self.forms = $scope.forms;
        var existingStep;
        self.submitted = false;
        if(!$scope.step){
          self.model = {
            step : {
              templates : {}
            },
            workflow : angular.copy($scope.workflow),
            isNew : true
          }
        }
        else {
          self.model = {
            workflow : angular.copy($scope.workflow),
            step : angular.copy($scope.step)
          }
          existingStep = $scope.workflow.steps.filter(function(item) {return item.code == $scope.step.code;}).length>0;
        }

        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
              //we check if the step already exist or not, if it exsit we remove the old element
              if(existingStep){
                var updatedStepIndex = _.findIndex($scope.workflow.steps, function(o) { return o.code == $scope.step.code; });
                $scope.workflow.steps[updatedStepIndex] = self.model.step;
                //$scope.workflow.steps = $scope.workflow.steps.filter(function(item) {return item.code != $scope.step.code;});
              }
              else {
               $scope.workflow.steps.push(self.model.step);
              }
              mediator.publish('wfm:workflow:updated', $scope.workflow);
          }
        };

        self.selectWorkflow = function(event, workflow) {
          mediator.publish('wfm:workflow:selected', workflow);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    , controllerAs: 'ctrl'
    };
  })
  .directive('workflowStepDetail', function($templateCache, mediator) {
      return {
        restrict: 'E'
      , template: $templateCache.get('wfm-template/workflow-step-detail.tpl.html')
      , scope: {
          step : '='
        }
      };
    })
;

},{"../../dist":92,"lodash":"lodash"}],98:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.workflow.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workflow = {
        title: ''
      };
      deferred.resolve(workflow);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workflow.sync', [require('fh-wfm-sync')])
.factory('workflowSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var workflowSync = {};
  workflowSync.createManager = function(queryParams) {
    if (workflowSync.manager) {
      return $q.when(workflowSync.manager);
    } else {
      return workflowSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workflowSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        // TODO: we should refactor these utilities functions somewhere else probably
        workflowSync.manager.stepReview = function(steps, result) {
          var stepIndex = -1;
          var complete;
          if (result && result.stepResults && result.stepResults.length !== 0) {
            complete = true;
            for (var i=0; i < steps.length; i++) {
              var step = steps[i];
              var stepResult = result.stepResults[step.code];
              if (stepResult && (stepResult.status === 'complete' || stepResult.status === 'pending')) {
                stepIndex = i;
                if (stepResult.status === 'pending') {
                  complete = false;
                }
              } else {
                break;
              };
            };
          }
          return {
            nextStepIndex: stepIndex,
            complete: complete // false is any steps are "pending"
          };
        }

        workflowSync.manager.nextStepIndex = function(steps, result) {
          return this.stepReview(steps, result).nextStepIndex;
        }

        workflowSync.manager.checkStatus = function(workorder, workflow, result) {
          var status;
          var stepReview = this.stepReview(workflow.steps, result);
          if (stepReview.nextStepIndex >= workflow.steps.length - 1 && stepReview.complete) {
            status = 'Complete';
          } else if (!workorder.assignee) {
            status = 'Unassigned';
          } else if (stepReview.nextStepIndex < 0) {
            status = 'New';
          } else {
            status = 'In Progress';
          }
          return status;
        }
        return workflowSync.manager;
      })
    }
  };
  workflowSync.removeManager = function() {
    if (workflowSync.manager) {
      return workflowSync.manager.safeStop()
      .then(function() {
        delete workflowSync.manager;
      })
    }
  };
  return workflowSync;
})
;

},{"../config":100,"fh-wfm-sync":69,"lodash":"lodash"}],99:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.workflow';

angular.module('wfm.workflow', [
  require('./directive')
, require('./service.js')
])

},{"./directive":97,"./service.js":98}],100:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/workflow',
  datasetId : 'workflows',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],101:[function(require,module,exports){
require('./workorder-form.tpl.html.js');
require('./workorder-list.tpl.html.js');
require('./workorder.tpl.html.js');

},{"./workorder-form.tpl.html.js":102,"./workorder-list.tpl.html.js":103,"./workorder.tpl.html.js":104}],102:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>{{ctrl.model.id ? \'Update\' : \'Create\'}} work order ID {{ctrl.model.id}}</h3>\n' +
    '    <md-button class="md-icon-button" aria-label="{{ctrl.status}}">\n' +
    '      <workorder-status status="ctrl.status"></workorder-status>\n' +
    '    </md-button>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkorder($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form name="workorderForm" ng-submit="ctrl.done(workorderForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <!--\n' +
    '  <md-input-container>\n' +
    '    <label for="workorderState">Status</label>\n' +
    '    <input type="text" id="inputWorkorderType" name="workorderStatus" ng-model="ctrl.model.status" disabled="true">\n' +
    '  </md-input-container>\n' +
    '  -->\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="workorderType">Type</label>\n' +
    '    <md-select ng-model="ctrl.model.type" name="workorderType" id="workorderType">\n' +
    '       <md-option value="Job Order">Job Order</md-option>\n' +
    '       <md-option value="Type 02">Type 02</md-option>\n' +
    '       <md-option value="Type 03">Type 03</md-option>\n' +
    '       <md-option value="Type 04">Type 04</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="workflow">Workflow</label>\n' +
    '    <md-select ng-model="ctrl.model.workflowId" name="workflow" id="workflow" required>\n' +
    '       <md-option ng-repeat="workflow in ctrl.workflows" value="{{workflow.id}}">{{workflow.id}} - {{workflow.title}}</md-option>\n' +
    '     </md-select>\n' +
    '     <div ng-messages="workorderForm.workflow.$error" ng-if="ctrl.submitted || workorderForm.workflow.$dirty">\n' +
    '       <div ng-message="required">A workflow is required.</div>\n' +
    '     </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Assignee</label>\n' +
    '    <md-select ng-model="ctrl.model.assignee" name="assignee" id="assignee">\n' +
    '       <md-option ng-repeat="worker in ctrl.workers" value="{{worker.id}}">{{worker.name}} ({{worker.position}})</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Title</label>\n' +
    '    <input type="text" id="inputTitle" name="title" ng-model="ctrl.model.title" required>\n' +
    '    <div ng-messages="workorderForm.title.$error" ng-if="ctrl.submitted || workorderForm.title.$dirty">\n' +
    '      <div ng-message="required">A title is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="inputAddress">Address</label>\n' +
    '    <input type="text"  id="inputAddress" name="address" ng-model="ctrl.model.address" required>\n' +
    '    <div ng-messages="workorderForm.address.$error" ng-show="ctrl.submitted || workorderForm.address.$dirty">\n' +
    '      <div ng-message="required">An address is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputAddress">Lattitude</label>\n' +
    '    <input type="number"  id="inputLattitude" name="lattitude" ng-model="ctrl.model.location[0]" required>\n' +
    '    <div ng-messages="workorderForm.lattitude.$error" ng-show="ctrl.submitted || workorderForm.lattitude.$dirty">\n' +
    '      <div ng-message="required">An lattitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputAddress">Longitude</label>\n' +
    '    <input type="number"  id="inputLattitude" name="longitude" ng-model="ctrl.model.location[1]" required>\n' +
    '    <div ng-messages="workorderForm.longitude.$error" ng-show="ctrl.submitted || workorderForm.longitude.$dirty">\n' +
    '      <div ng-message="required">An longitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputFinishDate">Finish Date</label>\n' +
    '    <input type="date"  id="inputFinishDate" name="finishDate" ng-model="ctrl.model.finishDate" required>\n' +
    '    <div ng-messages="workorderForm.finishDate.$error" ng-show="ctrl.submitted || workorderForm.finishDate.$dirty">\n' +
    '      <div ng-message="required">A finish date is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputFinishTime" >Finish Time</label>\n' +
    '    <input type="time"  id="inputFinishTime" name="finishTime" ng-model="ctrl.model.finishTime" required>\n' +
    '    <div ng-messages="workorderForm.finishTime.$error" ng-show="ctrl.submitted || workorderForm.finishTime.$dirty">\n' +
    '      <div ng-message="required">A finish time is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : workorderForm.summary.$invalid && !workorderForm.summary.$pristine }">\n' +
    '    <label for="inputSummary">Summary</label>\n' +
    '    <textarea id="inputSummary" name="summary" ng-model="ctrl.model.summary" required md-maxlength="150"></textarea>\n' +
    '\n' +
    '    <div ng-messages="workorderForm.summary.$error" ng-show="ctrl.submitted || workorderForm.summary.$dirty">\n' +
    '      <div ng-message="required">A summary date is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id ? \'Update\' : \'Create\'}} Workorder</md-button>\n' +
    '</form>\n' +
    '');
}]);

},{}],103:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-list.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Workorders</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search" hide-xs hide-sm>\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" name="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item\n' +
    '    ng-repeat="workorder in ctrl.workorders"\n' +
    '    ng-click="ctrl.selectWorkorder($event, workorder)"\n' +
    '    ng-class="{active: ctrl.selected.id === workorder.id}"\n' +
    '    class="md-3-line workorder-item"\n' +
    '  >\n' +
    '<!--\n' +
    '  TODO: change class name according to the color:\n' +
    '    "success" = green\n' +
    '    danger = "red"\n' +
    '    warning = "yellow"\n' +
    '    no class = grey\n' +
    '  -->\n' +
    '  <workorder-status class="" status="ctrl.resultMap[workorder.id].status"></workorder-status>\n' +
    '\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>\n' +
    '        {{workorder.type}} -\n' +
    '        <span ng-if="workorder.id">{{workorder.id}}</span>\n' +
    '        <span ng-if="! workorder.id" style="font-style: italic;">&lt;local&gt;</span>\n' +
    '      </h3>\n' +
    '      <h4>{{workorder.title}}</h4>\n' +
    '      <p>{{workorder.address}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],104:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '  <md-list>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon>\n' +
    '      <workorder-status status="status"></workorder-status>\n' +
    '    </md-icon>\n' +
    '        <div class="md-list-item-text">\n' +
    '           <h3>{{status || "New"}}</h3>\n' +
    '           <p>Status</p>\n' +
    '        </div>\n' +
    '      </md-list-item>\n' +
    '    </md-button>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line md-long-text">\n' +
    '      <md-icon md-font-set="material-icons">place</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '         <h3>{{workorder.location[0]}}, {{workorder.location[1]}}</h3>\n' +
    '         <p>\n' +
    '           {{workorder.address}}\n' +
    '         </p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">assignment</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.title}}</h3>\n' +
    '        <p>Workorder</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">event</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.startTimestamp | date:\'yyyy-MM-dd\' }}</h3>\n' +
    '        <p>Finish Date</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">schedule</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.startTimestamp | date:\'HH:mm:ss Z\' }}</h3>\n' +
    '        <p>Finish Time</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" ng-show="assignee && assignee.name">\n' +
    '      <md-icon md-font-set="material-icons">person</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{assignee.name}}</h3>\n' +
    '        <p>Asignee</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  </md-list>\n' +
    '\n' +
    '  <md-subheader class="md-no-sticky">Work Summary</md-subheader>\n' +
    '  <p class="md-body-1" layout-padding layout-margin>\n' +
    '    {{workorder.summary}}\n' +
    '  </p>\n' +
    '');
}]);

},{}],105:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.workorder.directives', ['wfm.core.mediator']);
module.exports = 'wfm.workorder.directives';

require('../../dist');

var getStatusIcon = function(status) {
  var statusIcon;
  switch(status) {
    case 'In Progress':
      statusIcon = 'autorenew';
      break;
    case 'Complete':
      statusIcon = 'assignment_turned_in';
      break;
    case 'Aborted':
      statusIcon = 'assignment_late';
      break;
    case 'On Hold':
      statusIcon = 'pause';
      break;
    case 'Unassigned':
      statusIcon = 'assignment_ind';
      break;
    case 'New':
      statusIcon = 'new_releases';
      break;
    default:
      statusIcon = 'radio_button_unchecked';
  }
  return statusIcon;
}

ngModule.directive('workorderList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder-list.tpl.html')
  , scope: {
      workorders : '=',
      resultMap: '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.workorders = $scope.workorders;
      $scope.$watch('workorders', function() {
        self.workorders = $scope.workorders;
      })
      self.resultMap = $scope.resultMap;
      self.selected = $scope.selectedModel;
      self.selectWorkorder = function(event, workorder) {
        // self.selectedWorkorderId = workorder.id;
        mediator.publish('wfm:workorder:selected', workorder);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isWorkorderShown = function(workorder) {
        return self.shownWorkorder === workorder;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.workorders = $scope.workorders.filter(function(workorder) {
          return String(workorder.id).indexOf(term) !== -1
            || String(workorder.title).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorder', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder.tpl.html')
  , scope: {
    workorder: '=',
    assignee: '=',
    status: '='
    }
  , controller: function($scope) {
      var self = this;
      self.showSelectButton = !! $scope.$parent.workorders;
      self.selectWorkorder = function(event, workorder) {
        if(workorder.id) {
          mediator.publish('wfm:workorder:selected', workorder);
        }
        else {
          mediator.publish('wfm:workorder:list');
        }

        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorderForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder-form.tpl.html')
  , scope: {
    workorder : '=value'
  , workflows: '='
  , workers: '='
  , status: '='
    }
  , controller: function($scope) {
      var self = this;
      self.model = angular.copy($scope.workorder);
      self.workflows = $scope.workflows;
      self.workers = $scope.workers;
      self.submitted = false;
      if (self.model && self.model.startTimestamp) {
        self.model.finishDate = new Date(self.model.startTimestamp);
        self.model.finishTime = new Date(self.model.startTimestamp);
      };
      self.selectWorkorder = function(event, workorder) {
        if(workorder.id) {
          mediator.publish('wfm:workorder:selected', workorder);
        }
        else {
          mediator.publish('wfm:workorder:list');
        }
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          self.model.startTimestamp = new Date(self.model.finishDate); // TODO: incorporate self.model.finishTime
          self.model.startTimestamp.setHours(
            self.model.finishTime.getHours(),
            self.model.finishTime.getMinutes(),
            self.model.finishTime.getSeconds(),
            self.model.finishTime.getMilliseconds()
          );
          self.model.finishDate = new Date(self.model.startTimestamp);
          self.model.finishTime = new Date(self.model.startTimestamp);
          if (!self.model.id && self.model.id !== 0) {
            mediator.publish('wfm:workorder:created', self.model);
          } else {
            mediator.publish('wfm:workorder:updated', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorderStatus', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: '<md-icon md-font-set="material-icons">{{statusIcon}}<md-tooltip>{{status}}</md-tooltip></md-icon>'
  , scope: {
      status : '=status'
    }
  , controller: function($scope) {
      $scope.statusIcon = getStatusIcon($scope.status);
    }
  , controllerAs: 'ctrl'
  }
})

.directive('workorderSubmissionResult', function($compile) {
  var render = function(scope, element, attrs) {
    if (!scope.result) {
      return;
    }
    var result = scope.result;
    var template = '';
    if (scope.step.formId) {
      var submission = result.submission;
      var tag, subId;
      if (submission._submission) {
        tag = 'submission';
        subId = submission._submission
        template = '<appform-submission submission="result.submission._submission"></appform-submission>';
      } else if (submission.submissionId) {
        template = '<appform-submission submission-id="\''+submission.submissionId+'\'"></appform-submission>';
      } else if (submission.submissionLocalId) {
        template = '<appform-submission submission-local-id="\''+submission.submissionLocalId+'\'"></appform-submission>';
      };
    } else {
      template = scope.step.templates.view;
    }
    element.append(template);
    $compile(element.contents())(scope);
  };

  return {
    restrict: 'E'
  , scope: {
      result: '='
    , step: '='
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
;

},{"../../dist":101}],106:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.workorder.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workorder = {
        type: 'Job Order'
      , status: 'New'
      };
      deferred.resolve(workorder);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workorder.sync', [require('fh-wfm-sync')])
.factory('workorderSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var workorderSync = {};
  workorderSync.createManager = function(queryParams) {
    if (workorderSync.manager) {
      return $q.when(workorderSync.manager);
    } else {
      return workorderSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workorderSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        return workorderSync.manager;
      })
    }
  };
  workorderSync.removeManager = function() {
    if (workorderSync.manager) {
      return workorderSync.manager.safeStop()
      .then(function() {
        delete workorderSync.manager;
      })
    }
  }
  return workorderSync;
})
;

},{"../config":108,"fh-wfm-sync":69,"lodash":"lodash"}],107:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.workorder';

angular.module('wfm.workorder', [
  require('./directive')
, require('./sync-service')
])

},{"./directive":105,"./sync-service":106}],108:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/workorder',
  datasetId : 'workorders',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],109:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],110:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var d3 = require('d3')
var c3 = require('c3')
var _ = require('lodash');

module.exports = 'app.analytics';

angular.module('app.analytics', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.analytics', {
      url: '/analytics',
      data: {
        columns: 2
      },
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/analytics/analytics.tpl.html',
          controller: 'analyticsController as ctrl'
        }
      }
    })
})

.controller('analyticsController', function (workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;

  //add fake data for bar charts
  self.workorders.forEach(function(workorder) {
    var estimated  = Math.floor((Math.random() * 10) + 15);
    var real = Math.floor((Math.random() * 10) + 15);
    workorder.estimatedHours = estimated;
    workorder.effectiveHours = real;
  });

  var areaChart = c3.generate({
    bindto: '#area-chart',
    size: {
      width: 450
    },
    data: {
      columns: [
        ['data1', 300, 350, 300, 0, 0, 0],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
    types: {
      data1: 'area',
      data2: 'area-spline'
    }
  }
});

})

;

},{"c3":"c3","d3":"d3","lodash":"lodash"}],111:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';
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
            form: function($stateParams, appformClient) {
              return appformClient.getForm($stateParams.formId);
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
            forms: function(appformClient) {
              return appformClient.list();
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
    self.selectedFormId = form._id;
    $state.go('app.appform.detail', {formId: form._id});
  };

  self.applyFilter = function(term) {
    term = term.toLowerCase();
    self.forms = forms.filter(function(form) {
      return String(form.name).toLowerCase().indexOf(term) !== -1
        || String(form.description).toLowerCase().indexOf(term) !== -1
        || String(form._id).indexOf(term) !== -1;
    });
  };


})

;

module.exports = 'app.appform';

},{"lodash":"lodash"}],112:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'app.auth';

angular.module('app.auth', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login',
      data: {
        columns: 2
      },
      views: {
        'content@app': {
          templateUrl: 'app/auth/login.tpl.html',
          controller: 'LoginCtrl as ctrl',
          resolve: {
            hasSession: function(userClient) {
              return userClient.hasSession();
            }
          }
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'content@app': {
          templateUrl: 'app/auth/profile.tpl.html',
          controller: 'ProfileCtrl as ctrl',
        }
      }
    })
})

.controller('LoginCtrl', function($state, $rootScope, userClient, hasSession) {
  var self = this;

  self.hasSession = hasSession;

  self.login = function(valid) {
    if (valid) {
      userClient.auth(self.username, self.password)
      .then(function() {
        self.loginMessages.success = true;
      }, function(err) {
        console.log(err);
        self.loginMessages.error = true;
      });
    }
  }

  self.loginMessages = {success: false, error: false};

  self.login = function(valid) {
    if (!valid) {
      return
    }
    userClient.auth(self.username, self.password)
    .then(function() {
      self.loginMessages.success = true;
      return userClient.hasSession();
    })
    .then(function(hasSession) {
      self.hasSession = hasSession;
      if ($rootScope.toState) {
        $state.go($rootScope.toState, $rootScope.toParams);
        delete $rootScope.toState;
        delete $rootScope.toParams;
      } else {
        $state.go('app.workorder');
      }
    }, function(err) {
      self.loginMessages.error = true;
      console.error(err);
    });
  }

  self.logout = function() {
    userClient.clearSession()
    .then(userClient.hasSession)
    .then(function(hasSession) {
      self.hasSession = hasSession;
    }, function(err) {
      console.err(err);
    });
  }
})

.controller('ProfileCtrl', function() {
})
;

},{}],113:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

module.exports = 'app.file';

angular.module('app.file', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.file', {
      url: '/files',
      resolve: {
        files: function(fileClient) {
          return fileClient.list();
        },
        workerMap: function(userClient) {
          return userClient.list().then(function(workers) {
            return workers.reduce(function(map, worker) {
              map[worker.id] = worker;
              return map;
            }, {});
          });
        }
      },
      views: {
        column2: {
          templateUrl: 'app/file/file-list.tpl.html',
          controller: 'FileListController as ctrl',
        },
        'content': {
          templateUrl: 'app/file/empty.tpl.html'
        }
      }
    })
    .state('app.file.detail', {
      url: '/detail/:fileUid',
      resolve: {
        file: function($stateParams, files) {
          return files.filter(function(file) {
            return file.uid === $stateParams.fileUid;
          })[0];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/file/file-detail.tpl.html',
          controller: 'FileController as ctrl'
        }
      }
    })
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:file:selected', function(file) {
    $state.go('app.file.detail', {
      fileUid: file.uid},
      { reload: true }
    );
  });
})

.controller('FileListController', function ($scope, files, workerMap) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.files = files;
  self.workerMap = workerMap;
})

.controller('FileController', function ($scope, file, workerMap) {
  var self = this;
  $scope.$parent.selected = {id: file.id};
  self.file = file;
  self.workerMap = workerMap;
})
;

},{"lodash":"lodash"}],114:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

module.exports = 'app.group';

angular.module('app.group', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.group', {
      url: '/groups',
      resolve: {
        groups: function(groupClient) {
          return groupClient.list();
        },
        users: function(userClient) {
          return userClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
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
          return groups.filter(function(group) {
            return String(group.id) === String($stateParams.groupId);
          })[0];
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
          return groups.filter(function(group) {
            return String(group.id) === String($stateParams.groupId);
          })[0];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl',
        }
      }
    })
    .state('app.group.new', {
      url: '/new',
      resolve: {
        group: function() {
          return {}
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
  mediator.subscribe('wfm:group:selected', function(group) {
    $state.go('app.group.detail', {
      groupId: group.id
    });
  });
  mediator.subscribe('wfm:group:list', function(group) {
    $state.go('app.group', null, {reload: true});
  });
})

.controller('groupListController', function ($scope, mediator, groups) {
  this.groups = groups;
  $scope.$parent.selected = {id: null};
})

.controller('groupDetailController', function ($scope, $state, $mdDialog, mediator, group, users, membership, groupClient) {
  var self = this;
  self.group = group;
  $scope.selected.id = group.id;
  var groupMembership = membership.filter(function(_membership) {
    return _membership.group == group.id
  });
  self.members = users.filter(function(user) {
    return _.some(groupMembership, function(_membership) {
      return _membership.user == user.id;
    })
  });
  self.delete = function($event, group) {
    $event.preventDefault();
    if(self.members.length > 0) {
      var alert = $mdDialog.confirm()
            .title('Operation not possible')
            .textContent('Group can not be deleted if it contains members.')
            .ok('Ok')
            .targetEvent($event);
      $mdDialog.show(alert);
    }
    else {
      var confirm = $mdDialog.confirm()
            .title('Would you like to delete group #'+group.id+'?')
            .textContent(group.name)
            .ariaLabel('Delete Group')
            .targetEvent($event)
            .ok('Proceed')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        groupClient.delete(group).then(function() {
          $state.go('app.group', null, {reload: true});
        }, function(err) {
          throw err;
        })
      });
    }
  };
})

.controller('groupFormController', function ($state, $scope, mediator, group, groupClient) {
  var self = this;
  self.group = group;
  mediator.subscribeForScope('wfm:group:updated', $scope, function(group) {
    return groupClient.update(group)
        .then(function() {
          $state.go('app.group.detail', {groupId: self.group.id}, {reload: true});
        })
    });
  mediator.subscribeForScope('wfm:group:created', $scope, function(group) {
    return groupClient.create(group)
        .then(function(createdgroup) {
          $state.go('app.group.detail', {groupId: createdgroup.id}, {reload: true});
        })
    });
})

;

},{"lodash":"lodash"}],115:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';
angular.module('app.home', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('app.home', {
      url: '/home',
      views: {
        content: {
          templateUrl: 'app/home/home.tpl.html'
        }
      }
    });
})
;

module.exports = 'app.home';

},{}],116:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var angular = require('angular');
require('feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-result')
, require('fh-wfm-message')
, require('fh-wfm-file')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-map')
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
, require('./map/map')
, require('./analytics/analytics')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      data: {
        columns: 3
      },
      resolve: {
        workorderManager: function(workorderSync) {
          return workorderSync.createManager();
        },
        workflowManager: function(workflowSync) {
          return workflowSync.createManager();
        },
        messageManager: function(messageSync) {
          return messageSync.createManager();
        },
        profileData: function(userClient) {
          return userClient.getProfile();
        }
      },
      controller: function($scope, $state, $mdSidenav, mediator, profileData){
        console.log('profileData', profileData);
        $scope.profileData = profileData;
        mediator.subscribe('wfm:auth:profile:change', function(_profileData) {
          $scope.profileData = _profileData;
        });
        $scope.$state = $state;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            if ($mdSidenav('left').isOpen()) {
              $mdSidenav('left').close();
            };
            $state.go(state, params);
          }
        }
      }
    });
})

.run(function($rootScope, $state, $q, mediator, userClient) {
  var initPromises = [];
  var initListener = mediator.subscribe('promise:init', function(promise) {
    initPromises.push(promise);
  });
  mediator.publish('init');
  console.log(initPromises.length, 'init promises to resolve.');
  var all = (initPromises.length > 0) ? $q.all(initPromises) : $q.when(null);
  all.then(function() {
    $rootScope.ready = true;
    console.log(initPromises.length, 'init promises resolved.');
    mediator.remove('promise:init', initListener.id);
    return null;
  });

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if(toState.name !== "app.login"){
      userClient.hasSession().then(function(hasSession) {
        if(!hasSession) {
          e.preventDefault();
          $rootScope.toState = toState;
          $rootScope.toParams = toParams;
          $state.go('app.login');
        }
      });
    };
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});

},{"./analytics/analytics":110,"./appform/appform":111,"./auth/auth":112,"./file/file":113,"./group/group":114,"./home/home":115,"./map/map":117,"./message/message":118,"./schedule/schedule":119,"./worker/worker":120,"./workflow/workflow":121,"./workorder/workorder":122,"angular":"angular","angular-material":"angular-material","angular-ui-router":"angular-ui-router","feedhenry":"feedhenry","fh-wfm-analytics":5,"fh-wfm-appform":17,"fh-wfm-camera":29,"fh-wfm-file":34,"fh-wfm-map":40,"fh-wfm-mediator":42,"fh-wfm-message":49,"fh-wfm-result":52,"fh-wfm-risk-assessment":58,"fh-wfm-schedule":68,"fh-wfm-user":81,"fh-wfm-vehicle-inspection":91,"fh-wfm-workflow":99,"fh-wfm-workorder":107}],117:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'app.map';

angular.module('app.map', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.map', {
      url: '/map',
      data: {
        columns: 2
      },
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/map/map.tpl.html',
          controller: 'mapController as ctrl'
        }
      }

    })
})

.controller('mapController', function ($window, $document, $timeout, workorders) {
  this.center = [49.27, -123.08];
  this.workorders = workorders;
})

;

},{}],118:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
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
      url: '/messages',
      views: {
        column2: {
          templateUrl: 'app/message/message-list.tpl.html',
          controller: 'MessageListController as messageListController',
          resolve: {
            messages: function(messageManager) {
              return messageManager.list();
            }
          }
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
          controller: 'messageDetailController as ctrl',
          resolve: {
            message: function($stateParams, messageManager) {
              return messageManager.read($stateParams.messageId)
            }
        }
      }
    }
    })
    .state('app.message.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: 'app/message/message-new.tpl.html',
          controller: 'messageNewController as ctrl',
          resolve: {
            message: function(messageManager) {
              return messageManager.new();
            },
            workers: function(userClient) {
              return userClient.list();
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:message:selected', function(message) {
    $state.go('app.message.detail', {
      messageId: message.id || message._localuid },
      { reload: true }
    );
  });
})

.controller('MessageListController', function ($scope, messages) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.messages = messages;
})

.controller('messageDetailController', function ($scope, message) {
  var self = this;
  self.message = message;
  message.status = "read";
  $scope.selected.id = message.id;
})

.controller('messageFormController', function (mediator) {
})

.controller('messageNewController', function ($scope, $state, mediator, messageManager, workers) {
  var self = this;
  self.workers = workers;
  mediator.subscribeForScope('wfm:message:created', $scope, function(message) {
    message.sender = $scope.profileData;
    return messageManager.create(message).then(function(_message) {
      $state.go('app.message', {workers: workers}, {reload: true});
    })
  });
})
;
module.exports = 'app.message';

},{"angular-messages":"angular-messages","lodash":"lodash"}],119:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

module.exports = 'app.schedule';

angular.module('app.schedule', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.schedule', {
      url: '/schedule',
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
      data: {
        columns: 2
      },
      views: {
        content: {
          templateUrl: 'app/schedule/schedule.tpl.html',
          controller: 'scheduleController as ctrl'
        }
      }
    })
})

.controller('scheduleController', function (mediator, workorderManager, workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;
  mediator.subscribe('wfm:schedule:workorder', function(workorder) {
    workorderManager.update(workorder).then(function(updatedWorkorder) {
      mediator.publish('done:wfm:schedule:workorder:' + workorder.id, updatedWorkorder);
    }, function(error) {
      console.error(error);
    });
  })
})

;

},{"lodash":"lodash"}],120:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

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
      url: '/workers',
      resolve: {
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        column2: {
          templateUrl: 'app/worker/worker-list.tpl.html',
          controller: 'WorkerListController as ctrl',
        },
        'content': {
          templateUrl: 'app/worker/empty.tpl.html',
        }
      }
    })
    .state('app.worker.detail', {
      url: '/worker/:workerId',
      resolve: {
        worker: function($stateParams, userClient) {
          return userClient.read($stateParams.workerId);
        },
        workorders: function($stateParams, workorderManager) {
          return workorderManager.list().then(function(workorders) {
            return workorders.filter(function(workorder) {
              return String(workorder.assignee) === String($stateParams.workerId);
            });
          });
        },
        messages: function($stateParams, messageManager) {
          return messageManager.list().then(function(messages){
            return messages.filter(function(message) {
             return String(message.receiverId) === String($stateParams.workerId);
           });
          });
        },
        files: function($stateParams, fileClient) {
          return fileClient.list().then(function(files){
            return files.filter(function(file) {
             return String(file.owner) === String($stateParams.workerId);
           });
          })
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        },
        groups: function(groupClient) {
          return groupClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-detail.tpl.html',
          controller: 'WorkerDetailController as ctrl'
        }
      }
    })
    .state('app.worker.edit', {
      url: '/worker/:workerId/edit',
      resolve: {
        worker: function($stateParams, userClient) {
          return userClient.read($stateParams.workerId);
        },
        groups: function(groupClient) {
          return groupClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-edit.tpl.html',
          controller: 'WorkerFormController as ctrl',
        }
      }
    })
    .state('app.worker.new', {
      url: '/new',
      resolve: {
        worker: function() {
          return {};
        },
        groups: function(groupClient) {
          return groupClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-edit.tpl.html',
          controller: 'WorkerFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:worker:selected', function(worker) {
    $state.go('app.worker.detail', {
      workerId: worker.id
    });
  });
  mediator.subscribe('wfm:worker:list', function(worker) {
    $state.go('app.worker', null, {reload: true});
  });
})

.controller('WorkerListController', function ($scope, mediator, workers) {
  var self = this;
  self.workers = workers;
  $scope.$parent.selected = {id: null};
})

.controller('WorkerDetailController', function ($scope, $state, $stateParams, $mdDialog, mediator, worker, workorders, messages, files, membership, groups, userClient) {
  var self = this;
  self.worker = worker;
  self.workorders = workorders;
  self.messages =  messages;
  self.files = files;
  $scope.selected.id = worker.id;

  var userMembership = membership.filter(function(_membership) {
    return _membership.user == worker.id
  })[0];
  if(userMembership){
    self.group = groups.filter(function(group) {
        return userMembership.group == group.id;
    })[0];
  }

  self.delete = function(event, worker) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete worker #'+worker.id+'?')
          .textContent(worker.name)
          .ariaLabel('Delete Worker')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      userClient.delete(worker)
      .then(function() {
        $state.go('app.worker', null, {reload: true});
      }, function(err) {
        throw err;
      })
    });
  },
  self.selectWorkorder = function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: true }
    );
  },
  self.selectMessage =  function(message) {
    $state.go('app.message.detail', {
      messageId: message.id || message._localuid },
      { reload: true }
    );
  }

})

.controller('WorkerFormController', function ($state, $scope, mediator, worker, groups, membership, userClient, membershipClient) {
  var self = this;
  self.worker = worker;
  self.groups = groups;
  //if we are updating let's assign the group
  if(worker.id || worker.id === 0) {
    var userMembership = membership.filter(function(_membership) {
      return _membership.user == worker.id
    })[0];
    if(userMembership){
      self.worker.group = groups.filter(function(group) {
          return userMembership.group == group.id;
      })[0].id;
    }
  }

  mediator.subscribeForScope('wfm:worker:updated', $scope, function(worker) {
    return userClient.update(worker)
        .then(function(updatedWorker) {
          //retrieve the existing membership
          var userMembership = membership.filter(function(_membership) {
            return _membership.user == worker.id
          })[0];
          if(userMembership){
            userMembership.group = updatedWorker.group;
            return membershipClient.update(userMembership)
              .then(function(updatedMembership) {
                $state.go('app.worker.detail', {workerId: updatedMembership.user}, {reload: true});
              });
          }
          else {
            return membershipClient.create({
              group : updatedWorker.group,
              user: updatedWorker.id
            }).then(function (createdMembership) {
                $state.go('app.worker.detail', {workerId: createdMembership.user}, {reload: true});
              })
          }

        })
    });
  mediator.subscribeForScope('wfm:worker:created', $scope, function(worker) {
    return userClient.create(worker)
        .then(function(createdWorker) {
          return membershipClient.create({
            group : createdWorker.group,
            user: createdWorker.id
          }).then(function (createdMembership) {
              $state.go('app.worker.detail', {workerId: createdMembership.user}, {reload: true});
            })
        })
    });
})

;

},{"angular-messages":"angular-messages","lodash":"lodash"}],121:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

require('angular-messages');

angular.module('app.workflow', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
, require('ng-sortable')
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workflow', {
      url: '/workflows/list',
      views: {
        column2: {
          templateUrl: 'app/workflow/workflow-list.tpl.html',
          controller: 'WorkflowListController as ctrl',
          resolve: {
            workflows: function(workflowManager) {
              return workflowManager.list();
            }
          }
        },
        'content': {
          templateUrl: 'app/workflow/empty.tpl.html',
        }
      }
    })
    .state('app.workflow.detail', {
      url: '/workflow/:workflowId',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-detail.tpl.html',
          controller: 'WorkflowDetailController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            },
            forms: function(appformClient) {
              return appformClient.list();
            }
          }
        }
      }
    })
    .state('app.workflow.add', {
      url: '/workflows/',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-add.tpl.html',
          controller: 'WorkflowAddController as ctrl',
          resolve: {
            workflow: function(workflowManager) {
              return workflowManager.new();
            }
          }
          }
        }
    })
    .state('app.workflow.edit', {
      url: '/workflow/:workflowId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-edit.tpl.html',
          controller: 'WorkflowFormController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            }
          }
        }
      }
    })
    .state('app.workflow.step', {
      url: '/workflow/:workflowId/steps/:code/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-step-edit.tpl.html',
          controller: 'WorkflowStepFormController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            },
            forms: function(appformClient) {
              return appformClient.list();
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:workflow:selected', function(workflow) {
    $state.go('app.workflow.detail', {
      workflowId: workflow.id || workflow._localuid },
      { reload: true }
    );
  });
  mediator.subscribe('wfm:workflow:list', function(workflow) {
    $state.go('app.workflow', null, {reload: true});
  });
})

.controller('WorkflowListController', function ($scope, mediator, workflows, $stateParams) {
  var self = this;
  self.workflows = workflows;
  self.selectedWorkflowId = $stateParams.workflowId;
  $scope.$parent.selected = {id: null};
  self.selectWorkflow = function(event, workflow) {
    self.selectedWorkflowId = workflow.id;
    mediator.publish('wfm:workflow:selected', workflow);
  };

  self.applyFilter = function(term) {
    term = term.toLowerCase();
    self.workflows = workflows.filter(function(workflow) {
      return String(workflow.title).toLowerCase().indexOf(term) !== -1
        || String(workflow.id).indexOf(term) !== -1;
    });
  };
})

.controller('WorkflowDetailController', function ($scope, $state, $mdDialog, mediator, workflowManager, workorderManager, workflow, forms) {
  var self = this;
  $scope.selected.id = workflow.id;
  $scope.dragControlListeners = {
    containment: '#stepList',
    orderChanged :  function (event) {
      workflowManager.update(workflow).then(function(_workflow) {
        $state.go('app.workflow.detail',
         {workflowId: _workflow.id},
         { reload: true }
       );
      }, function(error) {
        console.log(error);
      })
    }
  }
  self.workflow = workflow;
  self.forms = forms;
  self.delete = function(event, workflow) {
    event.preventDefault();
    workorderManager.list()
      .then(function(workorders){
        var workorder = workorders.filter(function(workorder) {
          return String(workorder.workflowId) === String(workflow.id);
        })
        var title = (workorder.length)
          ? "Workflow is used at least by at least 1 workorder, are you sure you want to delete workflow #'"+workflow.id+"?"
          : "Would you like to delete workflow #"+workflow.id+"?";
        var confirm = $mdDialog.confirm()
          .title(title)
          .textContent(workflow.title)
          .ariaLabel('Delete workflow')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
        return confirm;
      })
      .then(function(confirm) {
        return $mdDialog.show(confirm)
      })
      .then(function() {
        return workflowManager.delete(workflow)
        })
      .then(function() {
          $state.go('app.workflow', null, {reload: true});
        }, function(err) {
          throw err;
        });
      };

  self.deleteStep = function(event, step, workflow) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete step : '+ step.name +' ?')
          .textContent(step.name)
          .ariaLabel('Delete step')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      workflow.steps = workflow.steps.filter(function(item) {
        return item.code !== step.code;
      });
      workflowManager.update(workflow).then(function(_workflow) {
        $state.go('app.workflow.detail',
         {workflowId: _workflow.id},
         { reload: true }
       );
      }, function(error) {
        console.log(error);
      })
    });
  };

  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
        {workflowId: _workflow.id},
        { reload: true }
       );
    }, function(error) {
      console.log(error);
    })
  });
})

.controller('WorkflowAddController', function ($scope, mediator, workflowManager, workflow ) {
  var self = this;
  self.workflow = workflow;

  mediator.subscribeForScope('wfm:workflow:created', $scope, function(workflow) {
    workflowManager.create(workflow).then(function(_workflow) {
      mediator.publish('wfm:workflow:selected', _workflow);
    });
  });

})

.controller('WorkflowFormController', function ($scope, $state, mediator, workflow, workflowManager) {
  var self = this;

  self.workflow = workflow;

  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
      {workflowId: _workflow.id},
      { reload: true }
    );
    }, function(error) {
      console.log(error);
    })
  });
})

.controller('WorkflowStepFormController', function ($scope, $state, $stateParams, mediator, workflow, workflowManager, forms) {
  var self = this;

  self.workflow = workflow;
  self.forms = forms;
  self.step = workflow.steps.filter(function(item) {
    return item.code == $stateParams.code;
  })[0];
  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
      {workflowId: _workflow.id},
      { reload: true }
    );
    }, function(error) {
      console.log(error);
    })
  });
})

;

module.exports = 'app.workflow';

},{"angular-messages":"angular-messages","ng-sortable":"ng-sortable"}],122:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');
require('angular-messages');

angular.module('app.workorder', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder', {
      url: '/workorders/list',
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workflows: function(workflowManager) {
          return workflowManager.list();
        },
        resultManager: function(resultSync) {
          return resultSync.managerPromise;
        },
        resultMap: function(resultManager) {
          return resultManager.list()
          .then(function(results) {
            var map = {};
            results.forEach(function(result) {
              map[result.workorderId] = result;
            });
            return map;
          })
        }
      },
      views: {
        column2: {
          templateUrl: 'app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController',
        },
        'content': {
          templateUrl: 'app/workorder/empty.tpl.html',
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-new.tpl.html',
          controller: 'WorkorderNewController as ctrl',
          resolve: {
            workorder: function(workorderManager) {
              return workorderManager.new();
            },
            workers: function(userClient) {
              return userClient.list();
            }
          }
        }
      }
    })
    .state('app.workorder.detail', {
      url: '/workorder/:workorderId',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-detail.tpl.html',
          controller: 'WorkorderDetailController as ctrl',
          resolve: {
            workorder: function($stateParams, appformClient, workorderManager) {
              return workorderManager.read($stateParams.workorderId)
            },
            workers: function(userClient) {
              return userClient.list();
            },
            result: function(workorder, resultMap) {
              return resultMap[workorder.id];
            }
          }
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-edit.tpl.html',
          controller: 'WorkorderFormController as ctrl',
          resolve: {
            workorder: function($stateParams, workorderManager) {
              return workorderManager.read($stateParams.workorderId);
            },
            workers: function(userClient) {
              return userClient.list();
            },
            result: function(workorder, resultMap) {
              return resultMap[workorder.id];
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:workorder:selected', function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: true }
    );
  });
  mediator.subscribe('wfm:workorder:list', function(workflow) {
    $state.go('app.workorder', null, {reload: true});
  });
})

.controller('WorkorderListController', function ($scope, workorders, resultMap) {
  var self = this;
  self.workorders = workorders;
  self.resultMap = resultMap;
  $scope.$parent.selected = {id: null};
})

.controller('WorkorderDetailController', function ($scope, $state, $mdDialog, mediator, workorderManager, workflowManager, workflows, workorder, result, workers) {
  var self = this;
  $scope.selected.id = workorder.id;

  self.workorder = workorder;
  var workflow = workflows.filter(function(workflow) {
    return String(workflow.id) === String(workorder.workflowId);
  });
  if (workflow.length) {
    self.workflow = workflow[0];
  }
  self.result = result;
  var assignee = workers.filter(function(worker) {
    return String(worker.id) === String(workorder.assignee);
  })
  if (assignee.length) {
    self.assignee = assignee[0];
  }

  var nextStepIndex = workflowManager.nextStepIndex(self.workflow.steps, self.result);
  var numSteps = self.workflow.steps.length;
  self.progress = (100 * (nextStepIndex + 1) / numSteps).toPrecision(3);
  console.log(nextStepIndex, numSteps, self.progress);

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('wfm:workflow:begin', workorder.id);
    event.preventDefault();
  };

  self.delete = function(event, workorder) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete workorder #'+workorder.id+'?')
          .textContent(workorder.title)
          .ariaLabel('Delete Workorder')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      return workorderManager.delete(workorder)
      .then(function() {
        $state.go('app.workorder', null, {reload: true});
      }, function(err) {
        throw err;
      })
    });
  }
})

.controller('WorkorderNewController', function($scope, workorder, workflows, mediator, workorderManager, workers) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;

  mediator.subscribeForScope('wfm:workorder:created', $scope, function(workorder) {
    workorderManager.create(workorder).then(function(_workorder) {
      mediator.publish('wfm:workorder:selected', _workorder);
    });
  });
})

.controller('WorkorderFormController', function ($scope, $state, mediator, workorderManager, workorder, workflows, workers, result) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;
  self.result = result;

  mediator.subscribeForScope('wfm:workorder:updated', $scope, function(workorder) {
    return workorderManager.update(workorder).then(function(_workorder) {
      mediator.publish('wfm:workorder:selected', _workorder);
    })
  });
})

;

module.exports = 'app.workorder';

},{"angular-messages":"angular-messages","lodash":"lodash"}]},{},[116])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2FyZWEudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2NoYXJ0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYW5hbHl0aWNzL2Rpc3QvcGllLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvYW5hbHl0aWNzLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtcGhvdG8udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1zdWJtaXNzaW9uLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL2FwcGZvcm0tbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0tbWVkaWF0b3IuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0uanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbm9kZV9tb2R1bGVzL2ZoLXdmbS1zaWduYXR1cmUvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9ub2RlX21vZHVsZXMvZmgtd2ZtLXNpZ25hdHVyZS9kaXN0L3NpZ25hdHVyZS1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL25vZGVfbW9kdWxlcy9maC13Zm0tc2lnbmF0dXJlL2Rpc3Qvc2lnbmF0dXJlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL25vZGVfbW9kdWxlcy9maC13Zm0tc2lnbmF0dXJlL2xpYi9hbmd1bGFyL3NpZ25hdHVyZS1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9ub2RlX21vZHVsZXMvZmgtd2ZtLXNpZ25hdHVyZS9saWIvY2FudmFzLWRyYXdyLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvZGlzdC9jYW1lcmEudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvY2FtZXJhLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tY2FtZXJhL2xpYi9jYW1lcmEuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWZpbGUvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1maWxlL2xpYi9hbmd1bGFyL2ZpbGUtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWZpbGUvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tZmlsZS9saWIvZmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9kaXN0L3dvcmtvcmRlci1tYXAudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9tYXAtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9zZXJ2aWNlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZWRpYXRvci9saWIvYW5ndWxhci9tZWRpYXRvci1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVkaWF0b3IvbGliL21lZGlhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvZGlzdC9tZXNzYWdlLWRldGFpbC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9kaXN0L21lc3NhZ2UtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9kaXN0L21lc3NhZ2UtbGlzdC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvbGliL2FuZ3VsYXIvbWVzc2FnZS1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvYW5ndWxhci9zeW5jLXNlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmVzdWx0L2xpYi9hbmd1bGFyL3Jlc3VsdC1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmVzdWx0L2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXJlc3VsdC9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yaXNrLWFzc2Vzc21lbnQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmlzay1hc3Nlc3NtZW50L2Rpc3Qvcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXJpc2stYXNzZXNzbWVudC9kaXN0L3Jpc2stYXNzZXNzbWVudC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmlzay1hc3Nlc3NtZW50L2xpYi9hbmd1bGFyL3Jpc2stYXNzZXNzbWVudC1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9zY2hlZHVsZS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zeW5jL2xpYi9hbmd1bGFyL3N5bmMtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXN5bmMvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc3luYy9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3QvZ3JvdXAtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L2dyb3VwLWxpc3QudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC9ncm91cC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3Qvd29ya2VyLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC93b3JrZXItbGlzdC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L3dvcmtlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvYW5ndWxhci91c2VyLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2xpYi9ncm91cC9jb25maWctZ3JvdXAuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2dyb3VwL2dyb3VwLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvbWVtYmVyc2hpcC9jb25maWctbWVtYmVyc2hpcC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvbWVtYmVyc2hpcC9tZW1iZXJzaGlwLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvdXNlci9jb25maWctdXNlci5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvdXNlci91c2VyLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdmVoaWNsZS1pbnNwZWN0aW9uL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXZlaGljbGUtaW5zcGVjdGlvbi9kaXN0L3ZlaGljbGUtaW5zcGVjdGlvbi1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24vZGlzdC92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXZlaGljbGUtaW5zcGVjdGlvbi9saWIvYW5ndWxhci92ZWhpY2xlLWluc3BlY3Rpb24tbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3Qvd29ya2Zsb3ctZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1wcm9ncmVzcy50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1zdGVwLWRldGFpbC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1zdGVwLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvbGliL2FuZ3VsYXIvd29ya2Zsb3ctbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3Jrb3JkZXIvZGlzdC93b3Jrb3JkZXItZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2Rpc3Qvd29ya29yZGVyLWxpc3QudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9kaXN0L3dvcmtvcmRlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL3N5bmMtc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL3dvcmtvcmRlci1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2FwcC9hbmFseXRpY3MvYW5hbHl0aWNzLmpzIiwic3JjL2FwcC9hcHBmb3JtL2FwcGZvcm0uanMiLCJzcmMvYXBwL2F1dGgvYXV0aC5qcyIsInNyYy9hcHAvZmlsZS9maWxlLmpzIiwic3JjL2FwcC9ncm91cC9ncm91cC5qcyIsInNyYy9hcHAvaG9tZS9ob21lLmpzIiwic3JjL2FwcC9tYWluLmpzIiwic3JjL2FwcC9tYXAvbWFwLmpzIiwic3JjL2FwcC9tZXNzYWdlL21lc3NhZ2UuanMiLCJzcmMvYXBwL3NjaGVkdWxlL3NjaGVkdWxlLmpzIiwic3JjL2FwcC93b3JrZXIvd29ya2VyLmpzIiwic3JjL2FwcC93b3JrZmxvdy93b3JrZmxvdy5qcyIsInNyYy9hcHAvd29ya29yZGVyL3dvcmtvcmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FyZWEudHBsLmh0bWwnLFxuICAgICc8ZGl2IGZsZXggaGlkZS1zbT5cXG4nICtcbiAgICAnICAgIDxtZC1jYXJkPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGlkPVwiYXJlYS1jaGFydFwiPjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtY2FyZC1jb250ZW50PlxcbicgK1xuICAgICcgICAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+QXJlYSBDaGFydDwvaDI+XFxuJyArXG4gICAgJyAgICAgICAgPHA+XFxuJyArXG4gICAgJyAgICAgICAgICBUaGlzIGFyZWEgY2hhcnQgY29tcGFyZXMgdGhlIGVzdGltYXRlZCB3b3Jrb3JkZXIgdGltZSA8YnI+Y29tcGxldGlvbiB0aW1lIHdpdGhcXG4nICtcbiAgICAnICAgICAgICAgIHRoZSByZWFsIGNvbXBsZXRpb24gdGltZS5cXG4nICtcbiAgICAnICAgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtY2FyZC1jb250ZW50PlxcbicgK1xuICAgICcgICAgPC9tZC1jYXJkPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2NoYXJ0LnRwbC5odG1sJyxcbiAgICAnPGRpdiBmbGV4PlxcbicgK1xuICAgICcgIDxtZC1jYXJkPlxcbicgK1xuICAgICcgICAgPGRpdiBpZD1cImJhci1jaGFydFwiPjwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICAgICAgPGgyIGNsYXNzPVwibWQtdGl0bGVcIj5Db21wbGV0aW9uIHRpbWUgLyBFc3RpbWF0ZWQgdGltZTwvaDI+XFxuJyArXG4gICAgJyAgICAgIDxwPlxcbicgK1xuICAgICcgICAgICAgIFRoaXMgYmFyIGNoYXJ0IGNvbXBhcmVzIHRoZSBlc3RpbWF0ZWQgd29ya29yZGVyIHRpbWUgPGJyPmNvbXBsZXRpb24gdGltZSB3aXRoXFxuJyArXG4gICAgJyAgICAgICAgdGhlIHJlYWwgY29tcGxldGlvbiB0aW1lLlxcbicgK1xuICAgICcgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICA8L21kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICA8L21kLWNhcmQ+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInJlcXVpcmUoJy4vYXJlYS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9jaGFydC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9waWUudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3BpZS50cGwuaHRtbCcsXG4gICAgJzxkaXYgZmxleD5cXG4nICtcbiAgICAnICA8bWQtY2FyZD5cXG4nICtcbiAgICAnICAgIDxkaXYgaWQ9XCJwaWUtY2hhcnRcIj48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1jYXJkLWNvbnRlbnQ+XFxuJyArXG4gICAgJyAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+V29ya29yZGVycyBieSBhc3NpZ25lZTwvaDI+XFxuJyArXG4gICAgJyAgICAgIDxwPlxcbicgK1xuICAgICcgICAgICAgIFRoaXMgcGllIGNoYXJ0IHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiB3b3Jrb3JkZXJzIGFzc2lnbmVkIHRvIGVhY2ggd29ya2VyLlxcbicgK1xuICAgICcgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICA8L21kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICA8L21kLWNhcmQ+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlJyk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG52YXIgYzMgPSByZXF1aXJlKCdjMycpXG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYW5hbHl0aWNzUGllY2hhcnQnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IsICR3aW5kb3csICR0aW1lb3V0KSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvcGllLnRwbC5odG1sJyksXG4gICAgc2NvcGU6IHtcbiAgICAgIHdvcmtlcnM6ICc9JyxcbiAgICAgIHdvcmtvcmRlcnM6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgdmFyIHdvcmtlck1hcCA9IHt9O1xuICAgICAgJHNjb3BlLndvcmtlcnMuZm9yRWFjaChmdW5jdGlvbih3b3JrZXIpIHtcbiAgICAgICAgd29ya2VyTWFwW3dvcmtlci5pZF0gPSB3b3JrZXI7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHdvcmtvcmRlckNvdW50cyA9IHt9O1xuICAgICAgJHNjb3BlLndvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgd29ya29yZGVyQ291bnRzW3dvcmtvcmRlci5hc3NpZ25lZV0gPSB3b3Jrb3JkZXJDb3VudHNbd29ya29yZGVyLmFzc2lnbmVlXSB8fCAwO1xuICAgICAgICB3b3Jrb3JkZXJDb3VudHNbd29ya29yZGVyLmFzc2lnbmVlXSsrO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2x1bW5zID0gW107XG4gICAgICBfLmZvckluKHdvcmtvcmRlckNvdW50cywgZnVuY3Rpb24oY291bnQsIHdvcmtlcmlkKSB7XG4gICAgICAgIHZhciB3b3JrZXIgPSB3b3JrZXJNYXBbd29ya2VyaWRdO1xuICAgICAgICB2YXIgbmFtZSA9IHdvcmtlciA/IHdvcmtlci5uYW1lIDogJ1VuYXNzaWduZWQnO1xuICAgICAgICB2YXIgY29sdW1uID0gW25hbWUsIGNvdW50XTtcbiAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICB9KTtcblxuXG4gICAgICB2YXIgcGllQ2hhcnQgPSBjMy5nZW5lcmF0ZSh7XG4gICAgICAgIGJpbmR0bzogJyNwaWUtY2hhcnQnLFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgd2lkdGg6IDQ1MFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICAgICAgdHlwZSA6ICdwaWUnLFxuICAgICAgICAgICAgb25jbGljazogZnVuY3Rpb24gKGQsIGkpIHsgY29uc29sZS5sb2coXCJvbmNsaWNrXCIsIGQsIGkpOyB9LFxuICAgICAgICAgICAgb25tb3VzZW92ZXI6IGZ1bmN0aW9uIChkLCBpKSB7IGNvbnNvbGUubG9nKFwib25tb3VzZW92ZXJcIiwgZCwgaSk7IH0sXG4gICAgICAgICAgICBvbm1vdXNlb3V0OiBmdW5jdGlvbiAoZCwgaSkgeyBjb25zb2xlLmxvZyhcIm9ubW91c2VvdXRcIiwgZCwgaSk7IH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9fSlcbiAgLmRpcmVjdGl2ZSgnYW5hbHl0aWNzQmFyY2hhcnQnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IsICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvY2hhcnQudHBsLmh0bWwnKSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICAgIC8vYWRkIGZha2UgZGF0YSBmb3IgYmFyIGNoYXJ0c1xuICAgICAgICB2YXIgY29sdW1uRXN0aW1hdGVkID0gW1wiZXN0aW1hdGVkXCJdO1xuICAgICAgICB2YXIgY29sdW1uUmVhbCA9IFtcInJlYWxcIl07XG4gICAgICAgIHZhciB4QXhpcyA9IFtdO1xuICAgICAgICAkc2NvcGUud29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHZhciBlc3RpbWF0ZWQgID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICAgICAgICB2YXIgcmVhbCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxNSk7XG4gICAgICAgICAgeEF4aXMucHVzaChcIiNcIiArIHdvcmtvcmRlci5pZCArIFwiOlwiICsgd29ya29yZGVyLnRpdGxlKTtcbiAgICAgICAgICBjb2x1bW5Fc3RpbWF0ZWQucHVzaChlc3RpbWF0ZWQpO1xuICAgICAgICAgIGNvbHVtblJlYWwucHVzaChyZWFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGJhckNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xuICAgICAgICAgIGJpbmR0bzogJyNiYXItY2hhcnQnLFxuICAgICAgICAgIHNpemU6IHtcbiAgICAgICAgICAgIHdpZHRoOiA0NTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgY29sdW1uRXN0aW1hdGVkLFxuICAgICAgICAgICAgICBjb2x1bW5SZWFsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdHlwZTogJ2JhcidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF4aXM6IHtcbiAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxuICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiB4QXhpc1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICAgYmFyOiB7XG4gICAgICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgICByYXRpbzogLjhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICB9LFxuICAgICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfX0pXG4gIC5kaXJlY3RpdmUoJ2FuYWx5dGljc0FyZWFjaGFydCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvciwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcmVhLnRwbC5odG1sJyksXG4gICAgICBzY29wZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgICAvL2FkZCBmYWtlIGRhdGEgZm9yIGJhciBjaGFydHNcbiAgICAgICAgdmFyIGNvbHVtbkVzdGltYXRlZCA9IFtcImVzdGltYXRlZFwiXTtcbiAgICAgICAgdmFyIGNvbHVtblJlYWwgPSBbXCJyZWFsXCJdO1xuICAgICAgICB2YXIgeEF4aXMgPSBbXTtcbiAgICAgICAgJHNjb3BlLndvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgICB2YXIgZXN0aW1hdGVkICA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxNSk7XG4gICAgICAgICAgdmFyIHJlYWwgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgICAgICAgIHhBeGlzLnB1c2goXCIjXCIgKyB3b3Jrb3JkZXIuaWQgKyBcIjpcIiArIHdvcmtvcmRlci50aXRsZSk7XG4gICAgICAgICAgY29sdW1uRXN0aW1hdGVkLnB1c2goZXN0aW1hdGVkKTtcbiAgICAgICAgICBjb2x1bW5SZWFsLnB1c2gocmVhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhcmVhQ2hhcnQgPSBjMy5nZW5lcmF0ZSh7XG4gICAgICAgICAgICBiaW5kdG86ICcjYXJlYS1jaGFydCcsXG4gICAgICAgICAgICBzaXplOiB7XG4gICAgICAgICAgICAgIHdpZHRoOiA0NTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICBjb2x1bW5Fc3RpbWF0ZWQsXG4gICAgICAgICAgICAgICAgY29sdW1uUmVhbFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgdHlwZXM6IHtcbiAgICAgICAgICAgICAgZXN0aW1hdGVkOiAnYXJlYScsXG4gICAgICAgICAgICAgIHJlYWw6ICdhcmVhLXNwbGluZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9fSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtZGF0ZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbnVtYmVyXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cImlucHV0RGF0ZVwiIGNsYXNzPVwiXCI+e3tmaWVsZC5wcm9wcy5uYW1lfX08L2xhYmVsPlxcbicgK1xuICAgICcgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiXFxuJyArXG4gICAgJyAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgIG5hbWU9XCJpbnB1dERhdGVcIlxcbicgK1xuICAgICcgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmRhdGVcIlxcbicgK1xuICAgICcgICAgbmctY2hhbmdlPVwiY3RybC51cGRhdGVNb2RlbCgpXCJcXG4nICtcbiAgICAnICAgIG1pbj1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX1cIlxcbicgK1xuICAgICcgICAgbWF4PVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fVwiXFxuJyArXG4gICAgJyAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgID48L2lucHV0PlxcbicgK1xuICAgICcgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibnVtYmVyXCI+WW91IGRpZCBub3QgZW50ZXIgYSB2YWxpZCBkYXRhZTwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1pblwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGFyZ2VyIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fS48L2Rpdj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWRhdGV0aW1lLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8cCBjbGFzcz1cIm1kLWNhcHRpb25cIj57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnPGRpdiBsYXlvdXQ9XCJyb3dcIj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGZsZXggY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0RGF0ZVwiIGNsYXNzPVwiXCI+RGF0ZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cImRhdGVcIlxcbicgK1xuICAgICcgICAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgICAgbmFtZT1cImlucHV0RGF0ZVwiXFxuJyArXG4gICAgJyAgICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5kYXRlXCJcXG4nICtcbiAgICAnICAgICAgbmctY2hhbmdlPVwiY3RybC51cGRhdGVNb2RlbCgpXCJcXG4nICtcbiAgICAnICAgICAgbWluPVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fVwiXFxuJyArXG4gICAgJyAgICAgIG1heD1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX1cIlxcbicgK1xuICAgICcgICAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJudW1iZXJcIj5Zb3UgZGlkIG5vdCBlbnRlciBhIHZhbGlkIGRhdGU8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWluXCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsYXJnZXIgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19LjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBmbGV4IGNsYXNzPVwibWQtYmxvY2tcIiBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1udW1iZXJcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dFRpbWVcIiBjbGFzcz1cIlwiPlRpbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0aW1lXCJcXG4nICtcbiAgICAnICAgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICAgIG5hbWU9XCJpbnB1dFRpbWVcIlxcbicgK1xuICAgICcgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudGltZVwiXFxuJyArXG4gICAgJyAgICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cIm51bWJlclwiPllvdSBkaWQgbm90IGVudGVyIGEgdmFsaWQgdGltZTwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtYXhcIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1heH19LjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWxvY2F0aW9uLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxwIGNsYXNzPVwibWQtY2FwdGlvblwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICc8cD57e2ZpZWxkLnByb3BzLmhlbHBUZXh0fX08L3A+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBuZy1jbGljaz1cImN0cmwuc2V0TG9jYXRpb24oJGV2ZW50KVwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj5cXG4nICtcbiAgICAnICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bG9jYXRpb25fc2VhcmNoaW5nPC9tZC1pY29uPlxcbicgK1xuICAgICcgIEdldCBMb2NhdGlvblxcbicgK1xuICAgICc8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0PVwicm93XCI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1sb2NhdGlvbiBtZC1ibG9ja1wiIGZsZXg+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiXFxuJyArXG4gICAgJyAgICAgIHBsYWNlaG9sZGVyPVwiTGF0aXR1ZGVcIlxcbicgK1xuICAgICcgICAgICBuYW1lPVwiaW5wdXROYW1lWFwiXFxuJyArXG4gICAgJyAgICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC52YWx1ZS5sYXRcIlxcbicgK1xuICAgICcgICAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZVguJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZVguJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGxhdGl0dWRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbG9jYXRpb24gbWQtYmxvY2tcIiBmbGV4PlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIlxcbicgK1xuICAgICcgICAgICBwbGFjZWhvbGRlcj1cIkxvbmdpdHVkZVwiXFxuJyArXG4gICAgJyAgICAgIG5hbWU9XCJpbnB1dE5hbWVZXCJcXG4nICtcbiAgICAnICAgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlLmxvbmdcIlxcbicgK1xuICAgICcgICAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lWS4kZXJyb3JcIiBuZy1zaG93PVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lWS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gbG9uZ2l0dWRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1udW1iZXIudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbnVtYmVyXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cImlucHV0TmFtZVwiIGNsYXNzPVwiXCI+e3tmaWVsZC5wcm9wcy5uYW1lfX08L2xhYmVsPlxcbicgK1xuICAgICcgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCJcXG4nICtcbiAgICAnICAgIHBsYWNlaG9sZGVyPVwie3tjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0fX1cIlxcbicgK1xuICAgICcgICAgbmFtZT1cImlucHV0TmFtZVwiXFxuJyArXG4gICAgJyAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudmFsdWVcIlxcbicgK1xuICAgICcgICAgbWluPVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fVwiXFxuJyArXG4gICAgJyAgICBtYXg9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1heH19XCJcXG4nICtcbiAgICAnICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1tZXNzYWdlcz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZXJyb3JcIiBuZy1zaG93PVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRkaXJ0eSB8fCAkcGFyZW50LmZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJudW1iZXJcIj5Zb3UgZGlkIG5vdCBlbnRlciBhIHZhbGlkIG51bWJlcjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1pblwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGFyZ2VyIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fS48L2Rpdj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLXBob3RvLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJjdHJsLmNhcHR1cmUoJGV2ZW50KVwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwudmFsdWUgPyBcXCdSZXBsYWNlXFwnIDogXFwnVGFrZSBhXFwnfX0gcGhvdG88L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8YnI+XFxuJyArXG4gICAgJyAgPGltZyBjbGFzcz1cXCdhcHBmb3JtLXBob3RvXFwnIG5nLWlmPVwiZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmxvY2FsVVJJfX1cIiBhbHQ9XCJwaG90b1wiPjwvaW1nPlxcbicgK1xuICAgICcgIDxpbWcgY2xhc3M9XFwnYXBwZm9ybS1waG90b1xcJyBuZy1pZj1cImN0cmwubW9kZWwudmFsdWVcIiBuZy1zcmM9XCJ7e2N0cmwubW9kZWwudmFsdWV9fVwiIGFsdD1cInBob3RvXCI+PC9pbWc+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC10aW1lLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1udW1iZXJcIj5cXG4nICtcbiAgICAnICA8bGFiZWwgZm9yPVwiaW5wdXRUaW1lXCIgY2xhc3M9XCJcIj57e2ZpZWxkLnByb3BzLm5hbWV9fTwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0aW1lXCJcXG4nICtcbiAgICAnICAgIHBsYWNlaG9sZGVyPVwie3tjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0fX1cIlxcbicgK1xuICAgICcgICAgbmFtZT1cImlucHV0VGltZVwiXFxuJyArXG4gICAgJyAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudGltZVwiXFxuJyArXG4gICAgJyAgICBuZy1jaGFuZ2U9XCJjdHJsLnVwZGF0ZU1vZGVsKClcIlxcbicgK1xuICAgICcgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm51bWJlclwiPllvdSBkaWQgbm90IGVudGVyIGEgdmFsaWQgdGltZTwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1pblwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGFyZ2VyIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fS48L2Rpdj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxuZy1mb3JtIG5hbWU9XCJmaWVsZEZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLnN1Ym1pdCgpXCI+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1zd2l0Y2g9XCJjdHJsLmZpZWxkLnByb3BzLnR5cGVcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwibnVtYmVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxhcHBmb3JtLWZpZWxkLW51bWJlciBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtbnVtYmVyPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cImRhdGVUaW1lXCIgbmctc3dpdGNoPVwiY3RybC5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kYXRldGltZVVuaXRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cImRhdGVcIj5cXG4nICtcbiAgICAnICAgICAgICA8YXBwZm9ybS1maWVsZC1kYXRlIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC1kYXRlPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJkYXRldGltZVwiPlxcbicgK1xuICAgICcgICAgICAgICA8YXBwZm9ybS1maWVsZC1kYXRldGltZSBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtZGF0ZXRpbWU+XFxuJyArXG4gICAgJyAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJ0aW1lXCI+XFxuJyArXG4gICAgJyAgICAgICAgIDxhcHBmb3JtLWZpZWxkLXRpbWUgbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLXRpbWU+XFxuJyArXG4gICAgJyAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctc3dpdGNoLWRlZmF1bHQ+XFxuJyArXG4gICAgJyAgICAgICAgIHt7Y3RybC5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kYXRldGltZVVuaXR9fVxcbicgK1xuICAgICcgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwibG9jYXRpb25cIj5cXG4nICtcbiAgICAnICAgICAgPGFwcGZvcm0tZmllbGQtbG9jYXRpb24gbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLWxvY2F0aW9uPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cInNpZ25hdHVyZVwiIGZsZXggY2xhc3M9XCJhcHBmb3JtLXNpZ25hdHVyZVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgICAgICA8cCBjbGFzcz1cIm1kLWNhcHRpb25cIj57e2N0cmwuZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgIDxzaWduYXR1cmUtZm9ybSB2YWx1ZT1cImN0cmwubW9kZWwudmFsdWVcIj48L3NpZ25hdHVyZS1mb3JtPlxcbicgK1xuICAgICcgICAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJwaG90b1wiIGZsZXggY2xhc3M9XCJhcHBmb3JtLXBob3RvXCI+XFxuJyArXG4gICAgJyAgICAgIDxhcHBmb3JtLWZpZWxkLXBob3RvIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC1waG90bz5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLWRlZmF1bHQgZmxleD5cXG4nICtcbiAgICAnICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICAgICAgPGxhYmVsPnt7Y3RybC5maWVsZC5wcm9wcy5uYW1lfX08L2xhYmVsPlxcbicgK1xuICAgICcgICAgICAgIDxpbnB1dFxcbicgK1xuICAgICcgICAgICAgICAgdHlwZT1cInRleHRcIlxcbicgK1xuICAgICcgICAgICAgICAgbmFtZT1cImlucHV0TmFtZVwiXFxuJyArXG4gICAgJyAgICAgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudmFsdWVcIlxcbicgK1xuICAgICcgICAgICAgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICAgICAgICAgIG5nLWNsYXNzPVwiY3RybC5maWVsZC5wcm9wcy50eXBlXCJcXG4nICtcbiAgICAnICAgICAgICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICAgICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiZmllbGRGb3JtLmlucHV0TmFtZS4kZXJyb3JcIiBuZy1zaG93PVwiZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCIgbmctc2hvdz1cImN0cmwuZmllbGQucHJvcHMuaGVscFRleHRcIj57e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fTwvZGl2PlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIiBuZy1oaWRlPVwiY3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dFwiPkEge3tjdHJsLmZpZWxkLnByb3BzLm5hbWV9fSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbmctZm9ybT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tc3VibWlzc2lvbi50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLXN1YmhlYWRlcj57e2N0cmwuZm9ybS5wcm9wcy5uYW1lfX08L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1saXN0IGNsYXNzPVwiYXBwZm9ybS12aWV3XCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gbmctaWY9XCIhIGN0cmwuZmllbGRzXCIgY2xhc3M9XCJsb2FkaW5nXCI+XFxuJyArXG4gICAgJyAgICBMb2FkaW5nIGFwcEZvcm0gc3VibWlzc2lvbi4uLlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8ZGl2IG5nLXJlcGVhdD1cImZpZWxkIGluIGN0cmwuZmllbGRzXCI+XFxuJyArXG4gICAgJyAgICA8bmctc3dpdGNoIG9uPVwiZmllbGQucHJvcHMudHlwZVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwic2lnbmF0dXJlXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSB3aXRoLWltYWdlXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Z2VzdHVyZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPHNpZ25hdHVyZSBuZy1pZj1cImZpZWxkLnZhbHVlLmxvY2FsVVJJXCIgdmFsdWU9XCJmaWVsZC52YWx1ZS5sb2NhbFVSSVwiIGFsdD1cIlNpZ25hdHVyZVwiPjwvc2lnbmF0dXJlPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxzaWduYXR1cmUgbmctaWY9XCIhZmllbGQudmFsdWUubG9jYWxVUklcIiB2YWx1ZT1cImZpZWxkLnZhbHVlLmltZ0hlYWRlciArIGZpZWxkLnZhbHVlLmRhdGFcIiBhbHQ9XCJTaWduYXR1cmVcIj48L3NpZ25hdHVyZT5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHA+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwibG9jYXRpb25cIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMy1saW5lXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cGxhY2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPnt7ZmllbGQudmFsdWUubGF0fX1OLCB7e2ZpZWxkLnZhbHVlLmxvbmd9fVc8L2gzPlxcbicgK1xuICAgICcgICAgICAgICAgICA8cD57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJudW1iZXJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+ZmlsdGVyXzQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPnt7ZmllbGQudmFsdWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxwPnt7ZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cInBob3RvXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSB3aXRoLWltYWdlXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2FtZXJhPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgICA8aW1nIG5nLWlmPVwiZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmxvY2FsVVJJfX1cIiBhbHQ9XCJwaG90b1wiPjwvaW1nPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxpbWcgbmctaWY9XCIhZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmltZ0hlYWRlciArIGZpZWxkLnZhbHVlLmRhdGF9fVwiIGFsdD1cInBob3RvXCI+PC9pbWc+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0PlxcbicgK1xuICAgICcgICAgICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj50ZXh0X2Zvcm1hdDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDM+e3tmaWVsZC52YWx1ZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHA+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L25nLXN3aXRjaD5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwiYXBwLWZvcm1cIiBsYXlvdXQtcGFkZGluZyA+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya29yZGVyRm9ybVwiIG5vdmFsaWRhdGU+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1yZXBlYXQ9XCJmaWVsZCBpbiBjdHJsLmZpZWxkc1wiPlxcbicgK1xuICAgICcgICAgPGFwcGZvcm0tZmllbGQgZmllbGQ9XCJmaWVsZFwiIG1vZGVsPVwiY3RybC5tb2RlbFtmaWVsZC5wcm9wcy5maWVsZENvZGUgfHwgZmllbGQucHJvcHMuX2lkXVwiPjwvYXBwZm9ybS1maWVsZD5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIndvcmtmbG93LWFjdGlvbnMgbWQtcGFkZGluZyBtZC13aGl0ZWZyYW1lLXo0XCI+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeSBtZC1odWUtMVwiIG5nLWNsaWNrPVwiY3RybC5iYWNrKCRldmVudClcIj5CYWNrPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBuZy1jbGljaz1cImN0cmwuZG9uZSgkZXZlbnQsIHdvcmtvcmRlckZvcm0uJHZhbGlkKVwiIGNsYXNzPVwibWQtcHJpbWFyeVwiPkNvbnRpbnVlPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgPC9kaXY+PCEtLSB3b3JrZmxvdy1hY3Rpb25zLS0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Rpdj48IS0tIGFwcC1mb3JtIC0tPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtZGF0ZXRpbWUudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC1sb2NhdGlvbi50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLXBob3RvLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtdGltZS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tc3VibWlzc2lvbi50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLnRwbC5odG1sLmpzJyk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmFwcGZvcm0nO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0nLCBbXG4gICd3Zm0uY29yZS5tZWRpYXRvcidcbiwgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuXSlcblxuLnJ1bihmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXF1aXJlKCcuLi9hcHBmb3JtLW1lZGlhdG9yJykobWVkaWF0b3IpO1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXG4gICd3Zm0uY29yZS5tZWRpYXRvcicsXG4gIHJlcXVpcmUoJy4vc2VydmljZScpLFxuICByZXF1aXJlKCdmaC13Zm0tc2lnbmF0dXJlJylcbl0pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcyc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLnJ1bihmdW5jdGlvbihhcHBmb3JtQ2xpZW50KSB7XG4gIGFwcGZvcm1DbGllbnQuaW5pdCgpO1xufSlcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtU3VibWlzc2lvbicsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkcSwgYXBwZm9ybUNsaWVudCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1zdWJtaXNzaW9uLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgc3VibWlzc2lvbkxvY2FsSWQ6ICc9c3VibWlzc2lvbkxvY2FsSWQnXG4gICAgLCBzdWJtaXNzaW9uSWQ6ICc9c3VibWlzc2lvbklkJ1xuICAgICwgc3VibWlzc2lvbjogJz1zdWJtaXNzaW9uJ1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBzdWJtaXNzaW9uUHJvbWlzZTtcbiAgICAgIGlmICgkc2NvcGUuc3VibWlzc2lvbikge1xuICAgICAgICBzdWJtaXNzaW9uUHJvbWlzZSA9ICRxLndoZW4oJHNjb3BlLnN1Ym1pc3Npb24pO1xuICAgICAgfSBlbHNlIGlmICgkc2NvcGUuc3VibWlzc2lvbklkKSB7XG4gICAgICAgIHN1Ym1pc3Npb25Qcm9taXNlID0gYXBwZm9ybUNsaWVudC5nZXRTdWJtaXNzaW9uKCRzY29wZS5zdWJtaXNzaW9uSWQpO1xuICAgICAgfSBlbHNlIGlmICgkc2NvcGUuc3VibWlzc2lvbkxvY2FsSWQpIHtcbiAgICAgICAgc3VibWlzc2lvblByb21pc2UgPSBhcHBmb3JtQ2xpZW50LmdldFN1Ym1pc3Npb25Mb2NhbCgkc2NvcGUuc3VibWlzc2lvbkxvY2FsSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignYXBwZm9ybVN1Ym1pc3Npb24gY2FsbGVkIHdpdGggbm8gc3VibWlzc2lvbicpO1xuICAgICAgfVxuICAgICAgc3VibWlzc2lvblByb21pc2UudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICAgIHZhciBmb3JtUHJvbWlzZSA9IHN1Ym1pc3Npb24uZm9ybSA/ICRxLndoZW4oc3VibWlzc2lvbi5mb3JtKSA6IGFwcGZvcm1DbGllbnQuZ2V0Rm9ybShzdWJtaXNzaW9uLnByb3BzLmZvcm1JZCk7XG4gICAgICAgIHJldHVybiBmb3JtUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGZvcm0pIHtcbiAgICAgICAgICBzZWxmLmZvcm0gPSBmb3JtO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gYXBwZm9ybUNsaWVudC5nZXRGaWVsZHMoc3VibWlzc2lvbik7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZmllbGRzKSB7XG4gICAgICAgIHNlbGYuZmllbGRzID0gZmllbGRzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgJHEsIG1lZGlhdG9yLCBhcHBmb3JtQ2xpZW50KSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZm9ybTogJz0nLFxuICAgICAgZm9ybUlkOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZm9ybTtcbiAgICB2YXIgZm9ybVByb21pc2UgPSAkc2NvcGUuZm9ybSA/ICRxLndoZW4oJHNjb3BlLmZvcm0pIDogYXBwZm9ybUNsaWVudC5nZXRGb3JtKCRzY29wZS5mb3JtSWQpO1xuICAgIGZvcm1Qcm9taXNlLnRoZW4oZnVuY3Rpb24oX2Zvcm0pIHtcbiAgICAgIGZvcm0gPSBfZm9ybTtcbiAgICAgIHNlbGYuZmllbGRzID0gZm9ybS5maWVsZHM7XG4gICAgICBzZWxmLm1vZGVsID0ge307XG4gICAgICBfLmZvckVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgIHNlbGYubW9kZWxbZmllbGQucHJvcHMuZmllbGRDb2RlIHx8IGZpZWxkLnByb3BzLl9pZF0gPSB7fTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgc2VsZi5iYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmJhY2snKTtcbiAgICB9XG4gICAgc2VsZi5kb25lID0gZnVuY3Rpb24oZXZlbnQsIGlzVmFsaWQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAkc2NvcGUuJGJyb2FkY2FzdCgncGFyZW50Rm9ybVN1Ym1pdHRlZCcpO1xuICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkJywgZXZlbnQpXG4gICAgICAgIHZhciBmaXJzdEludmFsaWQgPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdpbnB1dC5uZy1pbnZhbGlkJyk7XG4gICAgICAgIC8vIGlmIHdlIGZpbmQgb25lLCBzZXQgZm9jdXNcbiAgICAgICAgaWYgKGZpcnN0SW52YWxpZCkge1xuICAgICAgICAgIGZpcnN0SW52YWxpZC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc3VibWlzc2lvbkZpZWxkcyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc2VsZi5tb2RlbFtmaWVsZC5wcm9wcy5maWVsZENvZGUgfHwgZmllbGQucHJvcHMuX2lkXS52YWx1ZTtcbiAgICAgICAgICBzdWJtaXNzaW9uRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgZmllbGRJZDogZmllbGQucHJvcHMuX2lkLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIGFwcGZvcm1DbGllbnQuY3JlYXRlU3VibWlzc2lvbihmb3JtLCBzdWJtaXNzaW9uRmllbGRzKVxuICAgICAgICAudGhlbihhcHBmb3JtQ2xpZW50LnN1Ym1pdFN1Ym1pc3Npb24pXG4gICAgICAgIC50aGVuKGFwcGZvcm1DbGllbnQuY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25SZXN1bHQpIHtcbiAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c3RlcDpkb25lJywgc3VibWlzc2lvblJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignc3VibWlzc2lvbkZpZWxkcycsIHN1Ym1pc3Npb25GaWVsZHMpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybUZpZWxkJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGZpZWxkOiAnPScsXG4gICAgICBtb2RlbDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIHZhciBwYXJlbnRGb3JtID0gZWxlbWVudC5wYXJlbnQoKTtcbiAgICAgIHdoaWxlIChwYXJlbnRGb3JtICYmIHBhcmVudEZvcm0ucHJvcCgndGFnTmFtZScpICE9PSAnRk9STScpIHtcbiAgICAgICAgcGFyZW50Rm9ybSA9IHBhcmVudEZvcm0ucGFyZW50KCk7XG4gICAgICB9O1xuICAgICAgaWYgKHBhcmVudEZvcm0pIHtcbiAgICAgICAgdmFyIGZvcm1Db250cm9sbGVyID0gZWxlbWVudC5maW5kKCduZy1mb3JtJykuY29udHJvbGxlcignZm9ybScpO1xuICAgICAgICBzY29wZS4kb24oJ3BhcmVudEZvcm1TdWJtaXR0ZWQnLGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY3RybC5zdWJtaXQoZWxlbWVudCk7XG4gICAgICAgICAgZm9ybUNvbnRyb2xsZXIuJHNldFN1Ym1pdHRlZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgIHNlbGYubW9kZWwgPSB7fTtcbiAgICBpZiAoJHNjb3BlLm1vZGVsICYmICRzY29wZS5tb2RlbC52YWx1ZSkge1xuICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUubW9kZWwpO1xuICAgIH0gZWxzZSBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgc2VsZi5tb2RlbC52YWx1ZSA9IHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlO1xuICAgIH07XG4gICAgc2VsZi5zdWJtaXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG5cbiAgICAgIGlmIChzZWxmLmZpZWxkLnByb3BzLnR5cGUgPT09ICdsb2NhdGlvbicpIHtcbiAgICAgICAgdmFyIGlucHV0cyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0Jyk7XG4gICAgICAgIHNlbGYubW9kZWwudmFsdWUgPSB7XG4gICAgICAgICAgbGF0OiBpbnB1dHNbMF0udmFsdWUsXG4gICAgICAgICAgbG9uZzogaW5wdXRzWzFdLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICRzY29wZS5tb2RlbC52YWx1ZSA9IHNlbGYubW9kZWwudmFsdWU7XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZExvY2F0aW9uJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1sb2NhdGlvbi50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGZpZWxkOiAnPSdcbiAgICAsIG1vZGVsOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZmllbGQgPSAkc2NvcGUuZmllbGQ7XG4gICAgc2VsZi5tb2RlbCA9ICRzY29wZS5tb2RlbCA/IGFuZ3VsYXIuY29weSgkc2NvcGUubW9kZWwpIDoge307XG4gICAgc2VsZi5tb2RlbC52YWx1ZSA9IHNlbGYubW9kZWwudmFsdWUgfHwge307XG4gICAgc2VsZi5pc1ZhbGlkID0gZnVuY3Rpb24oZm9ybSwgZWxlbWVudCkge1xuICAgICAgY29uc29sZS5sb2coJ2Zvcm0nLCBmb3JtKTtcbiAgICAgIGNvbnNvbGUubG9nKCdlbGVtZW50JywgZWxlbWVudCk7XG4gICAgfVxuICAgIHNlbGYuc2V0TG9jYXRpb24gPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5tb2RlbC52YWx1ZS5sYXQgPSBwYXJzZUZsb2F0KHBvcy5jb29yZHMubGF0aXR1ZGUpO1xuICAgICAgICAgIHNlbGYubW9kZWwudmFsdWUubG9uZyA9IHBhcnNlRmxvYXQocG9zLmNvb3Jkcy5sb25naXR1ZGUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdwb3NpdGlvbiBzZXQnLCBzZWxmLm1vZGVsLnZhbHVlKVxuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBhbGVydCgnVW5hYmxlIHRvIGdldCBjdXJyZW50IHBvc2l0aW9uJyk7XG4gICAgICAgIHNlbGYubW9kZWwudmFsdWUubGF0ID0gLTE7XG4gICAgICAgIHNlbGYubW9kZWwudmFsdWUubG9uZyA9IC0xO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZFBob3RvJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csIG1lZGlhdG9yLCBtb2JpbGVDYW1lcmEsIGRlc2t0b3BDYW1lcmEpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtcGhvdG8udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBmaWVsZDogJz0nXG4gICAgLCBtb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7IC8vID8gYW5ndWxhci5jb3B5KCRzY29wZS5tb2RlbCkgOiB7fTtcbiAgICBzZWxmLmlzVmFsaWQgPSBmdW5jdGlvbihmb3JtLCBlbGVtZW50KSB7XG4gICAgICBjb25zb2xlLmxvZygnZm9ybScsIGZvcm0pO1xuICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQnLCBlbGVtZW50KTtcbiAgICB9XG4gICAgc2VsZi5jYXB0dXJlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoJHdpbmRvdy5jb3Jkb3ZhKSB7XG4gICAgICAgIG1vYmlsZUNhbWVyYS5jYXB0dXJlKClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oY2FwdHVyZSkge1xuICAgICAgICAgIHNlbGYubW9kZWwudmFsdWUgPSBjYXB0dXJlO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVza3RvcENhbWVyYS5jYXB0dXJlKClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YVVybCkge1xuICAgICAgICAgIHNlbGYubW9kZWwudmFsdWUgPSBkYXRhVXJsO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybUZpZWxkTnVtYmVyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gcmV0dXJuIHtcbiAgIHJlc3RyaWN0OiAnRSdcbiAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbCcpXG4gLCBzY29wZToge1xuICAgZmllbGQ6ICc9JyxcbiAgIG1vZGVsOiAnPScsXG4gfVxuICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgc2VsZi5tb2RlbCA9ICRzY29wZS5tb2RlbDtcbiAgIGlmIChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uICYmIHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKSB7XG4gICAgIHNlbGYubW9kZWwudmFsdWUgPSBwYXJzZUZsb2F0KHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKTtcbiAgIH07XG4gfVxuICwgY29udHJvbGxlckFzOiAnY3RybCdcbiB9O1xufSk7XG5cbmZ1bmN0aW9uIGdldERhdGUoZCl7XG4gIHJldHVybiAnWVlZWS1NTS1ERCcucmVwbGFjZSgnWVlZWScsIGQuZ2V0RnVsbFllYXIoKSkucmVwbGFjZSgnTU0nLCB0d29EaWdpKGQuZ2V0TW9udGgoKSsxKSkucmVwbGFjZSgnREQnLCB0d29EaWdpKGQuZ2V0RGF0ZSgpKSk7XG59O1xuXG5mdW5jdGlvbiBnZXRUaW1lKGQpe1xuICByZXR1cm4gJ0hIOm1tJy5yZXBsYWNlKCdISCcsIHR3b0RpZ2koZC5nZXRIb3VycygpKSkucmVwbGFjZSgnbW0nLCB0d29EaWdpKGQuZ2V0TWludXRlcygpKSk7XG59O1xuXG5mdW5jdGlvbiB0d29EaWdpKG51bSl7XG4gIGlmIChudW0gPCAxMCl7XG4gICAgcmV0dXJuICcwJyArIG51bS50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudW0udG9TdHJpbmcoKTtcbiAgfVxufVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZERhdGV0aW1lJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gcmV0dXJuIHtcbiAgIHJlc3RyaWN0OiAnRSdcbiAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWRhdGV0aW1lLnRwbC5odG1sJylcbiAsIHNjb3BlOiB7XG4gICBmaWVsZDogJz0nLFxuICAgbW9kZWw6ICc9JyxcbiB9XG4gLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuZmllbGQgPSAkc2NvcGUuZmllbGQ7XG4gICBzZWxmLm1vZGVsID0gJHNjb3BlLm1vZGVsO1xuICAgaWYgKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24gJiYgc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpIHtcbiAgICAgc2VsZi5tb2RlbC52YWx1ZSA9IG5ldyBEYXRlKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKTtcbiAgIH07XG4gICBzZWxmLnVwZGF0ZU1vZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBkYXRlID0gbmV3IERhdGUoc2VsZi5tb2RlbC5kYXRlKTtcbiAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnRpbWUpO1xuICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBnZXREYXRlKGRhdGUpICsgJyAnICsgZ2V0VGltZSh0aW1lKTtcbiAgIH1cbiB9XG4gLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGREYXRlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gcmV0dXJuIHtcbiAgIHJlc3RyaWN0OiAnRSdcbiAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWRhdGUudHBsLmh0bWwnKVxuICwgc2NvcGU6IHtcbiAgIGZpZWxkOiAnPScsXG4gICBtb2RlbDogJz0nLFxuIH1cbiAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7XG4gICBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICBzZWxmLm1vZGVsLnZhbHVlID0gbmV3IERhdGUoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpO1xuICAgfTtcbiAgIHNlbGYudXBkYXRlTW9kZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLmRhdGUpO1xuICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBnZXREYXRlKGRhdGUpO1xuICAgfVxuIH1cbiAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZFRpbWUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgJHdpbmRvdywgJGRvY3VtZW50LCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiByZXR1cm4ge1xuICAgcmVzdHJpY3Q6ICdFJ1xuICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtdGltZS50cGwuaHRtbCcpXG4gLCBzY29wZToge1xuICAgZmllbGQ6ICc9JyxcbiAgIG1vZGVsOiAnPScsXG4gfVxuICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgc2VsZi5tb2RlbCA9ICRzY29wZS5tb2RlbDtcbiAgIGlmIChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uICYmIHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKSB7XG4gICAgIHNlbGYubW9kZWwudmFsdWUgPSBuZXcgRGF0ZShzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSk7XG4gICB9O1xuICAgc2VsZi51cGRhdGVNb2RlbCA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwudGltZSk7XG4gICAgICRzY29wZS5tb2RlbC52YWx1ZSA9IGdldFRpbWUodGltZSk7XG4gICB9XG4gfVxuICwgY29udHJvbGxlckFzOiAnY3RybCdcbiB9O1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNsaWVudCA9IHJlcXVpcmUoJy4uL2FwcGZvcm0nKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uYXBwZm9ybS5zZXJ2aWNlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLnNlcnZpY2UnLCBbXSlcblxuLnNlcnZpY2UoJ2FwcGZvcm1DbGllbnQnLCBmdW5jdGlvbigkcSkge1xuICB2YXIgc2VydmljZSA9IHt9O1xuXG4gIHZhciBtZXRob2RzID0gW1xuICAgICdpbml0JyxcbiAgICAnbGlzdCcsXG4gICAgJ2dldEZvcm0nLFxuICAgICdnZXRTdWJtaXNzaW9uTG9jYWwnLFxuICAgICdnZXRTdWJtaXNzaW9uJyxcbiAgICAnZ2V0U3VibWlzc2lvbnMnLFxuICAgICdnZXRGaWVsZHMnLFxuICAgICdjcmVhdGVTdWJtaXNzaW9uJyxcbiAgICAnc3VibWl0U3VibWlzc2lvbicsXG4gICAgJ3VwbG9hZFN1Ym1pc3Npb24nLFxuICAgICdjb21wb3NlU3VibWlzc2lvblJlc3VsdCcsXG4gICAgJ3N5bmNTdGVwUmVzdWx0JyxcbiAgICAnd2F0Y2hTdWJtaXNzaW9uTW9kZWwnXG4gIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHNlcnZpY2VbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRxLndoZW4oY2xpZW50W21ldGhvZF0uYXBwbHkoY2xpZW50LCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gc2VydmljZTtcbn0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjbGllbnQgPSByZXF1aXJlKCcuL2FwcGZvcm0nKVxuXG5mdW5jdGlvbiB3cmFwcGVyKG1lZGlhdG9yKSB7XG4gIHZhciBpbml0UHJvbWlzZSA9IGNsaWVudC5pbml0KCk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIGluaXRQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOmluaXQnKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTppbml0JywgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ2luaXQnLCBmdW5jdGlvbigpIHtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCdwcm9taXNlOmluaXQnLCBpbml0UHJvbWlzZSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06Zm9ybTpsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgY2xpZW50Lmxpc3QoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZvcm1zKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOmZvcm06bGlzdCcsIGZvcm1zKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpmb3JtOmxpc3QnLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06Zm9ybTpyZWFkJywgZnVuY3Rpb24oZm9ybUlkKSB7XG4gICAgY2xpZW50LmdldEZvcm0oZm9ybUlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZvcm0pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06Zm9ybTpyZWFkOicgKyBmb3JtSWQsIGZvcm0pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOmZvcm06cmVhZDonICsgZm9ybUlkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpsb2NhbDpyZWFkJywgZnVuY3Rpb24oc3VibWlzc2lvbkxvY2FsSWQpIHtcbiAgICBjbGllbnQuZ2V0U3VibWlzc2lvbkxvY2FsKHN1Ym1pc3Npb25Mb2NhbElkKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpsb2NhbDpyZWFkOicrc3VibWlzc2lvbkxvY2FsSWQsIHN1Ym1pc3Npb24pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246bG9jYWw6cmVhZDonK3N1Ym1pc3Npb25Mb2NhbElkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpyZW1vdGU6cmVhZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgIGNsaWVudC5nZXRTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZClcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246cmVtb3RlOnJlYWQ6JytzdWJtaXNzaW9uSWQsIHN1Ym1pc3Npb24pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246cmVtb3RlOnJlYWQ6JytzdWJtaXNzaW9uSWQsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmxpc3Q6cmVtb3RlOnJlYWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uSWRzLCBpZCkge1xuICAgIGNsaWVudC5nZXRTdWJtaXNzaW9ucyhzdWJtaXNzaW9uSWRzKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25zKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246bGlzdDpyZW1vdGU6cmVhZDonK2lkLCBzdWJtaXNzaW9ucyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjpsaXN0OnJlbW90ZTpyZWFkOicraWQsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3QnLCBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgY2xpZW50LmdldEZpZWxkcyhzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZpZWxkcykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3Q6JytzdWJtaXNzaW9uLmdldExvY2FsSWQoKSwgZmllbGRzKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3Q6JytzdWJtaXNzaW9uLmdldExvY2FsSWQoKSwgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246Y3JlYXRlJywgZnVuY3Rpb24oZm9ybSwgc3VibWlzc2lvbkZpZWxkcywgdHMpIHtcbiAgICBjbGllbnQuY3JlYXRlU3VibWlzc2lvbihmb3JtLCBzdWJtaXNzaW9uRmllbGRzKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpjcmVhdGU6JyArIHRzLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOmNyZWF0ZTonICsgdHMsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnN1Ym1pdCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICBjbGllbnQuc3VibWl0U3VibWlzc2lvbihzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpzdWJtaXQ6JyArIHN1Ym1pc3Npb24uZ2V0TG9jYWxJZCgpLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOnN1Ym1pdDonICsgc3VibWlzc2lvbi5nZXRMb2NhbElkKCksIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnVwbG9hZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICBjbGllbnQudXBsb2FkU3VibWlzc2lvbihzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnVwbG9hZDonICsgc3VibWlzc2lvbi5wcm9wcy5fbHVkaWQsIHN1Ym1pc3Npb25JZCk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjp1cGxvYWQ6JyArIHN1Ym1pc3Npb24ucHJvcHMuX2x1ZGlkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNsaWVudC5hZGRTdWJtaXNzaW9uQ29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0LCBtZXRhRGF0YSkge1xuICAgIGlmIChtZXRhRGF0YSkge1xuICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICBzdWJtaXNzaW9uUmVzdWx0OiBzdWJtaXNzaW9uUmVzdWx0LFxuICAgICAgICBtZXRhRGF0YTogbWV0YURhdGFcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdtZXRhRGF0YScsIG1ldGFEYXRhKTtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246Y29tcGxldGUnLCBldmVudClcbiAgICB9XG4gIH0pXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXI7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHEgPSByZXF1aXJlKCdxJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgY2xpZW50ID0ge307XG52YXIgaW5pdFByb21pc2U7XG5cbmNsaWVudC5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIGlmIChpbml0UHJvbWlzZSkge1xuICAgIHJldHVybiBpbml0UHJvbWlzZTtcbiAgfVxuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5saXN0ZW5lcnMgPSBbXTtcbiAgaW5pdFByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICRmaC5mb3Jtcy5pbml0KGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Zvcm1zIGluaXRpYWxpemVkLicpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICAkZmguZm9ybXMub24oXCJzdWJtaXNzaW9uOnN1Ym1pdHRlZFwiLCBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgICB2YXIgc3VibWlzc2lvbiA9IHRoaXM7XG4gICAgdmFyIG1ldGFEYXRhID0gc3VibWlzc2lvbi5nZXQoJ21ldGFEYXRhJyk7XG4gICAgaWYgKHNlbGYubGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgc2VsZi5jb21wb3NlU3VibWlzc2lvblJlc3VsdChzdWJtaXNzaW9uKS50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25SZXN1bHQpIHtcbiAgICAgICAgc2VsZi5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICAgIGxpc3RlbmVyKHN1Ym1pc3Npb25SZXN1bHQsIG1ldGFEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gaW5pdFByb21pc2U7XG59O1xuXG5jbGllbnQuYWRkU3VibWlzc2lvbkNvbXBsZXRlTGlzdGVuZXIgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbn07XG5cbmNsaWVudC5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguZm9ybXMuZ2V0Rm9ybXMoZnVuY3Rpb24oZXJyb3IsIGZvcm1zTW9kZWwpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBmb3JtcyA9IGZvcm1zTW9kZWwucHJvcHMuZm9ybXM7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGZvcm1zKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuY2xpZW50LmdldEZvcm0gPSBmdW5jdGlvbihmb3JtSWQpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICRmaC5mb3Jtcy5nZXRGb3JtKHtmb3JtSWQ6IGZvcm1JZH0sIGZ1bmN0aW9uIChlcnJvciwgZm9ybSkge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmb3JtKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5jbGllbnQuZ2V0U3VibWlzc2lvbkxvY2FsID0gZnVuY3Rpb24oc3VibWlzc2lvbkxvY2FsSWQpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICRmaC5mb3Jtcy5nZXRTdWJtaXNzaW9ucyhmdW5jdGlvbihlcnJvciwgc3VibWlzc2lvbnMpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN1Ym1pc3Npb25zLmdldFN1Ym1pc3Npb25CeU1ldGEoe19sdWRpZDogc3VibWlzc2lvbkxvY2FsSWR9LCBmdW5jdGlvbihlcnJvciwgc3VibWlzc2lvbikge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5jbGllbnQuZ2V0U3VibWlzc2lvbiA9IGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgJGZoLmZvcm1zLmRvd25sb2FkU3VibWlzc2lvbih7c3VibWlzc2lvbklkOiBzdWJtaXNzaW9uSWR9LCBmdW5jdGlvbihlcnJvciwgc3VibWlzc2lvbikge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShzdWJtaXNzaW9uKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5jbGllbnQuZ2V0U3VibWlzc2lvbnMgPSBmdW5jdGlvbihzdWJtaXNzaW9uSWRzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHByb21pc2VzID0gc3VibWlzc2lvbklkcy5tYXAoZnVuY3Rpb24oc3VibWlzc2lvbklkKSB7XG4gICAgcmV0dXJuIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmdldFN1Ym1pc3Npb24oc3VibWlzc2lvbklkKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBxLmFsbFNldHRsZWQocHJvbWlzZXMpO1xufVxuXG5jbGllbnQuZ2V0RmllbGRzID0gZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgc3VibWlzc2lvbi5nZXRGb3JtKGZ1bmN0aW9uKGVycm9yLCBmb3JtKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgZmllbGRzID0gZm9ybS5maWVsZHM7XG4gICAgICB2YXIgcXMgPSBbXTtcbiAgICAgIF8uZm9yT3duKGZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgICAgICB2YXIgX2RlZmVycmVkID0gcS5kZWZlcigpO1xuICAgICAgICBxcy5wdXNoKF9kZWZlcnJlZC5wcm9taXNlKTtcbiAgICAgICAgc3VibWlzc2lvbi5nZXRJbnB1dFZhbHVlQnlGaWVsZElkKGZpZWxkLmdldEZpZWxkSWQoKSwgZnVuY3Rpb24oZXJyb3IsIGZpZWxkVmFsdWVzKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBfZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWVsZC52YWx1ZSA9IGZpZWxkVmFsdWVzWzBdO1xuICAgICAgICAgIF9kZWZlcnJlZC5yZXNvbHZlKGZpZWxkVmFsdWVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHEuYWxsKHFzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpZWxkcyk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG4vKipcbiogVGhlIGZpZWxkcyBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2Yge2ZpZWxkSWQ6IDwuLi4+LCB2YWx1ZTogPC4uLj59IG9iamVjdHNcbiovXG5jbGllbnQuY3JlYXRlU3VibWlzc2lvbiA9IGZ1bmN0aW9uKGZvcm0sIHN1Ym1pc3Npb25GaWVsZHMpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdWJtaXNzaW9uID0gZm9ybS5uZXdTdWJtaXNzaW9uKCk7XG4gICAgdmFyIGRzID0gW107XG4gICAgXy5mb3JFYWNoKHN1Ym1pc3Npb25GaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICB2YXIgZCA9IHEuZGVmZXIoKTtcbiAgICAgIGRzLnB1c2goZC5wcm9taXNlKTtcbiAgICAgIHN1Ym1pc3Npb24uYWRkSW5wdXRWYWx1ZShmaWVsZCwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHEuYWxsKGRzKVxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5jbGllbnQuc3VibWl0U3VibWlzc2lvbiA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN1Ym1pc3Npb24uc3VibWl0KGZ1bmN0aW9uKGVycm9yLCBzdWJtaXRSZXNwb25zZSkge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmNsaWVudC51cGxvYWRTdWJtaXNzaW9uID0gZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgc3VibWlzc2lvbi51cGxvYWQoZnVuY3Rpb24oZXJyb3IsIHVwbG9hZFRhc2spIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH07XG4gICAgICB1cGxvYWRUYXNrLnN1Ym1pc3Npb25Nb2RlbChmdW5jdGlvbihlcnJvciwgc3VibWlzc2lvbk1vZGVsKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbk1vZGVsKTtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmNsaWVudC5jb21wb3NlU3VibWlzc2lvblJlc3VsdCA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIHN1Ym1pc3Npb25SZXN1bHQgPSB7XG4gICAgICBzdWJtaXNzaW9uTG9jYWxJZDogc3VibWlzc2lvbi5wcm9wcy5fbHVkaWRcbiAgICAsIGZvcm1JZDogc3VibWlzc2lvbi5wcm9wcy5mb3JtSWRcbiAgICAsIHN0YXR1czogc3VibWlzc2lvbi5wcm9wcy5zdGF0dXNcbiAgfTtcbiAgaWYgKHN1Ym1pc3Npb24ucHJvcHMuX2lkKSB7XG4gICAgc3VibWlzc2lvblJlc3VsdC5zdWJtaXNzaW9uSWQgPSBzdWJtaXNzaW9uLnByb3BzLl9pZDtcbiAgfVxuICByZXR1cm4gcS53aGVuKHN1Ym1pc3Npb25SZXN1bHQpO1xufTtcblxuY2xpZW50LnN5bmNTdGVwUmVzdWx0ID0gZnVuY3Rpb24od29ya29yZGVyLCBzdGVwUmVzdWx0KSB7XG4gIC8vIGtpY2stb2ZmIGFuIGFwcGZvcm0gdXBsb2FkLCB1cGRhdGUgdGhlIHdvcmtvcmRlciB3aGVuIGNvbXBsZXRlXG4gIHZhciBzZWxmID0gdGhpcztcblxuICByZXR1cm4gaW5pdFByb21pc2VcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZWxmLmdldFN1Ym1pc3Npb25Mb2NhbChzdGVwUmVzdWx0LnN1Ym1pc3Npb24uc3VibWlzc2lvbkxvY2FsSWQpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICAgICAgc3VibWlzc2lvbi5zZXQoJ21ldGFEYXRhJywge1xuICAgICAgICB3Zm06IHtcbiAgICAgICAgICB3b3Jrb3JkZXJJZDogd29ya29yZGVyLmlkLFxuICAgICAgICAgIHN0ZXA6IHN0ZXBSZXN1bHQuc3RlcCxcbiAgICAgICAgICB0aW1lc3RhbXA6IHN0ZXBSZXN1bHQudGltZXN0YW1wXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN1Ym1pc3Npb247XG4gICAgfSlcbiAgICAudGhlbihzZWxmLnVwbG9hZFN1Ym1pc3Npb24pXG4gICAgLnRoZW4oZnVuY3Rpb24oc3VibWlzc2lvbk1vZGVsKSB7XG4gICAgICBzZWxmLndhdGNoU3VibWlzc2lvbk1vZGVsKHN1Ym1pc3Npb25Nb2RlbCk7IC8vIG5lZWQgdGhpcyB0byB0cmlnZ2V0IHRoZSBnbG9iYWwgZXZlbnRcbiAgICAgIHJldHVybiBzdWJtaXNzaW9uTW9kZWw7XG4gICAgfSk7XG59O1xuXG5jbGllbnQud2F0Y2hTdWJtaXNzaW9uTW9kZWwgPSBmdW5jdGlvbihzdWJtaXNzaW9uTW9kZWwpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBzdWJtaXNzaW9uTW9kZWwub24oJ3N1Ym1pdHRlZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgICRmaC5mb3Jtcy5kb3dubG9hZFN1Ym1pc3Npb24oe3N1Ym1pc3Npb25JZDogc3VibWlzc2lvbklkfSwgZnVuY3Rpb24oZXJyb3IsIHJlbW90ZVN1Ym1pc3Npb24pIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9O1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZW1vdGVTdWJtaXNzaW9uKTtcbiAgICB9KTtcbiAgfSk7XG4gIC8vICBUT0RPOiBEbyB3ZSBuZWVkIGEgdGltZW91dCBoZXJlIHRvIGNsZWFudXAgc3VibWlzc2lvbk1vZGVsIGxpc3RlbmVycz9cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsaWVudDtcbiIsInJlcXVpcmUoJy4vc2lnbmF0dXJlLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vc2lnbmF0dXJlLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3NpZ25hdHVyZS1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJzaWduYXR1cmUtZm9ybVwiPlxcbicgK1xuICAgICcgIDxjYW52YXMgdGFiaW5kZXg9XCIwXCI+PC9jYW52YXM+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNpZ25hdHVyZScsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxpbWcgbmctc3JjPVwie3tjdHJsLnNpZ25hdHVyZX19XCI+PC9pbWc+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjYW52YXNEcmF3ciA9IHJlcXVpcmUoJy4uL2NhbnZhcy1kcmF3cicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uc2lnbmF0dXJlJztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pXG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdzaWduYXR1cmVGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zaWduYXR1cmUtZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHZhbHVlOiAnPScsXG4gICAgICBvcHRpb25zOiAnPSdcbiAgICB9XG4gICwgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBzY29wZS5vcHRpb25zIHx8IHt9O1xuICAgICAgY29uc29sZS5sb2coJ3RvdWNoIHN1cHBvcnQnLCAnb250b3VjaHN0YXJ0JyBpbiAkZG9jdW1lbnRbMF0pO1xuICAgICAgdmFyIGRyYXdyID0gJ29udG91Y2hzdGFydCcgaW4gJGRvY3VtZW50WzBdXG4gICAgICAgID8gbmV3IGNhbnZhc0RyYXdyLkNhbnZhc0RyYXdyKGVsZW1lbnQsIG9wdGlvbnMsICRkb2N1bWVudClcbiAgICAgICAgOiBuZXcgY2FudmFzRHJhd3IuQ2FudmFzRHJhd3JNb3VzZShlbGVtZW50LCBvcHRpb25zLCAkZG9jdW1lbnQpO1xuXG4gICAgICB2YXIgJGNhbnZhcyA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXSk7XG4gICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJGNhbnZhcy5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwuc3VibWl0KGVsZW1lbnQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLnN1Ym1pdCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICAgICAgICAkc2NvcGUudmFsdWUgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3NpZ25hdHVyZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zaWduYXR1cmUudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB2YWx1ZTogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5zaWduYXR1cmUgPSAkc2NvcGUudmFsdWU7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBDYW52YXNEcmF3ck1vdXNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgdmFyIGNhbnZhcyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICBjYW52YXMud2lkdGggPSAod2luZG93LmlubmVyV2lkdGgpO1xuICBjYW52YXMuaGVpZ2h0ID0gMjAwO1xuICBjYW52YXMuc3R5bGUud2lkdGggPSAnJztcblxuICAvLyBzZXQgcHJvcHMgZnJvbSBvcHRpb25zLCBidXQgdGhlIGRlZmF1bHRzIGFyZSBmb3IgdGhlIGNvb2wga2lkc1xuICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5zaXplIHx8IDU7XG4gIGN0eC5saW5lQ2FwID0gb3B0aW9ucy5saW5lQ2FwIHx8IFwicm91bmRcIjtcbiAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJ2JsdWUnO1xuXG4gIC8vIGxhc3Qga25vd24gcG9zaXRpb25cbiAgdmFyIHBvcyA9IHsgeDogMCwgeTogMCB9O1xuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmF3KTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNldFBvc2l0aW9uKTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzdG9wKTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0Jywgc3RvcCk7XG5cbiAgLy8gbmV3IHBvc2l0aW9uIGZyb20gbW91c2UgZXZlbnRcbiAgZnVuY3Rpb24gc2V0UG9zaXRpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNhbnZhcy5mb2N1cygpO1xuICAgIHZhciByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciBvZmZzZXQgPSB7XG4gICAgICB0b3A6IHJlY3QudG9wLFxuICAgICAgbGVmdDogcmVjdC5sZWZ0XG4gICAgfTtcbiAgICBwb3MueCA9IGUuY2xpZW50WCAtIG9mZnNldC5sZWZ0O1xuICAgIHBvcy55ID0gZS5jbGllbnRZIC0gb2Zmc2V0LnRvcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vIG1vdXNlIGxlZnQgYnV0dG9uIG11c3QgYmUgcHJlc3NlZFxuICAgIGlmIChlLmJ1dHRvbnMgIT09IDEpIHJldHVybjtcblxuICAgIGN0eC5iZWdpblBhdGgoKTsgLy8gYmVnaW5cblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IG9wdGlvbnMuY29sb3I7XG5cbiAgICBjdHgubW92ZVRvKHBvcy54LCBwb3MueSk7IC8vIGZyb21cblxuICAgIHZhciByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciBvZmZzZXQgPSB7XG4gICAgICB0b3A6IHJlY3QudG9wLFxuICAgICAgbGVmdDogcmVjdC5sZWZ0XG4gICAgfTtcbiAgICBwb3MueCA9IGUuY2xpZW50WCAtIG9mZnNldC5sZWZ0O1xuICAgIHBvcy55ID0gZS5jbGllbnRZIC0gb2Zmc2V0LnRvcDtcbiAgICBjdHgubGluZVRvKHBvcy54LCBwb3MueSk7IC8vIHRvXG5cbiAgICBjdHguc3Ryb2tlKCk7IC8vIGRyYXcgaXQhXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgY2FudmFzLmJsdXIoKTtcbiAgfVxufTtcblxudmFyIENhbnZhc0RyYXdyID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucywgJGRvY3VtZW50KSB7XG4gIHZhciBjYW52YXMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBjYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgY2FudmFzLndpZHRoID0gY2FudmFzLm9mZnNldFdpZHRoO1xuICBjYW52YXMuc3R5bGUud2lkdGggPSAnJztcblxuICAvLyBzZXQgcHJvcHMgZnJvbSBvcHRpb25zLCBidXQgdGhlIGRlZmF1bHRzIGFyZSBmb3IgdGhlIGNvb2wga2lkc1xuICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5zaXplIHx8IDU7XG4gIGN0eC5saW5lQ2FwID0gb3B0aW9ucy5saW5lQ2FwIHx8ICdyb3VuZCc7XG4gIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8ICdibHVlJztcbiAgY3R4LnBYID0gdW5kZWZpbmVkO1xuICBjdHgucFkgPSB1bmRlZmluZWQ7XG5cbiAgdmFyIGxpbmVzID0gWywsXTtcbiAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgdmFyIG9mZnNldCA9IHtcbiAgICB0b3A6IHJlY3QudG9wICsgJGRvY3VtZW50WzBdLmJvZHkuc2Nyb2xsVG9wLFxuICAgIGxlZnQ6IHJlY3QubGVmdCArICRkb2N1bWVudFswXS5ib2R5LnNjcm9sbExlZnRcbiAgfTtcblxuICB2YXIgc2VsZiA9IHtcbiAgICAvL2JpbmQgY2xpY2sgZXZlbnRzXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyB1c2UgYW5ndWxlci5lbGVtZW50I29uIGZvciBhdXRvbWF0aWMgbGlzdGVuZXIgY2xlYW51cFxuICAgICAgdmFyIGNhbnZhc05nID0gYW5ndWxhci5lbGVtZW50KGNhbnZhcyk7XG4gICAgICAvL3NldCBwWCBhbmQgcFkgZnJvbSBmaXJzdCBjbGlja1xuICAgICAgY2FudmFzTmcub24oJ3RvdWNoc3RhcnQnLCBzZWxmLnByZURyYXcpO1xuICAgICAgY2FudmFzTmcub24oJ3RvdWNobW92ZScsIHNlbGYuZHJhdyk7XG4gICAgICBjYW52YXNOZy5vbigndG91Y2hlbmQnLCBzZWxmLnN0b3ApO1xuICAgICAgY2FudmFzTmcub24oJ3RvdWNoY2FuY2VsJywgc2VsZi5zdG9wKTtcbiAgICB9LFxuXG4gICAgcHJlRHJhdzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNhbnZhcy5mb2N1cygpO1xuICAgICAgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIG9mZnNldCA9IHtcbiAgICAgICAgdG9wOiByZWN0LnRvcCArICRkb2N1bWVudFswXS5ib2R5LnNjcm9sbFRvcCxcbiAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgJGRvY3VtZW50WzBdLmJvZHkuc2Nyb2xsTGVmdFxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbaV07XG4gICAgICAgIHZhciBpZCAgICAgID0gdG91Y2guaWRlbnRpZmllcjtcblxuICAgICAgICBsaW5lc1tpZF0gPSB7XG4gICAgICAgICAgeCAgICAgOiB0b3VjaC5wYWdlWCAtIG9mZnNldC5sZWZ0LFxuICAgICAgICAgIHkgICAgIDogdG91Y2gucGFnZVkgLSBvZmZzZXQudG9wLFxuICAgICAgICAgIGNvbG9yIDogb3B0aW9ucy5jb2xvclxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBkcmF3OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbaV07XG4gICAgICAgIHZhciBpZCA9IHRvdWNoLmlkZW50aWZpZXIsXG5cbiAgICAgICAgbW92ZVggPSB0b3VjaC5wYWdlWCAtIG9mZnNldC5sZWZ0IC0gbGluZXNbaWRdLngsXG4gICAgICAgIG1vdmVZID0gdG91Y2gucGFnZVkgLSBvZmZzZXQudG9wIC0gbGluZXNbaWRdLnk7XG5cbiAgICAgICAgdmFyIHJldCA9IHNlbGYubW92ZShpZCwgbW92ZVgsIG1vdmVZKTtcbiAgICAgICAgbGluZXNbaWRdLnggPSByZXQueDtcbiAgICAgICAgbGluZXNbaWRdLnkgPSByZXQueTtcbiAgICAgIH07XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uKGksIGNoYW5nZVgsIGNoYW5nZVkpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGxpbmVzW2ldLmNvbG9yO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyhsaW5lc1tpXS54LCBsaW5lc1tpXS55KTtcblxuICAgICAgY3R4LmxpbmVUbyhsaW5lc1tpXS54ICsgY2hhbmdlWCwgbGluZXNbaV0ueSArIGNoYW5nZVkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICByZXR1cm4geyB4OiBsaW5lc1tpXS54ICsgY2hhbmdlWCwgeTogbGluZXNbaV0ueSArIGNoYW5nZVkgfTtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICBjYW52YXMuYmx1cigpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2VsZi5pbml0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDYW52YXNEcmF3cjogQ2FudmFzRHJhd3IsXG4gIENhbnZhc0RyYXdyTW91c2U6IENhbnZhc0RyYXdyTW91c2Vcbn07XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uY2FtZXJhLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmNhbWVyYS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9jYW1lcmEudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1jYW1lcmFcIiBmbGV4PlxcbicgK1xuICAgICcgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJCYWNrXCIgbmctY2xpY2s9XCJjdHJsLmNhbmNlbCgpXCIgZmxleD5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hcnJvd19iYWNrPC9tZC1pY29uPlxcbicgK1xuICAgICcgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDx2aWRlbyAgbmctc2hvdz1cImN0cmwuY2FtZXJhT25cIiBhdXRvcGxheT48L3ZpZGVvPlxcbicgK1xuICAgICcgIDxjYW52YXMgbmctaGlkZT1cImN0cmwuY2FtZXJhT25cIj48L2NhbnZhcz5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwid2ZtLWNhbWVyYS1hY3Rpb25zXCIgc3R5bGU9XCJ6LWluZGV4OiAxMDAwXCI+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIG5nLXNob3c9XCJjdHJsLmNhbWVyYU9uXCIgY2xhc3M9XCJ3Zm0tY2FtZXJhLWJ0blwiIG5nLWNsaWNrPVwiY3RybC5zbmFwKClcIj48L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gbmctaGlkZT1cImN0cmwuY2FtZXJhT25cIiBjbGFzcz1cIndmbS1jYW1lcmEtY29uZmlybWF0aW9uLWJ0biBtZC13YXJuXCIgbmctY2xpY2s9XCJjdHJsLnN0YXJ0Q2FtZXJhKClcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIG5nLWhpZGU9XCJjdHJsLmNhbWVyYU9uXCIgY2xhc3M9XCJ3Zm0tY2FtZXJhLWNvbmZpcm1hdGlvbi1idG5cIiBuZy1jbGljaz1cImN0cmwuZG9uZSgpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jaGVjazwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJyZXF1aXJlKCcuL2NhbWVyYS50cGwuaHRtbC5qcycpO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5jYW1lcmEnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmNhbWVyYScsIFtcbiAgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuLCByZXF1aXJlKCcuL3NlcnZpY2UnKVxuXSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uY2FtZXJhLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnY2FtZXJhJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yLCAkd2luZG93LCAkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2NhbWVyYS50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlbDogJz0nLFxuICAgICAgYXV0b3N0YXJ0OiAnPSdcbiAgICB9LFxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LmF0dHIoJ2ZsZXgnLCB0cnVlKTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBlbGVtZW50ID0gJGVsZW1lbnRbMF0sXG4gICAgICAgICAgY2FudmFzID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF0sXG4gICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxuICAgICAgICAgIHZpZGVvID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKVswXSxcbiAgICAgICAgICBzdHJlYW0sIHdpZHRoLCBoZWlnaHQsIHpvb207XG5cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB2aWRlby5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgICAgIHNlbGYuY2FtZXJhT24gPSBmYWxzZTtcbiAgICAgICAgaWYgKCRzY29wZS5hdXRvc3RhcnQpIHtcbiAgICAgICAgICBzZWxmLnN0YXJ0Q2FtZXJhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xuXG4gICAgICBzZWxmLnNuYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN4ID0gKHZpZGVvLmNsaWVudFdpZHRoIC0gd2lkdGggKSAvIDI7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHZpZGVvLCBzeC96b29tLCAwLCB3aWR0aC96b29tLCBoZWlnaHQvem9vbSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHNlbGYuc3RvcENhbWVyYSgpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zdGFydENhbWVyYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPOiBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9nZXR1c2VybWVkaWEtanNcbiAgICAgICAgdmFyIGdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhXG4gICAgICAgIGdldFVzZXJNZWRpYS5jYWxsKG5hdmlnYXRvciwgeyAndmlkZW8nOiB0cnVlIH0sIGZ1bmN0aW9uKF9zdHJlYW0pIHtcbiAgICAgICAgICBzdHJlYW0gPSBfc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnNyYyA9ICR3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLm1vZGVsID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuY2FtZXJhT24gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHZpZGVvV2lkdGg7XG4gICAgICAgICAgICB2aWRlby5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2aWRlb1dpZHRoID0gdmlkZW8uY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWRlby5vbmNhbnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgem9vbSA9IHZpZGVvV2lkdGggLyB2aWRlby5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgdmlkZW8uc3R5bGUubGVmdCA9IC0odmlkZW8uY2xpZW50V2lkdGggLSB3aWR0aCApIC8gMiArICdweCc7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZpZGVvIGNhcHR1cmUgZXJyb3I6ICcsIGVycm9yLmNvZGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zdG9wQ2FtZXJhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICAgICAgc2VsZi5jYW1lcmFPbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBzZWxmLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnN0b3BDYW1lcmEoKTtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmNhbWVyYTpjYW5jZWwnKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5tb2RlbCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zdG9wQ2FtZXJhKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjYW1lcmEgPSByZXF1aXJlKCcuLi9jYW1lcmEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmNhbWVyYS5zZXJ2aWNlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEuc2VydmljZScsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSlcblxuLmZhY3RvcnkoJ21vYmlsZUNhbWVyYScsIGZ1bmN0aW9uKCRxLCAkd2luZG93LCBtZWRpYXRvcikge1xuICByZXR1cm4gY2FtZXJhO1xufSlcblxuLmZhY3RvcnkoJ2Rlc2t0b3BDYW1lcmEnLCBmdW5jdGlvbigkbWREaWFsb2csIG1lZGlhdG9yKSB7XG4gIHZhciBjYW1lcmEgPSB7fTtcbiAgY2FtZXJhLmNhcHR1cmUgPSBmdW5jdGlvbihldikge1xuICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyh7XG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBDYW1lcmFDdHJsKCRzY29wZSwgbWVkaWF0b3IpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IG51bGw7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghIF8uaXNFbXB0eSgkc2NvcGUuZGF0YSkgKSB7XG4gICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgkc2NvcGUuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06Y2FtZXJhOmNhbmNlbCcsICRzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgnUGhvdG8gY2FwdHVyZSBjYW5jZWxsZWQuJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiAnPGNhbWVyYSBtb2RlbD1cImRhdGFcIiBhdXRvc3RhcnQ9XCJ0cnVlXCI+PC9jYW1lcmE+JyxcbiAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxuICAgICAgY2xpY2tPdXRzaWRlVG9DbG9zZTogZmFsc2UsXG4gICAgICBmdWxsc2NyZWVuOiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGNhbWVyYTtcbn0pXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbmZ1bmN0aW9uIENhbWVyYSgpIHtcbiAgdGhpcy5pbml0KCk7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGlmICh3aW5kb3cuY29yZG92YSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiBjYW1lcmFSZWFkeSgpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9O1xuXG4gIHNlbGYuaW5pdFByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xuICByZXR1cm4gc2VsZi5pbml0UHJvbWlzZTtcbn07XG5cbkNhbWVyYS5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cubmF2aWdhdG9yLmNhbWVyYS5jbGVhbnVwKCk7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLmNhcHR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBzZWxmLmluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgd2luZG93Lm5hdmlnYXRvci5jYW1lcmEuZ2V0UGljdHVyZShmdW5jdGlvbiBjYXB0dXJlU3VjY2VzcyhmaWxlVVJJKSB7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBmaWxlVVJJLnN1YnN0cihmaWxlVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgIGZpbGVVUkk6IGZpbGVVUklcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIGNhcHR1cmVGYWlsdXJlKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgIH0sIHtcbiAgICAgIHF1YWxpdHk6IDEwMCxcbiAgICAgIGRlc3RpbmF0aW9uVHlwZTogd2luZG93Lm5hdmlnYXRvci5jYW1lcmEuRGVzdGluYXRpb25UeXBlLkZJTEVfVVJJLFxuICAgICAgZW5jb2RpbmdUeXBlOiB3aW5kb3cuQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGNhbWVyYTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5maWxlLmRpcmVjdGl2ZXMnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmZpbGUuZGlyZWN0aXZlcycsIFtdKVxuXG4uZGlyZWN0aXZlKCd3Zm1JbWcnLCBmdW5jdGlvbigkcSkge1xuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICRmaC5vbignZmhpbml0JywgZnVuY3Rpb24oZXJyb3IsIGhvc3QpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBjbG91ZFVybCA9ICRmaC5nZXRDbG91ZFVSTCgpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShjbG91ZFVybCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICB2YXIgaW5pdFByb21pc2UgPSBpbml0KCk7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB7XG4gICAgICB1aWQ6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goJ3VpZCcsIGZ1bmN0aW9uKHVpZCkge1xuICAgICAgICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNsb3VkVXJsKSB7XG4gICAgICAgICAgZWxlbWVudFswXS5zcmMgPSBjbG91ZFVybCArIGNvbmZpZy5hcGlQYXRoICsgJy9nZXQvJyArIHVpZDtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50WzBdLnNyYyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjbGllbnQgPSByZXF1aXJlKCcuLi9maWxlJyksXG4gICAgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyksXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uZmlsZS5zZXJ2aWNlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5maWxlLnNlcnZpY2UnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbl0pXG5cbi5mYWN0b3J5KCdmaWxlQ2xpZW50JywgZnVuY3Rpb24oJHEpIHtcbiAgdmFyIGZpbGVDbGllbnQgPSB7fTtcblxuICBfLmZvck93bihjbGllbnQsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZmlsZUNsaWVudFtrZXldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkcS53aGVuKGNsaWVudFtrZXldLmFwcGx5KGNsaWVudCwgYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVDbGllbnRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZpbGVDbGllbnQ7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ1xuLCBhcGlQYXRoOiAnL2ZpbGUvd2ZtJ1xufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIHEgPSByZXF1aXJlKCdxJyk7XG5cbnZhciBjbGllbnQgPSB7fTtcblxuY2xpZW50LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkRmhpbml0ID0gcS5kZWZlcigpO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZEZoaW5pdC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsaWVudC5jbG91ZFVybCA9ICRmaC5nZXRDbG91ZFVSTCgpO1xuICAgIGRlZmVycmVkRmhpbml0LnJlc29sdmUoKTtcbiAgfSk7XG5cbiAgdmFyIGRlZmVycmVkUmVhZHkgPSBxLmRlZmVyKCk7XG4gIGlmICh3aW5kb3cuY29yZG92YSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiBjYW1lcmFSZWFkeSgpIHtcbiAgICAgIGRlZmVycmVkUmVhZHkucmVzb2x2ZSgpO1xuICAgIH0sIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBkZWZlcnJlZFJlYWR5LnJlc29sdmUoKTtcbiAgfTtcblxuICBjbGllbnQuaW5pdFByb21pc2UgPSBxLmFsbChbZGVmZXJyZWRGaGluaXQucHJvbWlzZSwgZGVmZXJyZWRSZWFkeS5wcm9taXNlXSlcbiAgcmV0dXJuIGNsaWVudC5pbml0UHJvbWlzZTtcbn07XG5cbmNsaWVudC51cGxvYWREYXRhVXJsID0gZnVuY3Rpb24odXNlcklkLCBkYXRhVXJsKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgZGVmZXJyZWQucmVqZWN0KCdCb3RoIHVzZXJJZCBhbmQgYSBkYXRhVXJsIHBhcmFtZXRlcnMgYXJlIHJlcXVpcmVkLicpO1xuICB9IGVsc2Uge1xuICAgICRmaC5jbG91ZCh7XG4gICAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvb3duZXIvJyt1c2VySWQrJy91cGxvYWQvYmFzZTY0L3Bob3RvLnBuZycsXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgIGRhdGE6IGRhdGFVcmxcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlcykge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24obWVzc2FnZSwgcHJvcHMpIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgZS5wcm9wcyA9IHByb3BzO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5jbGllbnQubGlzdCA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgdXJsID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/IGNvbmZpZy5hcGlQYXRoICsgJy9hbGwnXG4gICAgOiBjb25maWcuYXBpUGF0aCArICcvb3duZXIvJyArIHVzZXJJZDtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQoe1xuICAgICAgcGF0aDogdXJsLFxuICAgICAgbWV0aG9kOiAnZ2V0J1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVzKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gICAgfSxcbiAgICBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICBlLnByb3BzID0gcHJvcHM7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgfVxuICApO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmZ1bmN0aW9uIGZpbGVVcGxvYWQoZmlsZVVSSSwgc2VydmVyVVJJLCBmaWxlVXBsb2FkT3B0aW9ucykge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciB0cmFuc2ZlciA9IG5ldyBGaWxlVHJhbnNmZXIoKTtcbiAgdHJhbnNmZXIudXBsb2FkKGZpbGVVUkksIHNlcnZlclVSSSwgZnVuY3Rpb24gdXBsb2FkU3VjY2VzcyhyZXNwb25zZSkge1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICB9LCBmdW5jdGlvbiB1cGxvYWRGYWlsdXJlKGVycm9yKSB7XG4gICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgfSwgZmlsZVVwbG9hZE9wdGlvbnMpO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmZ1bmN0aW9uIGZpbGVVcGxvYWRSZXRyeShmaWxlVVJJLCBzZXJ2ZXJVUkksIGZpbGVVcGxvYWRPcHRpb25zLCB0aW1lb3V0LCByZXRyaWVzKSB7XG4gIHJldHVybiBmaWxlVXBsb2FkKGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMpXG4gIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgaWYgKHJldHJpZXMgPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgdXBsb2FkIHRvIFwiICsgSlNPTi5zdHJpbmdpZnkoc2VydmVyVVJJKSk7XG4gICAgfTtcbiAgICByZXR1cm4gcS5kZWxheSh0aW1lb3V0KVxuICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmaWxlVXBsb2FkUmV0cnkoZmlsZVVSSSwgc2VydmVyVVJJLCBmaWxlVXBsb2FkT3B0aW9ucywgdGltZW91dCwgcmV0cmllcyAtIDEpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmNsaWVudC51cGxvYWRGaWxlID0gZnVuY3Rpb24odXNlcklkLCBmaWxlVVJJLCBvcHRpb25zKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBxLnJlamVjdCgndXNlcklkIGFuZCBmaWxlVVJJIHBhcmFtZXRlcnMgYXJlIHJlcXVpcmVkLicpO1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBmaWxlVXBsb2FkT3B0aW9ucyA9IG5ldyBGaWxlVXBsb2FkT3B0aW9ucygpO1xuICAgIGZpbGVVcGxvYWRPcHRpb25zLmZpbGVLZXkgPSBvcHRpb25zLmZpbGVLZXkgfHwgJ2JpbmFyeWZpbGUnO1xuICAgIGZpbGVVcGxvYWRPcHRpb25zLmZpbGVOYW1lID0gb3B0aW9ucy5maWxlTmFtZTtcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5taW1lVHlwZSA9IG9wdGlvbnMubWltZVR5cGUgfHwgJ2ltYWdlL2pwZWcnO1xuICAgIGZpbGVVcGxvYWRPcHRpb25zLnBhcmFtcyA9IHtcbiAgICAgIG93bmVySWQ6IHVzZXJJZCxcbiAgICAgIGZpbGVOYW1lOiBvcHRpb25zLmZpbGVOYW1lXG4gICAgfTtcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAyMDAwO1xuICAgIHZhciByZXRyaWVzID0gb3B0aW9ucy5yZXRyaWVzIHx8IDE7XG4gICAgcmV0dXJuIGNsaWVudC5pbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlcnZlclVSSSA9IHdpbmRvdy5lbmNvZGVVUkkoY2xpZW50LmNsb3VkVXJsICsgY29uZmlnLmFwaVBhdGggKyAnL3VwbG9hZC9iaW5hcnknKTtcbiAgICAgIHJldHVybiBmaWxlVXBsb2FkUmV0cnkoZmlsZVVSSSwgc2VydmVyVVJJLCBmaWxlVXBsb2FkT3B0aW9ucywgdGltZW91dCwgcmV0cmllcyk7XG4gICAgfSlcbiAgfTtcbn07XG5cbmNsaWVudC5pbml0KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xpZW50O1xuIiwicmVxdWlyZSgnLi93b3Jrb3JkZXItbWFwLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWFwLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1hcC5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXItbWFwLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxkaXYgaWQ9XFwnZ21hcF9jYW52YXNcXCc+PC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWFwLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1hcC5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3dvcmtvcmRlck1hcCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvciwgJHdpbmRvdywgJGRvY3VtZW50LCAkdGltZW91dCkge1xuICBmdW5jdGlvbiBpbml0TWFwKGVsZW1lbnQsIGNlbnRlcikge1xuICAgIHZhciBteU9wdGlvbnMgPSB7XG4gICAgICB6b29tOjE0LFxuICAgICAgY2VudGVyOm5ldyBnb29nbGUubWFwcy5MYXRMbmcoY2VudGVyWzBdLCBjZW50ZXJbMV0pLFxuICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuICAgIH07XG4gICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcjZ21hcF9jYW52YXMnKSwgbXlPcHRpb25zKTtcbiAgICByZXR1cm4gbWFwO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlc2l6ZU1hcChlbGVtZW50LCBwYXJlbnQpIHtcbiAgICB2YXIgbWFwRWxlbWVudCA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignI2dtYXBfY2FudmFzJylcbiAgICB2YXIgaGVpZ2h0ID0gcGFyZW50LmNsaWVudEhlaWdodDtcbiAgICB2YXIgd2lkdGggPSBwYXJlbnQuY2xpZW50V2lkdGg7XG4gICAgbWFwRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgIG1hcEVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cbiAgICBjb25zb2xlLmxvZygnTWFwIGRpbWVuc2lvbnM6Jywgd2lkdGgsIGhlaWdodCk7XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXBFbGVtZW50LCAncmVzaXplJyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gYWRkTWFya2VycyhtYXAsIGVsZW1lbnQsIHdvcmtvcmRlcnMpIHtcbiAgICB3b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICBpZiAod29ya29yZGVyLmxvY2F0aW9uKSB7XG4gICAgICAgIC8vIHZhciBsYXQgPSBjZW50ZXJbMF0gKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjA1O1xuICAgICAgICAvLyB2YXIgbG9uZyA9IGNlbnRlclsxXSArIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDAuMjtcbiAgICAgICAgdmFyIGxhdCA9IHdvcmtvcmRlci5sb2NhdGlvblswXTtcbiAgICAgICAgdmFyIGxvbmcgPSB3b3Jrb3JkZXIubG9jYXRpb25bMV07XG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHttYXA6IG1hcCxwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxvbmcpfSk7XG4gICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe2NvbnRlbnQ6JzxzdHJvbmc+V29ya29yZGVyICMnK3dvcmtvcmRlci5pZCsnPC9zdHJvbmc+PGJyPicrd29ya29yZGVyLmFkZHJlc3MrJzxicj4nfSk7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLG1hcmtlcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmRQYXJlbnQoZG9jdW1lbnQsIGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICB2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIHdoaWxlKHBhcmVudCkge1xuICAgICAgdmFyIGlzUGFyZW50TWF0Y2ggPSBBcnJheS5wcm90b3R5cGUuc29tZS5jYWxsKG1hdGNoZXMsIGZ1bmN0aW9uKF9tYXRjaCkge1xuICAgICAgICByZXR1cm4gcGFyZW50ID09PSBfbWF0Y2g7XG4gICAgICB9KTtcbiAgICAgIGlmIChpc1BhcmVudE1hdGNoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfTtcbiAgICAgIHZhciBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJlbnQnLCBwYXJlbnQpXG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQgfHwgZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXItbWFwLnRwbC5odG1sJyksXG4gICAgc2NvcGU6IHtcbiAgICAgIGxpc3Q6ICc9JyxcbiAgICAgIGNlbnRlcjogJz0nLFxuICAgICAgd29ya29yZGVyczogJz0nLFxuICAgICAgY29udGFpbmVyU2VsZWN0b3I6ICdAJ1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgdmFyIG1hcCA9IGluaXRNYXAoZWxlbWVudCwgc2NvcGUuY2VudGVyIHx8IFs0OS4yNywgLTEyMy4wOF0pO1xuICAgICAgYWRkTWFya2VycyhtYXAsIGVsZW1lbnQsIHNjb3BlLndvcmtvcmRlcnMpO1xuICAgICAgdmFyIHBhcmVudCA9IGZpbmRQYXJlbnQoJGRvY3VtZW50WzBdLCBlbGVtZW50WzBdLCBzY29wZS5jb250YWluZXJTZWxlY3Rvcik7XG4gICAgICB2YXIgcmVzaXplTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzaXplTWFwKGVsZW1lbnQsIHBhcmVudCk7XG4gICAgICB9XG4gICAgICAkdGltZW91dChyZXNpemVMaXN0ZW5lcik7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTsgLy8gVE9ETzogdGhyb3R0bGUgdGhpc1xuICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub2ZmKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdywgJGVsZW1lbnQpIHtcblxuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1hcCc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ubWFwJywgW1xuICByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG4sIHJlcXVpcmUoJy4vc2VydmljZScpXG5dKVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWFwLnNlcnZpY2VzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5tYXAuc2VydmljZXMnO1xuXG5uZ01vZHVsZS5mYWN0b3J5KCdtYXBDbGllbnQnLCBmdW5jdGlvbigpIHtcbiAgdmFyIG1hcENsaWVudCA9IHt9O1xuICBtYXBDbGllbnQuZ2V0Q29vcmRzID0gZnVuY3Rpb24oYWRkcmVzcykge1xuICAgIC8vIGludm9rZSB0aGUgZ29vZ2xlIEFQSSB0byByZXR1cm4gdGhlIGNvLW9yZGluYXRlcyBvZiB0aGUgZ2l2ZW4gbG9jYXRpb25cbiAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vZ2VvY29kaW5nL2ludHJvXG4gIH1cbn0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG1lZGlhdG9yID0gcmVxdWlyZSgnLi4vbWVkaWF0b3InKTtcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5jb3JlLm1lZGlhdG9yJywgWyduZyddKVxuXG4uZmFjdG9yeSgnbWVkaWF0b3InLCBmdW5jdGlvbiBtZWRpYXRvclNlcnZpY2UoJHEsICRsb2cpIHtcbiAgdmFyIG9yaWdpbmFsUmVxdWVzdCA9IG1lZGlhdG9yLnJlcXVlc3Q7XG5cbiAgLy8gbW9ua2V5IHBhdGNoIHRoZSByZXF1ZXN0IGZ1bmN0aW9uLCB3cmFwcGluZyB0aGUgcmV0dXJuZWQgcHJvbWlzZSBhcyBhbiBhbmd1bGFyIHByb21pc2VcbiAgbWVkaWF0b3IucmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9taXNlID0gb3JpZ2luYWxSZXF1ZXN0LmFwcGx5KG1lZGlhdG9yLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiAkcS53aGVuKHByb21pc2UpO1xuICB9O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlID0gZnVuY3Rpb24odG9waWMsc2NvcGUsZm4pIHtcbiAgICB2YXIgc3Vic2NyaWJlciA9IG1lZGlhdG9yLnN1YnNjcmliZSh0b3BpYyxmbik7XG4gICAgc2NvcGUuJG9uKFwiJGRlc3Ryb3lcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBtZWRpYXRvci5yZW1vdmUodG9waWMsIHN1YnNjcmliZXIuaWQpO1xuICAgIH0pO1xuXG4gIH07XG5cbiAgcmV0dXJuIG1lZGlhdG9yO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5jb3JlLm1lZGlhdG9yJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIE1lZGlhdG9yID0gcmVxdWlyZSgnbWVkaWF0b3ItanMnKS5NZWRpYXRvcjtcbnZhciBxID0gcmVxdWlyZSgncScpO1xuXG52YXIgbWVkaWF0b3IgPSBuZXcgTWVkaWF0b3IoKTtcblxubWVkaWF0b3IucHJvbWlzZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBjYiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICB9O1xuICB2YXIgYXJncyA9IFtdO1xuICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjYik7XG4gIG1lZGlhdG9yLm9uY2UuYXBwbHkobWVkaWF0b3IsIGFyZ3MpO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxubWVkaWF0b3IucmVxdWVzdCA9IGZ1bmN0aW9uKHRvcGljLCBwYXJhbWV0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciB0b3BpY3MgPSB7fSwgc3VicyA9IHt9LCBjb21wbGV0ZSA9IGZhbHNlLCB0aW1lb3V0O1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRvcGljcy5yZXF1ZXN0ID0gdG9waWM7XG4gIHRvcGljcy5kb25lID0gb3B0aW9ucy5kb25lVG9waWMgfHwgJ2RvbmU6JyArIHRvcGljO1xuICB0b3BpY3MuZXJyb3IgPSBvcHRpb25zLmVycm9yVG9waWMgfHwgJ2Vycm9yOicgKyB0b3BpYztcblxuICB2YXIgdWlkID0gbnVsbDtcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICd1aWQnKSkge1xuICAgIHVpZCA9IG9wdGlvbnMudWlkO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbWV0ZXJzICE9PSBcInVuZGVmaW5lZFwiICYmIHBhcmFtZXRlcnMgIT09IG51bGwpIHtcbiAgICB1aWQgPSBwYXJhbWV0ZXJzIGluc3RhbmNlb2YgQXJyYXkgPyBwYXJhbWV0ZXJzWzBdIDogcGFyYW1ldGVycztcbiAgfVxuXG4gIGlmICh1aWQgIT09IG51bGwpIHtcbiAgICAgdG9waWNzLmRvbmUgKz0gJzonICsgdWlkO1xuICAgICB0b3BpY3MuZXJyb3IgKz0gJzonICsgdWlkO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLnRpbWVvdXQpIHtcbiAgICBvcHRpb25zLnRpbWVvdXQgPSAyMDAwO1xuICB9O1xuXG4gIHZhciBjbGVhblVwID0gZnVuY3Rpb24oKSB7XG4gICAgY29tcGxldGUgPSB0cnVlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBtZWRpYXRvci5yZW1vdmUodG9waWNzLmRvbmUsIHN1YnMuZG9uZS5pZCk7XG4gICAgbWVkaWF0b3IucmVtb3ZlKHRvcGljcy5lcnJvciwgc3Vicy5lcnJvci5pZCk7XG4gIH07XG5cbiAgc3Vicy5kb25lID0gbWVkaWF0b3Iuc3Vic2NyaWJlKHRvcGljcy5kb25lLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICBjbGVhblVwKCk7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICB9KTtcblxuICBzdWJzLmVycm9yID0gbWVkaWF0b3Iuc3Vic2NyaWJlKHRvcGljcy5lcnJvciwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBjbGVhblVwKCk7XG4gICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgfSk7XG5cbiAgdmFyIGFyZ3MgPSBbdG9waWNzLnJlcXVlc3RdO1xuICBpZiAocGFyYW1ldGVycyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYXJncywgcGFyYW1ldGVycyk7XG4gIH0gZWxzZSB7XG4gICAgYXJncy5wdXNoKHBhcmFtZXRlcnMpO1xuICB9XG4gIG1lZGlhdG9yLnB1Ymxpc2guYXBwbHkobWVkaWF0b3IsIGFyZ3MpO1xuXG4gIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGlmICghY29tcGxldGUpIHtcbiAgICAgIGNsZWFuVXAoKTtcbiAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ01lZGlhdG9yIHJlcXVlc3QgdGltZW91dCBmb3IgdG9waWMgJyArICB0b3BpYykpO1xuICAgIH1cbiAgfSwgb3B0aW9ucy50aW1lb3V0KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVkaWF0b3I7XG4iLCJyZXF1aXJlKCcuL21lc3NhZ2UtZGV0YWlsLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL21lc3NhZ2UtZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9tZXNzYWdlLWxpc3QudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1kZXRhaWwudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXJcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cImN0cmwuY2xvc2VNZXNzYWdlKCRldmVudCwgY3RybC5tZXNzYWdlKVwiIGhpZGUtZ3Qtc20gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICB7e2N0cmwubWVzc2FnZS5zdWJqZWN0fX1cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbFwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZXNzYWdlXCIgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS1oZWFkZXJcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWJvZHktMVwiPlxcbicgK1xuICAgICcgICAgICAgIDxzcGFuPkZyb206PC9zcGFuPiB7e2N0cmwubWVzc2FnZS5zZW5kZXIubmFtZX19XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtYm9keS0xXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4+VG86PC9zcGFuPiB7e2N0cmwubWVzc2FnZS5yZWNlaXZlci5uYW1lfX1cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1ib2R5LTFcIj5cXG4nICtcbiAgICAnICAgICAgICA8c3Bhbj5TdGF0dXM6PC9zcGFuPiB7e2N0cmwubWVzc2FnZS5zdGF0dXN9fVxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPCEtLTxkaXYgY2xhc3M9XCJtZC1ib2R5LTEgdGltZS1zdGFtcFwiPjExOjM4IEFNICgzIGhvdXJzIGFnbyk8L2Rpdj4tLT5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8cCBjbGFzcz1cIm1kLWJvZHktMVwiPnt7Y3RybC5tZXNzYWdlLmNvbnRlbnR9fTwvcD5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWZvcm0udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXIgbWQtcHJpbWFyeVwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+TmV3IG1lc3NhZ2U8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3Zm0tbWFpbmNvbC1zY3JvbGxcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJtZXNzYWdlRm9ybVwiIG5nLXN1Ym1pdD1cImN0cmwuZG9uZShtZXNzYWdlRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICcgIDwhLS1cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIm1lc3NhZ2VTdGF0ZVwiPlN0YXR1czwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0bWVzc2FnZVR5cGVcIiBuYW1lPVwibWVzc2FnZVN0YXR1c1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGF0dXNcIiBkaXNhYmxlZD1cInRydWVcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAtLT5cXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1jbGFzcz1cInsgXFwnaGFzLWVycm9yXFwnIDogbWVzc2FnZUZvcm0ucmVjZWl2ZXIuJGludmFsaWQgJiYgIW1lc3NhZ2VGb3JtLnJlY2VpdmVyLiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwic2VsZWN0UmVjZWl2ZXJcIj5UbzwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5yZWNlaXZlclwiIG5hbWU9XCJyZWNlaXZlclwiIGlkPVwic2VsZWN0UmVjZWl2ZXJcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiIHZhbHVlPVwie3t3b3JrZXJ9fVwiPnt7d29ya2VyLm5hbWV9fSAoe3t3b3JrZXIucG9zaXRpb259fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwibWVzc2FnZUZvcm0ucmVjZWl2ZXIuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCBtZXNzYWdlRm9ybS5yZWNlaXZlci4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+VGhlIFRvOiBmaWVsZCBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWNsYXNzPVwieyBcXCdoYXMtZXJyb3JcXCcgOiBtZXNzYWdlRm9ybS5zdWJqZWN0LiRpbnZhbGlkICYmICFtZXNzYWdlRm9ybS5zdWJqZWN0LiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRTdWJqZWN0XCI+U3ViamVjdDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0U3ViamVjdFwiIG5hbWU9XCJzdWJqZWN0XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN1YmplY3RcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJtZXNzYWdlRm9ybS5zdWJqZWN0LiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgbWVzc2FnZUZvcm0uc3ViamVjdC4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHN1YmplY3QgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWNsYXNzPVwieyBcXCdoYXMtZXJyb3JcXCcgOiBtZXNzYWdlRm9ybS5jb250ZW50LiRpbnZhbGlkICYmICFtZXNzYWdlRm9ybS5jb250ZW50LiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRDb250ZW50XCI+TWVzc2FnZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8dGV4dGFyZWEgaWQ9XCJpbnB1dENvbnRlbnRcIiBuYW1lPVwiY29udGVudFwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5jb250ZW50XCIgcmVxdWlyZWQgbWQtbWF4bGVuZ3RoPVwiMzUwXCI+PC90ZXh0YXJlYT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwibWVzc2FnZUZvcm0uY29udGVudC4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgbWVzc2FnZUZvcm0uY29udGVudC4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5NZXNzYWdlIGNvbnRlbnQgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj5TZW5kIG1lc3NhZ2U8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWxpc3QudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+TWVzc2FnZXM8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBhY3Rpb249XCIjXCIgY2xhc3M9XCJwZXJzaXN0ZW50LXNlYXJjaFwiICBoaWRlLXhzIGhpZGUtc20+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCIgbmctbW9kZWw9XCJzZWFyY2hWYWx1ZVwiIG5nLWNoYW5nZT1cImN0cmwuYXBwbHlGaWx0ZXIoc2VhcmNoVmFsdWUpXCI+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMy1saW5lXCIgbmctcmVwZWF0PVwibWVzc2FnZSBpbiBjdHJsLmxpc3QgfCByZXZlcnNlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdE1lc3NhZ2UoJGV2ZW50LCBtZXNzYWdlKVwiIGNsYXNzPVwibWQtMy1saW5lIHdvcmtvcmRlci1pdGVtXCJcXG4nICtcbiAgICAnICAgICBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IG1lc3NhZ2UuaWQsIG5ldzogbWVzc2FnZS5zdGF0dXMgPT09IFxcJ3VucmVhZFxcJ31cIj5cXG4nICtcbiAgICAnICAgICAgPGltZyBuZy1zcmM9XCJ7e21lc3NhZ2Uuc2VuZGVyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiBhbHQ9XCJ7e21lc3NhZ2Uuc2VuZGVyLm5hbWV9fVwiIC8+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiIGxheW91dD1cImNvbHVtblwiPlxcbicgK1xuICAgICcgICAgICAgIDwhLS08c3BhbiBjbGFzcz1cIm1kLWNhcHRpb24gdGltZS1zdGFtcFwiPjEzIG1pbnMgYWdvPC9zcGFuPi0tPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e21lc3NhZ2Uuc2VuZGVyLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPGg0Pnt7bWVzc2FnZS5zdWJqZWN0fX08L2g0PlxcbicgK1xuICAgICcgICAgICAgIDxwPnt7bWVzc2FnZS5jb250ZW50fX08L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlciBtZC1pbnNldD48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICA8L21kLWxpc3Q+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdtZXNzYWdlTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgbGlzdCA6ICc9bGlzdCcsXG4gICAgICBzZWxlY3RlZE1vZGVsOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5saXN0ID0gJHNjb3BlLmxpc3Q7XG4gICAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgICAgc2VsZi5zZWxlY3RNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQsIG1lc3NhZ2UpIHtcbiAgICAgICAgc2VsZi5zZWxlY3RlZE1lc3NhZ2VJZCA9IG1lc3NhZ2UuaWQ7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOnNlbGVjdGVkJywgbWVzc2FnZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgc2VsZi5pc21lc3NhZ2VTaG93biA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc2hvd25tZXNzYWdlID09PSBtZXNzYWdlO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi5saXN0ID0gJHNjb3BlLmxpc3QuZmlsdGVyKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKG1lc3NhZ2Uuc2VuZGVyLm5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgICAgIHx8IFN0cmluZyhtZXNzYWdlLnN1YmplY3QpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ21lc3NhZ2VGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgbWVzc2FnZSA6ICc9dmFsdWUnXG4gICwgd29ya2VyczogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUubWVzc2FnZSk7XG4gICAgICBzZWxmLndvcmtlcnMgPSAkc2NvcGUud29ya2VycztcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5tb2RlbC5yZWNlaXZlciA9IEpTT04ucGFyc2Uoc2VsZi5tb2RlbC5yZWNlaXZlcik7XG4gICAgICAgIHNlbGYubW9kZWwucmVjZWl2ZXJJZCA9IHNlbGYubW9kZWwucmVjZWl2ZXIuaWQ7XG4gICAgICAgIHNlbGYubW9kZWwuc3RhdHVzID0gXCJ1bnJlYWRcIjtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnbWVzc2FnZURldGFpbCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1kZXRhaWwudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgbWVzc2FnZSA6ICc9bWVzc2FnZSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLm1lc3NhZ2UgPSAkc2NvcGUubWVzc2FnZTtcbiAgICAgIHNlbGYuc2hvd1NlbGVjdEJ1dHRvbiA9ICEhICRzY29wZS4kcGFyZW50Lm1lc3NhZ2VzO1xuICAgICAgc2VsZi5zZWxlY3RtZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQsIG1lc3NhZ2UpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOm1lc3NhZ2U6c2VsZWN0ZWQnLCBtZXNzYWdlKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmNsb3NlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50LCBtZXNzYWdlKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOmNsb3NlOicgKyBtZXNzYWdlLmlkKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5tZXNzYWdlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlJywgW1xuICByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG4sIHJlcXVpcmUoJy4vc3luYy1zZXJ2aWNlJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1lc3NhZ2Uuc3luYyc7XG5cbmZ1bmN0aW9uIHJlbW92ZUxvY2FsVmFycyhvYmplY3QpIHtcbiAgXy5rZXlzKG9iamVjdCkuZmlsdGVyKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZignXycpID09PSAwO1xuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGxvY2FsS2V5KSB7XG4gICAgZGVsZXRlIG9iamVjdFtsb2NhbEtleV07XG4gIH0pO1xuICBpZiAob2JqZWN0LnJlc3VsdHMpIHtcbiAgICBfLnZhbHVlcyhvYmplY3QucmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIF8ua2V5cyhyZXN1bHQuc3VibWlzc2lvbikuZmlsdGVyKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5LmluZGV4T2YoJ18nKSA9PT0gMDtcbiAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24obG9jYWxLZXkpIHtcbiAgICAgICAgZGVsZXRlIHJlc3VsdC5zdWJtaXNzaW9uW2xvY2FsS2V5XTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufTtcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5uZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdNZXNzYWdlJ1xuICAgICAgLCBzdGF0dXM6ICdOZXcnXG4gICAgICB9O1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShtZXNzYWdlKTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5zeW5jJywgW3JlcXVpcmUoJ2ZoLXdmbS1zeW5jJyldKVxuLmZhY3RvcnkoJ21lc3NhZ2VTeW5jJywgZnVuY3Rpb24oJHEsICR0aW1lb3V0LCBzeW5jU2VydmljZSkge1xuICBzeW5jU2VydmljZS5pbml0KCRmaCwgY29uZmlnLnN5bmNPcHRpb25zKTtcbiAgdmFyIG1lc3NhZ2VTeW5jID0ge307XG4gIG1lc3NhZ2VTeW5jLmNyZWF0ZU1hbmFnZXIgPSBmdW5jdGlvbihxdWVyeVBhcmFtcykge1xuICAgIGlmIChtZXNzYWdlU3luYy5tYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gJHEud2hlbihtZXNzYWdlU3luYy5tYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1lc3NhZ2VTeW5jLm1hbmFnZXJQcm9taXNlID0gc3luY1NlcnZpY2UubWFuYWdlKGNvbmZpZy5kYXRhc2V0SWQsIG51bGwsIHF1ZXJ5UGFyYW1zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgICAgICBtZXNzYWdlU3luYy5tYW5hZ2VyID0gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1N5bmMgaXMgbWFuYWdpbmcgZGF0YXNldDonLCBjb25maWcuZGF0YXNldElkLCAnd2l0aCBmaWx0ZXI6ICcsIHF1ZXJ5UGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgbWVzc2FnZVN5bmMucmVtb3ZlTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChtZXNzYWdlU3luYy5tYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gbWVzc2FnZVN5bmMubWFuYWdlci5zYWZlU3RvcCgpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIG1lc3NhZ2VTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWVzc2FnZVN5bmM7XG59KVxuLmZpbHRlcigncmV2ZXJzZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICByZXR1cm4gaXRlbXMuc2xpY2UoKS5yZXZlcnNlKCk7XG4gIH07XG59KTtcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9tZXNzYWdlJyxcbiAgZGF0YXNldElkIDogJ21lc3NhZ2VzJyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ucmVzdWx0JztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5yZXN1bHQnLCBbXG4gIHJlcXVpcmUoJy4vc2VydmljZScpXG5dKVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuICAsIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICA7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5yZXN1bHQuc3luYyc7XG5cbmZ1bmN0aW9uIHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcikge1xuICB2YXIgd3JhcHBlZE1hbmFnZXIgPSBfLmNyZWF0ZShtYW5hZ2VyKTtcbiAgd3JhcHBlZE1hbmFnZXIuZ2V0QnlXb3Jrb3JkZXJJZCA9IGZ1bmN0aW9uKHdvcmtvcmRlcklkKSB7XG4gICAgcmV0dXJuIHdyYXBwZWRNYW5hZ2VyLmxpc3QoKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIHJldHVybiB3cmFwcGVkTWFuYWdlci5maWx0ZXJCeVdvcmtvcmRlcihyZXN1bHRzLCB3b3Jrb3JkZXJJZCk7XG4gICAgfSk7XG4gIH07XG4gIHdyYXBwZWRNYW5hZ2VyLmZpbHRlckJ5V29ya29yZGVyID0gZnVuY3Rpb24ocmVzdWx0c0FycmF5LCB3b3Jrb3JkZXJJZCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIGZpbHRlcmVkID0gcmVzdWx0c0FycmF5LmZpbHRlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocmVzdWx0LndvcmtvcmRlcklkKSA9PT0gU3RyaW5nKHdvcmtvcmRlcklkKTtcbiAgICB9KTtcbiAgICB2YXIgcmVzdWx0ID0gIGZpbHRlcmVkICYmIGZpbHRlcmVkLmxlbmd0aCA/IGZpbHRlcmVkWzBdIDoge307XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuICB3cmFwcGVkTWFuYWdlci5leHRyYWN0QXBwZm9ybVN1Ym1pc3Npb25JZHMgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB2YXIgc3VibWlzc2lvbklkcyA9IG51bGw7XG4gICAgaWYgKCByZXN1bHQgJiYgcmVzdWx0LnN0ZXBSZXN1bHRzICYmICEgXy5pc0VtcHR5KHJlc3VsdC5zdGVwUmVzdWx0cykpIHtcbiAgICAgIHZhciBhcHBmb3JtU3RlcFJlc3VsdHMgPSBfLmZpbHRlcihyZXN1bHQuc3RlcFJlc3VsdHMsIGZ1bmN0aW9uKHN0ZXBSZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuICEhIHN0ZXBSZXN1bHQuc3RlcC5mb3JtSWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghIF8uaXNFbXB0eShhcHBmb3JtU3RlcFJlc3VsdHMpKSB7XG4gICAgICAgIHN1Ym1pc3Npb25JZHMgPSBfLm1hcChhcHBmb3JtU3RlcFJlc3VsdHMsIGZ1bmN0aW9uKHN0ZXBSZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcFJlc3VsdC5zdWJtaXNzaW9uLnN1Ym1pc3Npb25JZDtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgcmV0dXJuICEhIGlkO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gc3VibWlzc2lvbklkcztcbiAgfVxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ucmVzdWx0LnN5bmMnLCBbcmVxdWlyZSgnZmgtd2ZtLXN5bmMnKV0pXG4uZmFjdG9yeSgncmVzdWx0U3luYycsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgc3luY1NlcnZpY2UpIHtcbiAgc3luY1NlcnZpY2UuaW5pdCgkZmgsIGNvbmZpZy5zeW5jT3B0aW9ucyk7XG4gIHZhciByZXN1bHRTeW5jID0ge307XG4gIHJlc3VsdFN5bmMubWFuYWdlclByb21pc2UgPSBzeW5jU2VydmljZS5tYW5hZ2UoY29uZmlnLmRhdGFzZXRJZClcbiAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgIHJlc3VsdFN5bmMubWFuYWdlciA9IHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcik7XG4gICAgY29uc29sZS5sb2coJ1N5bmMgaXMgbWFuYWdpbmcgZGF0YXNldDonLCBjb25maWcuZGF0YXNldElkKTtcbiAgICByZXR1cm4gcmVzdWx0U3luYy5tYW5hZ2VyO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdFN5bmM7XG59KVxuXG4uZmlsdGVyKCdpc0VtcHR5JywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiAoT2JqZWN0LmtleXMob2JqZWN0KS5sZW5ndGggPT09IDApO1xuICB9O1xufSlcblxuLnJ1bihmdW5jdGlvbihtZWRpYXRvciwgcmVzdWx0U3luYykge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246Y29tcGxldGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBtZXRhRGF0YSA9IGV2ZW50Lm1ldGFEYXRhLndmbTtcbiAgICB2YXIgc3VibWlzc2lvblJlc3VsdCA9IGV2ZW50LnN1Ym1pc3Npb25SZXN1bHQ7XG4gICAgcmVzdWx0U3luYy5tYW5hZ2VyUHJvbWlzZVxuICAgIC50aGVuKGZ1bmN0aW9uKG1hbmFnZXIpIHtcbiAgICAgIHJldHVybiBtYW5hZ2VyLmdldEJ5V29ya29yZGVySWQobWV0YURhdGEud29ya29yZGVySWQpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgdmFyIHN0ZXBSZXN1bHQgPSByZXN1bHQuc3RlcFJlc3VsdHNbbWV0YURhdGEuc3RlcC5jb2RlXTtcbiAgICAgICAgc3RlcFJlc3VsdC5zdWJtaXNzaW9uID0gc3VibWlzc2lvblJlc3VsdDtcbiAgICAgICAgcmV0dXJuIG1hbmFnZXIudXBkYXRlKHJlc3VsdCk7XG4gICAgICB9KVxuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06cmVzdWx0OnJlbW90ZS11cGRhdGU6JyArIHJlc3VsdC53b3Jrb3JkZXJJZCwgcmVzdWx0KTtcbiAgICB9KVxuICB9KVxufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9yZXN1bHQnLFxuICBkYXRhc2V0SWQgOiAncmVzdWx0JyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsInJlcXVpcmUoJy4vcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50Jyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5yaXNrLWFzc2Vzc21lbnQnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3Jpc2stYXNzZXNzbWVudC1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1zaG93PVwicmlza0Fzc2Vzc21lbnRTdGVwID09PSAwXCIgbGF5b3V0LXBhZGRpbmcgY2xhc3M9XCJyaXNrLWFzc2Vzc3NtZW50XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+UmlzayBhc3Nlc3NtZW50IGNvbXBsZXRlPzwvaDI+XFxuJyArXG4gICAgJyAgICAgIDxwIGNsYXNzPVwibWQtYm9keS0xXCI+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci48L3A+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8cCBjbGFzcz1cIm1kLWJvZHktMVwiPkV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uPC9wPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJ3b3JrZmxvdy1hY3Rpb25zIG1kLXBhZGRpbmcgbWQtd2hpdGVmcmFtZS16NFwiPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeSBtZC13YXJuXCIgbmctY2xpY2s9XCJjdHJsLmFuc3dlckNvbXBsZXRlKCRldmVudCwgdHJ1ZSlcIj5ObzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeVwiIG5nLWNsaWNrPVwiY3RybC5hbnN3ZXJDb21wbGV0ZSgkZXZlbnQsIHRydWUpXCI+WWVzPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8L2Rpdj48IS0tIHdvcmtmbG93LWFjdGlvbnMtLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxkaXYgbmctaWY9XCJyaXNrQXNzZXNzbWVudFN0ZXAgPT0gMVwiIGxheW91dC1wYWRkaW5nPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxoMyBjbGFzcz1cIm1kLXRpdGxlXCI+U2lnbmF0dXJlPC9oMz5cXG4nICtcbiAgICAnICAgIDxwIGNsYXNzPVwibWQtY2FwdGlvblwiPkRyYXcgeW91ciBzaWduYXR1cmUgaW5zaWRlIHRoZSBzcXVhcmU8L3A+XFxuJyArXG4gICAgJyAgICA8c2lnbmF0dXJlLWZvcm0gdmFsdWU9XCJjdHJsLm1vZGVsLnNpZ25hdHVyZVwiPjwvc2lnbmF0dXJlLWZvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIndvcmtmbG93LWFjdGlvbnMgbWQtcGFkZGluZyBtZC13aGl0ZWZyYW1lLXo0XCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5IG1kLWh1ZS0xXCIgbmctY2xpY2s9XCJjdHJsLmJhY2soJGV2ZW50KVwiPkJhY2s8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnlcIiBuZy1jbGljaz1cImN0cmwuZG9uZSgkZXZlbnQpXCI+Q29udGludWU8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PjwhLS0gd29ya2Zsb3ctYWN0aW9ucy0tPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5yaXNrLWFzc2Vzc21lbnQnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnJpc2stYXNzZXNzbWVudCcsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJyAgPG1kLXN1YmhlYWRlcj5SaXNrIEFzc2Vzc21lbnQ8L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWxpc3QgY2xhc3M9XCJyaXNrLWFzc2Vzc21lbnRcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctaWY9XCJyaXNrQXNzZXNzbWVudC5jb21wbGV0ZVwiIGNsYXNzPVwic3VjY2Vzc1wiPmNoZWNrX2NpcmNsZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwiISByaXNrQXNzZXNzbWVudC5jb21wbGV0ZVwiIGNsYXNzPVwiZGFuZ2VyXCI+Y2FuY2VsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCJyaXNrQXNzZXNzbWVudC5jb21wbGV0ZVwiPkNvbXBsZXRlPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCIhIHJpc2tBc3Nlc3NtZW50LmNvbXBsZXRlXCI+VW5jb21wbGV0ZWQ8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlJpc2sgQXNzZXNzbWVudDwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lIHdpdGgtaW1hZ2VcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdlc3R1cmU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz48c2lnbmF0dXJlIHZhbHVlPVwicmlza0Fzc2Vzc21lbnQuc2lnbmF0dXJlXCI+PC9zaWduYXR1cmU+PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5SaXNrIEFzc2Vzc21lbnQgc2lnbmF0dXJlPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnJpc2stYXNzZXNzbWVudCcsIFsnd2ZtLmNvcmUubWVkaWF0b3InLCByZXF1aXJlKCdmaC13Zm0tc2lnbmF0dXJlJyldKVxuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgncmlza0Fzc2Vzc21lbnQnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3Jpc2stYXNzZXNzbWVudC50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHJpc2tBc3Nlc3NtZW50OiBcIj12YWx1ZVwiXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdyaXNrQXNzZXNzbWVudEZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3Jpc2stYXNzZXNzbWVudC1mb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICRzY29wZS5yaXNrQXNzZXNzbWVudFN0ZXAgPSAwXG4gICAgICBzZWxmLm1vZGVsID0ge307XG4gICAgICBzZWxmLmFuc3dlckNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQsIGFuc3dlcikge1xuICAgICAgICBzZWxmLm1vZGVsLmNvbXBsZXRlID0gYW5zd2VyO1xuICAgICAgICAkc2NvcGUucmlza0Fzc2Vzc21lbnRTdGVwKys7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfTtcbiAgICAgIHNlbGYuYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmJhY2snKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c3RlcDpkb25lJywgc2VsZi5tb2RlbCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5yaXNrLWFzc2Vzc21lbnQnO1xuIiwicmVxdWlyZSgnLi9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9zY2hlZHVsZS50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNjaGVkdWxlLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNjaGVkdWxlLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwLnRwbC5odG1sJyxcbiAgICAnPHNwYW4gY2xhc3M9XCJ3Zm0tY2hpcCB3Zm0tY2hpcC1uby1waWN0dXJlXCIgc3R5bGU9XCJ3aWR0aDozMDBweDtcIj5cXG4nICtcbiAgICAnICA8c3BhbiBjbGFzcz1cIndmbS1jaGlwLW5hbWVcIiA+e3tjdHJsLndvcmtvcmRlci50eXBlfX0gI3t7Y3RybC53b3Jrb3JkZXIuaWR9fTwvc3Bhbj5cXG4nICtcbiAgICAnPC9zcGFuPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnQ09ORklERU5USUFMXFxuJyArXG4gICAgJ0NvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICdUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cIndmbS1zY2hlZHVsZXItdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuPlNjaGVkdWxlcjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtZGF0ZXBpY2tlciBuZy1tb2RlbD1cImN0cmwuc2NoZWR1bGVEYXRlXCIgbWQtcGxhY2Vob2xkZXI9XCJFbnRlciBkYXRlXCIgbmctY2hhbmdlPVwiY3RybC5kYXRlQ2hhbmdlKClcIj48L21kLWRhdGVwaWNrZXI+XFxuJyArXG4gICAgJyAgICA8IS0tXFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiRmF2b3JpdGVcIj5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5kYXRlX3JhbmdlPC9tZC1pY29uPlxcbicgK1xuICAgICcgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0PVwicm93XCI+XFxuJyArXG4gICAgJyAgPGRpdiBmbGV4PVwiNzBcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8dGFibGUgY2xhc3M9XCJ3Zm0tc2NoZWR1bGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxjb2wgd2lkdGg9XCIzMFwiPlxcbicgK1xuICAgICcgICAgICA8Y29sIHdpZHRoPVwiNzBcIj5cXG4nICtcbiAgICAnICAgICAgPHRyPlxcbicgK1xuICAgICcgICAgICAgIDx0ZCBjbGFzcz1cIndmbS1zY2hlZHVsZXItd29ya2VyXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwid2ZtLXRvb2xiYXItc21cIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzIGNsYXNzPVwibWQtc3ViaGVhZFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIFdvcmtlcnNcXG4nICtcbiAgICAnICAgICAgICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxpbWcgYWx0PVwiTmFtZVwiIG5nLXNyYz1cInt7d29ya2VyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiAvPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxwPnt7d29ya2VyLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgICAgICA8L21kLWxpc3Q+XFxuJyArXG4gICAgJyAgICAgICAgPC90ZD5cXG4nICtcbiAgICAnICAgICAgICA8dGQgY2xhc3M9XCJ3Zm0tc2NoZWR1bGVyLWNhbGVuZGFyXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8dGFibGU+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDx0cj48dGggbmctcmVwZWF0PVwiaG91ciBpbiBbXFwnN2FtXFwnLCBcXCc4YW1cXCcsIFxcJzlhbVxcJywgXFwnMTBhbVxcJywgXFwnMTFhbVxcJywgXFwnMTJwbVxcJywgXFwnMXBtXFwnLCBcXCcycG1cXCcsIFxcJzNwbVxcJywgXFwnNHBtXFwnLCBcXCc1cG1cXCcsIFxcJzZwbVxcJywgXFwnN3BtXFwnXVwiPnt7aG91cn19PC90aD48L3RyPlxcbicgK1xuICAgICcgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDx0ZCBuZy1yZXBlYXQ9XCJob3VyIGluIFs3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV1cIiBkcm9wcGFibGU9XCJ0cnVlXCIgZGF0YS1ob3VyPVwie3tob3VyfX1cIiBkYXRhLXdvcmtlcklkPVwie3t3b3JrZXIuaWR9fVwiPjwvdGQ+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvdHI+XFxuJyArXG4gICAgJyAgICAgICAgICA8L3RhYmxlPlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBjbGFzcz1cIndmbS1zY2hlZHVsZXItc2NoZWR1bGVkXCI+PC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgPC90ZD5cXG4nICtcbiAgICAnICAgICAgPC90cj5cXG4nICtcbiAgICAnICAgIDwvdGFibGU+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxkaXYgZmxleD1cIjMwXCIgY2xhc3M9XCJ3Zm0tc2NoZWR1bGVyLXVuc2NoZWR1bGVkXCIgaWQ9XCJ3b3Jrb3JkZXJzLWxpc3RcIiBkcm9wcGFibGU9XCJ0cnVlXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid2ZtLXRvb2xiYXItc21cIj5cXG4nICtcbiAgICAnICAgICAgPGgzIGNsYXNzPVwibWQtc3ViaGVhZFwiPlxcbicgK1xuICAgICcgICAgICAgIFdvcmtvcmRlcnNcXG4nICtcbiAgICAnICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3NjaGVkdWxlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICRjb21waWxlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgZnVuY3Rpb24gZ2V0V29ya2VyUm93RWxlbWVudHMoZWxlbWVudCwgd29ya2VySWQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS13b3JrZXJJZD1cIicrd29ya2VySWQrJ1wiXScpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SG91ckVsZW1lbnQocm93RWxlbWVudHMsIGhvdXIpIHtcbiAgICB2YXIgaG91ckVsZW1lbnQgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwocm93RWxlbWVudHMsIGZ1bmN0aW9uKF9ob3VyRWxlbWVudCkge1xuICAgICAgcmV0dXJuIF9ob3VyRWxlbWVudC5kYXRhc2V0LmhvdXIgPT09IFN0cmluZyhob3VyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKGhvdXJFbGVtZW50Lmxlbmd0aCkgPyBob3VyRWxlbWVudFswXSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHBhcmVudEVsZW1lbnQsIHdvcmtvcmRlcikge1xuICAgIHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KHBhcmVudEVsZW1lbnQpO1xuICAgIHZhciBfd29ya29yZGVyID0gc2NvcGUud29ya29yZGVyO1xuICAgIHNjb3BlLndvcmtvcmRlciA9IHdvcmtvcmRlcjtcbiAgICB2YXIgY2hpcCA9IGFuZ3VsYXIuZWxlbWVudCgnPHNjaGVkdWxlLXdvcmtvcmRlci1jaGlwIHdvcmtvcmRlcj1cIndvcmtvcmRlclwiIGRyYWdnYWJsZT1cInRydWVcIj48L3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwPicpO1xuXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpKSB7XG4gICAgICB2YXIgaG91ckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50O1xuICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53Zm0tc2NoZWR1bGVyLXNjaGVkdWxlZCcpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KHBhcmVudEVsZW1lbnQpLmFwcGVuZChjaGlwKTtcbiAgICAgICRjb21waWxlKGNoaXApKHNjb3BlKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjaGlwWzBdLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICBjaGlwWzBdLnN0eWxlLmxlZnQgPSBob3VyRWxlbWVudC5vZmZzZXRMZWZ0ICsgJ3B4JztcbiAgICAgICAgY2hpcFswXS5zdHlsZS50b3AgPSBob3VyRWxlbWVudC5vZmZzZXRUb3AgKyAncHgnO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5hcHBlbmQoY2hpcCk7XG4gICAgICAkY29tcGlsZShjaGlwKShzY29wZSk7XG4gICAgfVxuICAgIGNoaXBbMF0uaWQgPSB3b3Jrb3JkZXIuaWQ7XG4gICAgY2hpcFswXS5kYXRhc2V0LndvcmtvcmRlcklkID0gd29ya29yZGVyLmlkO1xuICAgIHNjb3BlLndvcmtvcmRlciA9IF93b3Jrb3JkZXI7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJXb3Jrb3JkZXJzKHNjb3BlLCBlbGVtZW50LCB3b3Jrb3JkZXJzKSB7XG4gICAgdmFyIHdvcmtvcmRlcnNCeVdvcmtlciA9IHt9O1xuICAgIHdvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgIHdvcmtvcmRlcnNCeVdvcmtlclt3b3Jrb3JkZXIuYXNzaWduZWVdID0gd29ya29yZGVyc0J5V29ya2VyW3dvcmtvcmRlci5hc3NpZ25lZV0gfHwgW107XG4gICAgICB3b3Jrb3JkZXJzQnlXb3JrZXJbd29ya29yZGVyLmFzc2lnbmVlXS5wdXNoKHdvcmtvcmRlcik7XG4gICAgfSk7XG5cbiAgICBfLmZvckluKHdvcmtvcmRlcnNCeVdvcmtlciwgZnVuY3Rpb24od29ya29yZGVycywgd29ya2VySWQpIHtcbiAgICAgIHZhciB3b3JrZXJSb3dFbGVtZW50cyA9IGdldFdvcmtlclJvd0VsZW1lbnRzKGVsZW1lbnQsIHdvcmtlcklkKTtcbiAgICAgIHdvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgdmFyIGhvdXIgPSBuZXcgRGF0ZSh3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXApLmdldEhvdXJzKCk7XG4gICAgICAgIHZhciBob3VyRWxlbWVudCA9IGdldEhvdXJFbGVtZW50KHdvcmtlclJvd0VsZW1lbnRzLCBob3VyKTtcbiAgICAgICAgaWYgKGhvdXJFbGVtZW50KSB7XG4gICAgICAgICAgcmVuZGVyV29ya29yZGVyKHNjb3BlLCBob3VyRWxlbWVudCwgd29ya29yZGVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJVbnNjaGVkdWxlZFdvcmtvcmRlckxpc3Qoc2NvcGUsIGN0cmwsIGVsZW1lbnQpIHtcbiAgICB2YXIgdW5zY2hlZHVsZWQgPSBzY29wZS53b3Jrb3JkZXJzLmZpbHRlcihmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXIuYXNzaWduZWUgPT0gbnVsbCB8fCB3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXAgPT0gbnVsbDtcbiAgICB9KTtcbiAgICB2YXIgdW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpO1xuICAgIHVuc2NoZWR1bGVkLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHVuc2NoZWR1bGVkV29ya29yZGVyTGlzdCwgd29ya29yZGVyKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVXb3Jrb3JkZXIod29ya29yZGVyLCB3b3JrZXJJZCwgZGF0ZSwgaG91cikge1xuICAgIHdvcmtvcmRlci5hc3NpZ25lZSA9IHdvcmtlcklkO1xuICAgIGlmIChkYXRlICE9IG51bGwgJiYgaG91ciAhPT0gbnVsbCkge1xuICAgICAgZGF0ZS5zZXRIb3Vycyhob3VyKTtcbiAgICAgIGRhdGUuc2V0TWludXRlcygwKTtcbiAgICAgIGRhdGUuc2V0U2Vjb25kcygwKTtcbiAgICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICAgICAgd29ya29yZGVyLnN0YXJ0VGltZXN0YW1wID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V29ya29yZGVyKHdvcmtvcmRlcnMsIGlkKSB7XG4gICAgdmFyIGZpbHRlcmVkID0gd29ya29yZGVycy5maWx0ZXIoZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHdvcmtvcmRlci5pZCkgPT09IFN0cmluZyhpZCk7XG4gICAgfSlcbiAgICByZXR1cm4gZmlsdGVyZWQubGVuZ3RoID8gZmlsdGVyZWRbMF0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V29ya2VyKHdvcmtlcnMsIGlkKSB7XG4gICAgdmFyIGZpbHRlcmVkID0gd29ya2Vycy5maWx0ZXIoZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICByZXR1cm4gd29ya2VyLmlkID09PSBpZDtcbiAgICB9KVxuICAgIHJldHVybiBmaWx0ZXJlZC5sZW5ndGggPyBmaWx0ZXJlZFswXSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVXb3Jrb3JkZXJzKGVsZW1lbnQpIHtcbiAgICB2YXIgc2NoZWR1bGVkID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci1zY2hlZHVsZWQnKTtcbiAgICB3aGlsZShzY2hlZHVsZWQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBzY2hlZHVsZWQucmVtb3ZlQ2hpbGQoc2NoZWR1bGVkLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihzY29wZSwgY3RybCwgZWxlbWVudCkge1xuICAgIHZhciB3b3Jrb3JkZXJzT25EYXRlID0gc2NvcGUud29ya29yZGVycy5maWx0ZXIoZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUod29ya29yZGVyLnN0YXJ0VGltZXN0YW1wKS50b0RhdGVTdHJpbmcoKSA9PT0gY3RybC5zY2hlZHVsZURhdGUudG9EYXRlU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVuZGVyV29ya29yZGVycyhzY29wZSwgZWxlbWVudCwgd29ya29yZGVyc09uRGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVXb3Jrb3JkZXIod29ya29yZGVyKSB7XG4gICAgcmV0dXJuIG1lZGlhdG9yLnJlcXVlc3QoJ3dmbTpzY2hlZHVsZTp3b3Jrb3JkZXInLCB3b3Jrb3JkZXIsIHt1aWQ6IHdvcmtvcmRlci5pZH0pXG4gIH1cblxuICBmdW5jdGlvbiB3b3Jrb3JkZXJVcGRhdGVkKHNjb3BlLCBzY2hlZHVsZXJFbGVtZW50LCB3b3Jrb3JkZXIpIHtcbiAgICB2YXIgcHJldmlvdXNDaGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdvcmtvcmRlci5pZCk7XG4gICAgaWYgKHByZXZpb3VzQ2hpcEVsZW1lbnQpIHtcbiAgICAgIHByZXZpb3VzQ2hpcEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwcmV2aW91c0NoaXBFbGVtZW50KTtcbiAgICB9XG4gICAgdmFyIHBhcmVudEVsZW1lbnQ7XG4gICAgaWYgKHdvcmtvcmRlci5hc3NpZ25lZSAmJiB3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXApIHtcbiAgICAgIHZhciB3b3JrZXJSb3dFbGVtZW50cyA9IGdldFdvcmtlclJvd0VsZW1lbnRzKHNjaGVkdWxlckVsZW1lbnRbMF0sIHdvcmtvcmRlci5hc3NpZ25lZSk7XG4gICAgICB2YXIgaG91ciA9IG5ldyBEYXRlKHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCkuZ2V0SG91cnMoKTtcbiAgICAgIHBhcmVudEVsZW1lbnQgPSBnZXRIb3VyRWxlbWVudCh3b3JrZXJSb3dFbGVtZW50cywgaG91cik7XG4gICAgfVxuICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50IHx8IHNjaGVkdWxlckVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLndmbS1zY2hlZHVsZXItdW5zY2hlZHVsZWQnKTtcbiAgICByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHBhcmVudEVsZW1lbnQsIHdvcmtvcmRlcik7XG4gICAgdmFyIGluZGV4ID0gXy5maW5kSW5kZXgoc2NvcGUud29ya29yZGVycywgZnVuY3Rpb24oX3dvcmtvcmRlcikge1xuICAgICAgcmV0dXJuIF93b3Jrb3JkZXIuaWQgPT09IHdvcmtvcmRlci5pZDtcbiAgICB9KVxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBzY29wZS53b3Jrb3JkZXJzW2luZGV4XSA9IHdvcmtvcmRlcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnb3ZlcihlLCBzY29wZSkge1xuICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyYWdlbnRlcihlKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdkcmFnb3ZlcicpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyYWdsZWF2ZShlKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyb3AoZSwgc2NvcGUsIHNjaGVkdWxlckVsZW1lbnQsIHVuc2NoZWR1bGVkV29ya29yZGVyTGlzdCkge1xuICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciB3b3Jrb3JkZXIgPSBnZXRXb3Jrb3JkZXIoc2NvcGUud29ya29yZGVycywgZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnd29ya29yZGVyaWQnKSk7XG4gICAgdmFyIGRyb3BFbGVtZW50ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgIGRyb3BFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgdmFyIHNjaGVkdWxlZFdvcmtvcmRlciA9IGFuZ3VsYXIuY29weSh3b3Jrb3JkZXIpO1xuICAgIGlmIChkcm9wRWxlbWVudC5pZCA9PT0gJ3dvcmtvcmRlcnMtbGlzdCcpIHtcbiAgICAgIHNjaGVkdWxlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlciwgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB3b3JrZXJJZCA9IGRyb3BFbGVtZW50LmRhdGFzZXQud29ya2VyaWQ7XG4gICAgICB2YXIgaG91ciA9IGRyb3BFbGVtZW50LmRhdGFzZXQuaG91cjtcbiAgICAgIHNjaGVkdWxlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlciwgd29ya2VySWQsIHNjb3BlLmN0cmwuc2NoZWR1bGVEYXRlLCBob3VyKTtcbiAgICB9XG4gICAgdXBkYXRlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWQpIHtcbiAgICAgICAgd29ya29yZGVyVXBkYXRlZChzY29wZSwgc2NoZWR1bGVyRWxlbWVudCwgdXBkYXRlZClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNpemVDYWxlbmRhcihlbGVtZW50KSB7XG4gICAgdmFyIGNhbGVuZGFyID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci1jYWxlbmRhcicpO1xuICAgIGNhbGVuZGFyLnN0eWxlLnBvc2l0aW9uID0gJ2luaGVyaXQnO1xuICAgIHZhciB3aWR0aCA9ICBjYWxlbmRhci5jbGllbnRXaWR0aDtcbiAgICBjYWxlbmRhci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FsZW5kYXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3NjaGVkdWxlLnRwbC5odG1sJyksXG4gICAgc2NvcGU6IHtcbiAgICAgIHdvcmtvcmRlcnMgOiAnPScsXG4gICAgICB3b3JrZXJzOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIC8vIEdldCB0aGUgdGhyZWUgbWFqb3IgZXZlbnRzXG4gICAgICAkdGltZW91dChmdW5jdGlvbiBhZnRlckRpZ2VzdCgpIHtcbiAgICAgICAgc2l6ZUNhbGVuZGFyKGVsZW1lbnQpO1xuICAgICAgICBlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKCFldmVudC5zcmNFbGVtZW50LmdldEF0dHJpYnV0ZSB8fCBldmVudC5zcmNFbGVtZW50LmdldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJykgIT09ICd0cnVlJykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGNoaXAgPSBldmVudC5zcmNFbGVtZW50O1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd3b3Jrb3JkZXJpZCcsIGNoaXAuZGF0YXNldC53b3Jrb3JkZXJJZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZHJvcHBhYmxlcyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnW2Ryb3BwYWJsZT10cnVlXScpO1xuICAgICAgICB2YXIgdW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpO1xuXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZHJvcHBhYmxlcywgZnVuY3Rpb24oZHJvcHBhYmxlKSB7XG4gICAgICAgICAgZHJvcHBhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZHJhZ292ZXIpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnZW50ZXIpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBkcmFnbGVhdmUpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRyb3AoZSwgc2NvcGUsIGVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkdGltZW91dCwgJGVsZW1lbnQsICR3aW5kb3cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2NoZWR1bGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpemVDYWxlbmRhcigkZWxlbWVudCk7XG4gICAgICB9KVxuICAgICAgcmVuZGVyVW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0KCRzY29wZSwgc2VsZiwgJGVsZW1lbnRbMF0pO1xuICAgICAgc2VsZi5kYXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlbW92ZVdvcmtvcmRlcnMoJGVsZW1lbnRbMF0pO1xuICAgICAgICByZW5kZXIoJHNjb3BlLCBzZWxmLCAkZWxlbWVudFswXSk7XG5cbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZW5kZXIoJHNjb3BlLCBzZWxmLCAkZWxlbWVudFswXSk7XG4gICAgICB9KVxuICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnM7XG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2NoZWR1bGVXb3Jrb3JkZXJDaGlwJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICB3b3Jrb3JkZXIgOiAnPSdcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdGhpcy53b3Jrb3JkZXIgPSAkc2NvcGUud29ya29yZGVyO1xuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzeW5jID0gcmVxdWlyZSgnLi4vY2xpZW50JylcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnN5bmMuc2VydmljZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uc3luYy5zZXJ2aWNlJywgW10pXG5cbi5mYWN0b3J5KCdzeW5jU2VydmljZScsIGZ1bmN0aW9uKCRxKSB7XG4gIHZhciBzeW5jU2VydmljZSA9IHt9O1xuICB2YXIgbWFuYWdlclByb21pc2U7XG5cbiAgZnVuY3Rpb24gTWFuYWdlcldyYXBwZXIoX21hbmFnZXIpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBfbWFuYWdlcjtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgbWV0aG9kTmFtZXMgPSBbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnbGlzdCcsICdzdGFydCcsICdzdG9wJywgJ3NhZmVTdG9wJywgJ2dldFF1ZXVlU2l6ZScsICdmb3JjZVN5bmMnLCAnd2FpdEZvclN5bmMnXTtcbiAgICBtZXRob2ROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHNlbGZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRxLndoZW4oc2VsZi5tYW5hZ2VyW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYubWFuYWdlciwgYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgc3luY1NlcnZpY2UuaW5pdCA9IGZ1bmN0aW9uKCRmaCwgc3luY09wdGlvbnMpIHtcbiAgICBzeW5jLmluaXQoJGZoLCBzeW5jT3B0aW9ucyk7XG4gIH1cblxuICBzeW5jU2VydmljZS5tYW5hZ2UgPSBmdW5jdGlvbihkYXRhc2V0SWQsIG9wdGlvbnMsIHF1ZXJ5UGFyYW1zLCBtZXRhRGF0YSkge1xuICAgIHJldHVybiAkcS53aGVuKHN5bmMubWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSlcbiAgICAudGhlbihmdW5jdGlvbihfbWFuYWdlcikge1xuICAgICAgdmFyIG1hbmFnZXIgPSBuZXcgTWFuYWdlcldyYXBwZXIoX21hbmFnZXIpO1xuICAgICAgbWFuYWdlci5zdHJlYW0gPSBfbWFuYWdlci5zdHJlYW07XG4gICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gc3luY1NlcnZpY2U7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgLCBxID0gcmVxdWlyZSgncScpXG4gICwgZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbiAgLCBSeCA9IHJlcXVpcmUoJ3J4JylcbiAgO1xuXG52YXIgJGZoLCBpbml0aWFsaXplZCA9IGZhbHNlLCBub3RpZmljYXRpb25TdHJlYW0sIGxpc3RlbmVycyA9IFtdO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1EYXRhU2V0KHN5bmNEYXRhKSB7XG4gIHZhciByZXN1bHQgPSBfLnZhbHVlcyhzeW5jRGF0YSkubWFwKGZ1bmN0aW9uKHN5bmNEYXRhKSB7XG4gICAgcmV0dXJuIHN5bmNEYXRhLmRhdGE7XG4gIH0pO1xuICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmlkOyB9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoY29kZSwgbXNnKSB7XG4gIHZhciBlcnJvciA9ICdFcnJvcic7XG4gIGlmIChjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICcgJyArIGNvZGUgKyAnOiAnICsgbXNnO1xuICB9IGVsc2UgaWYgKGNvZGUgJiYgIW1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBjb2RlO1xuICB9IGVsc2UgaWYgKCFjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBtc2c7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgKz0gJzogbm8gZXJyb3IgZGV0YWlscyBhdmFpbGFibGUnXG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBpbml0KF8kZmgsIF9zeW5jT3B0aW9ucykge1xuICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICBjb25zb2xlLmxvZygnc3luYy1jbGllbnQgYWxyZWFkeSBpbml0YWxpemVkLicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdzeW5jLWNsaWVudCBpbml0YWxpemluZy4nKTtcbiAgICAkZmggPSBfJGZoO1xuICAgIG5vdGlmaWNhdGlvblN0cmVhbSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgYWRkTGlzdGVuZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChub3RpZmljYXRpb24pO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuc2hhcmUoKTtcbiAgICB2YXIgc3luY09wdGlvbnMgPSBfLmRlZmF1bHRzKF9zeW5jT3B0aW9ucywgZGVmYXVsdENvbmZpZy5zeW5jT3B0aW9ucyk7XG5cbiAgICAkZmguc3luYy5pbml0KHN5bmNPcHRpb25zKTtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgJGZoLnN5bmMubm90aWZ5KGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbCh1bmRlZmluZWQsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoJ1N5bmMgbm90IHlldCBpbml0aWFsaXplZC4gIENhbGwgc3luYy1jbGllbnQuaW5pdCgpIGZpcnN0LicpO1xuICB9IGVsc2Uge1xuICAgIC8vbWFuYWdlIHRoZSBkYXRhU2V0XG4gICAgJGZoLnN5bmMubWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtYW5hZ2VyID0gbmV3IERhdGFNYW5hZ2VyKGRhdGFzZXRJZCk7XG4gICAgICBtYW5hZ2VyLnN0cmVhbSA9IG5vdGlmaWNhdGlvblN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uZGF0YXNldF9pZCA9PSBkYXRhc2V0SWQ7XG4gICAgICB9KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShtYW5hZ2VyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xufVxuXG5mdW5jdGlvbiBEYXRhTWFuYWdlcihkYXRhc2V0SWQpIHtcbiAgdGhpcy5kYXRhc2V0SWQgPSBkYXRhc2V0SWQ7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9MaXN0KHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihyZXMpIHtcbiAgICB2YXIgb2JqZWN0cyA9IHRyYW5zZm9ybURhdGFTZXQocmVzKTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKG9iamVjdHMpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLnN5bmMuZG9DcmVhdGUoc2VsZi5kYXRhc2V0SWQsIG9iamVjdCwgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PSAnbG9jYWxfdXBkYXRlX2FwcGxpZWQnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi5tZXNzYWdlID09ICdjcmVhdGUnXG4gICAgICAgIDsgLy8gJiYgbm90aWZpY2F0aW9uLnVpZCA9PSBvYmplY3QuX2xvY2FsdWlkOyAgVE9ETzogZ2V0IHRoZSBzeW5jIGZyYW1ld29yayB0byBpbmNsdWRlIHRoZSB0ZW1wb3JhcnkgdWlkIGluIHRoZSBub3RpZmljYXRpb25cbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICBvYmplY3QuX2xvY2FsdWlkID0gbXNnLnVpZDtcbiAgICAgIHJldHVybiBzZWxmLnVwZGF0ZShvYmplY3QpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9SZWFkKHRoaXMuZGF0YXNldElkLCBpZCwgZnVuY3Rpb24ocmVzKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzLmRhdGEpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICAvLyBmYWlsdXJlXG4gICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihmb3JtYXRFcnJvcihjb2RlLCBtc2cpKSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1aWRQcm9taXNlID0gXy5oYXMob2JqZWN0LCAnaWQnKVxuICAgID8gcS53aGVuKFN0cmluZyhvYmplY3QuaWQpKVxuICAgIDogc2VsZi5yZWFkKG9iamVjdC5fbG9jYWx1aWQpLnRoZW4oZnVuY3Rpb24oX29iamVjdCkge1xuICAgICAgY29uc29sZS5sb2coJ19vYmplY3QnLCBfb2JqZWN0KVxuICAgICAgaWYgKF8uaGFzKF9vYmplY3QsICdpZCcpKSB7XG4gICAgICAgIG9iamVjdC5pZCA9IF9vYmplY3QuaWQ7XG4gICAgICAgIHJldHVybiBTdHJpbmcoX29iamVjdC5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqZWN0Ll9sb2NhbHVpZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgdWlkUHJvbWlzZS50aGVuKGZ1bmN0aW9uKHVpZCkge1xuICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZyB3aXRoIGlkJywgdWlkKVxuICAkZmguc3luYy5kb1VwZGF0ZShzZWxmLmRhdGFzZXRJZCwgdWlkLCBvYmplY3QsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vIHN1Y2Nlc3NcbiAgICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmNvZGUgPT09ICdsb2NhbF91cGRhdGVfYXBwbGllZCdcbiAgICAgICAgJiYgbm90aWZpY2F0aW9uLm1lc3NhZ2UgPT09ICd1cGRhdGUnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi51aWQgPT09IHVpZDtcbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gc2VsZi5yZWFkKHVpZCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nJywgb2JqZWN0KTtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG59KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5kb0RlbGV0ZShzZWxmLmRhdGFzZXRJZCwgb2JqZWN0LmlkLCBmdW5jdGlvbihyZXMpIHtcbiAgICAvLyBzdWNjZXNzXG4gICAgdmFyIHVpZCA9IFN0cmluZyhvYmplY3QuaWQpO1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PT0gJ2xvY2FsX3VwZGF0ZV9hcHBsaWVkJ1xuICAgICAgICAmJiBub3RpZmljYXRpb24ubWVzc2FnZSA9PT0gJ2RlbGV0ZSdcbiAgICAgICAgJiYgU3RyaW5nKG5vdGlmaWNhdGlvbi51aWQpID09PSB1aWQ7XG4gICAgfSkudGFrZSgxKS50b1Byb21pc2UocS5Qcm9taXNlKVxuICAgIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShub3RpZmljYXRpb24ubWVzc2FnZSk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5zdGFydFN5bmModGhpcy5kYXRhc2V0SWQsIGZ1bmN0aW9uKCl7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgnc3luYyBsb29wIHN0YXJ0ZWQnKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5zdG9wU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBpZiAoc2VsZi5yZWNvcmREZWx0YVJlY2VpdmVkU3Vic2NyaXB0aW9uKSB7XG4gICAgICBzZWxmLnJlY29yZERlbHRhUmVjZWl2ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgIH1cbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agc3RvcHBlZCcpO1xuICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmZvcmNlU3luYyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5zeW5jLmZvcmNlU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agd2lsbCBydW4nKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5nZXRRdWV1ZVNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5nZXRQZW5kaW5nKHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihwZW5kaW5nKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShfLnNpemUocGVuZGluZykpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zYWZlU3RvcCA9IGZ1bmN0aW9uKHVzZXJPcHRpb25zKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHRpbWVvdXQ6IDIwMDBcbiAgfVxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyh1c2VyT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICBzZWxmLmdldFF1ZXVlU2l6ZSgpXG4gIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgc2VsZi5zdG9wKCkudGhlbihkZWZlcnJlZC5yZXNvbHZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQubm90aWZ5KCdDYWxsaW5nIGZvcmNlU3luYyBzeW5jIGJlZm9yZSBzdG9wJyk7XG4gICAgICByZXR1cm4gc2VsZi5mb3JjZVN5bmMoKVxuICAgICAgLnRoZW4oc2VsZi53YWl0Rm9yU3luYy5iaW5kKHNlbGYpKVxuICAgICAgLnRpbWVvdXQob3B0aW9ucy50aW1lb3V0KVxuICAgICAgLnRoZW4oc2VsZi5nZXRRdWV1ZVNpemUuYmluZChzZWxmKSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIGZhaWxlZCwgb3V0c3RhbmRpbmcgcmVzdWx0cyBzdGlsbCBwcmVzZW50JykpO1xuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC50aGVuKHNlbGYuc3RvcC5iaW5kKHNlbGYpKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKVxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIHRpbWVvdXQnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLndhaXRGb3JTeW5jID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5jb2RlID09ICdzeW5jX2NvbXBsZXRlJyB8fCBub3RpZmljYXRpb24uY29kZSA9PSAnc3luY19mYWlsZWQnO1xuICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfY29tcGxldGUnKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfZmFpbGVkJykge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignU3luYyBGYWlsZWQnLCBub3RpZmljYXRpb24pKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLnB1Ymxpc2hSZWNvcmREZWx0YVJlY2VpdmVkID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnJlY29yZERlbHRhUmVjZWl2ZWRTdWJzY3JpcHRpb24gPSBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5jb2RlID09ICdyZWNvcmRfZGVsdGFfcmVjZWl2ZWQnXG4gIH0pLnN1YnNjcmliZShmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06c3luYzpyZWNvcmRfZGVsdGFfcmVjZWl2ZWQ6JyArIHNlbGYuZGF0YXNldElkLCBub3RpZmljYXRpb24pO1xuICB9KVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXRcbiwgbWFuYWdlOiBtYW5hZ2VcbiwgYWRkTGlzdGVuZXI6IGFkZExpc3RlbmVyXG59XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2dyb3VwLWZvcm0udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXJcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICBHcm91cCAje3tjdHJsLm1vZGVsLmlkfX1cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0R3JvdXAoJGV2ZW50LCBjdHJsLm1vZGVsKVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICc8bWQtYnV0dG9uIGNsYXNzPVwibWQtZmFiXCIgYXJpYS1sYWJlbD1cIk5ldyBncm91cFwiIHVpLXNyZWY9XCJhcHAuZ3JvdXAubmV3XCI+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmFkZDwvbWQtaWNvbj5cXG4nICtcbiAgICAnPC9tZC1idXR0b24+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsXCI+XFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJncm91cEZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUoZ3JvdXBGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImdyb3VwbmFtZVwiPkdyb3VwIE5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJncm91cG5hbWVcIiBuYW1lPVwiZ3JvdXBuYW1lXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLm5hbWVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmdyb3VwbmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IGdyb3VwRm9ybS5ncm91cG5hbWUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBuYW1lIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImFzc2lnbmVlXCI+Um9sZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5yb2xlXCIgbmFtZT1cImFzc2lnbmVlXCIgaWQ9XCJhc3NpZ25lZVwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cImFkbWluXCI+QWRtaW48L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJtYW5hZ2VyXCI+TWFuYWdlcjwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cIndvcmtlclwiPldvcmtlcjwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlkIHx8IGN0cmwubW9kZWwuaWQgPT09IDAgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSBHcm91cDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAtbGlzdC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5Hcm91cHM8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBhY3Rpb249XCIjXCIgY2xhc3M9XCJwZXJzaXN0ZW50LXNlYXJjaFwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPjwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiIG5nLW1vZGVsPVwic2VhcmNoVmFsdWVcIiBuZy1jaGFuZ2U9XCJjdHJsLmFwcGx5RmlsdGVyKHNlYXJjaFZhbHVlKVwiPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdEdyb3VwKCRldmVudCwgZ3JvdXApXCIgbmctcmVwZWF0PVwiZ3JvdXAgaW4gY3RybC5ncm91cHNcIiBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IGdyb3VwLmlkfVwiPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2dyb3VwLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5ncm91cDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3tjdHJsLmdyb3VwLmlkfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Hcm91cCBpZDwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2N0cmwuZ3JvdXAubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+R3JvdXAgbmFtZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2N0cmwuZ3JvdXAucm9sZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+Um9sZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgIE1lbWJlcnNcXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RNZW1iZXIoJGV2ZW50LCBtZW1iZXIpXCIgbmctcmVwZWF0PVwibWVtYmVyIGluIGN0cmwubWVtYmVyc1wiPlxcbicgK1xuICAgICcgICAgPGltZyBhbHQ9XCJ1c2VyLm5hbWVcIiBuZy1zcmM9XCJ7e21lbWJlci5hdmF0YXJ9fVwiIGNsYXNzPVwibWQtYXZhdGFyXCIgLz5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3ttZW1iZXIubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+e3ttZW1iZXIucG9zaXRpb259fTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwicmVxdWlyZSgnLi9ncm91cC1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2dyb3VwLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vZ3JvdXAudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtlci1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyXCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgV29ya2VyIElEIHt7Y3RybC5tb2RlbC5pZH19XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtlcigkZXZlbnQsIGN0cmwubW9kZWwpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxtZC1idXR0b24gY2xhc3M9XCJtZC1mYWJcIiBhcmlhLWxhYmVsPVwiTmV3IFdvcmtvcmRlclwiIHVpLXNyZWY9XCJhcHAud29ya2VyLm5ld1wiPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hZGQ8L21kLWljb24+XFxuJyArXG4gICAgJzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIndvcmtlckZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUod29ya2VyRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZXJuYW1lXCI+V29ya2VyIE5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ3b3JrZXJuYW1lXCIgbmFtZT1cIndvcmtlcm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwubmFtZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0ud29ya2VybmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0ud29ya2VybmFtZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIG5hbWUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwudXNlcm5hbWVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZXJGb3JtLnVzZXJuYW1lLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS51c2VybmFtZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHVzZXJuYW1lIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5CYW5uZXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJiYW5uZXJcIiBuYW1lPVwiYmFubmVyXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmJhbm5lclwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0uYmFubmVyLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5iYW5uZXIuJGRpcnR5XCI+PC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5BdmF0YXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhdmF0YXJcIiBuYW1lPVwiYXZhdGFyXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmF2YXRhclwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0uYXZhdGFyLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5hdmF0YXIuJGRpcnR5XCI+PC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwaG9uZW51bWJlclwiIG5hbWU9XCJwaG9uZW51bWJlclwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5waG9uZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0ucGhvbmVudW1iZXIuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZXJGb3JtLnBob25lbnVtYmVyLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgcGhvbmUgbnVtYmVyIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5FbWFpbDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmVtYWlsXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS5lbWFpbC4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0uZW1haWwuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gZW1haWwgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPlBvc2l0aW9uPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicG9zaXRpb25cIiBuYW1lPVwicG9zaXRpb25cIiBuZy1tb2RlbD1cImN0cmwubW9kZWwucG9zaXRpb25cIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZXJGb3JtLnBvc2l0aW9uLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5wb3NpdGlvbi4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BbiBwb3NpdGlvbiBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJhc3NpZ25lZVwiPkdyb3VwPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmdyb3VwXCIgbmFtZT1cImdyb3VwXCIgaWQ9XCJncm91cFwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJncm91cCBpbiBjdHJsLmdyb3Vwc1wiIHZhbHVlPVwie3tncm91cC5pZH19XCI+e3tncm91cC5uYW1lfX08L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj4gXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwuaWQgfHwgY3RybC5tb2RlbC5pZCA9PT0gMCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtlcjwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLWxpc3QudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+V29ya2Vyczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIiBuZy1tb2RlbD1cInNlYXJjaFZhbHVlXCIgbmctY2hhbmdlPVwiY3RybC5hcHBseUZpbHRlcihzZWFyY2hWYWx1ZSlcIj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RXb3JrZXIoJGV2ZW50LCB1c2VyKVwiICBuZy1yZXBlYXQ9XCJ1c2VyIGluIGN0cmwud29ya2Vyc1wiIG5nLWNsYXNzPVwie2FjdGl2ZTogY3RybC5zZWxlY3RlZC5pZCA9PT0gdXNlci5pZH1cIj5cXG4nICtcbiAgICAnICAgIDxpbWcgYWx0PVwidXNlci5uYW1lXCIgbmctc3JjPVwie3t1c2VyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiAvPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3VzZXIubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+e3t1c2VyLnBvc2l0aW9ufX08L3A+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC1jb250ZW50IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsIHdmbS1tYWluY29sLXNjcm9sbF93aXRoLW1lbnVcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwidXNlci1pbmZvLWhlYWRlclwiIG5nLXN0eWxlPVwiY3RybC5zdHlsZVwiPlxcbicgK1xuICAgICcgICAgPGgxIGNsYXNzPVwibWQtZGlzcGxheS0xXCI+e3tjdHJsLndvcmtlci5uYW1lfX08L2gxPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICcgIDxtZC1saXN0PlxcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBlcnNvbjwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7Y3RybC53b3JrZXIudXNlcm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+VXNlcm5hbWU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cGhvbmU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLnBob25lfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlBob25lIE51bWJlcjwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5lbWFpbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7Y3RybC53b3JrZXIuZW1haWx9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+RW1haWw8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cG9ydHJhaXQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLnBvc2l0aW9ufX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlBvc2l0aW9uPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3tjdHJsLmdyb3VwLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+R3JvdXA8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtc3ViaGVhZGVyIGNsYXNzPVwibWQtbm8tc3RpY2t5XCI+Tm90ZXM8L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnICAgIDxwIGNsYXNzPVwibWQtYm9keS0xXCIgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj57e2N0cmwud29ya2VyLm5vdGVzfX08L3A+XFxuJyArXG4gICAgJyAgPC9tZC1jb250ZW50PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udXNlci5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3dvcmtlckxpc3QnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtlci1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgd29ya2VycyA6ICc9JyxcbiAgICAgIHNlbGVjdGVkTW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYud29ya2VycyA9ICRzY29wZS53b3JrZXJzO1xuICAgICAgc2VsZi5zZWxlY3RlZCA9ICRzY29wZS5zZWxlY3RlZE1vZGVsO1xuICAgICAgc2VsZi5zZWxlY3RXb3JrZXIgPSBmdW5jdGlvbihldmVudCwgd29ya2VyKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6c2VsZWN0ZWQnLCB3b3JrZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNXb3JrZXJTaG93biA9IGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bldvcmtlciA9PT0gd29ya2VyO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya2VyLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKHdvcmtlci5uYW1lKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVybSkgIT09IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnd29ya2VyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZXIudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB3b3JrZXIgOiAnPScsXG4gICAgICBncm91cCA6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYud29ya2VyID0gJHNjb3BlLndvcmtlcjtcbiAgICAgIHNlbGYuZ3JvdXAgPSAkc2NvcGUuZ3JvdXA7XG4gICAgICB2YXIgYmFubmVyVXJsID0gc2VsZi53b3JrZXIuYmFubmVyIHx8IHNlbGYud29ya2VyLmF2YXRhcjtcbiAgICAgIHNlbGYuc3R5bGUgPSB7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnICsgYmFubmVyVXJsICsgJyknLFxuICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbic6IHNlbGYud29ya2VyLmJhbm5lciA/ICdjZW50ZXIgY2VudGVyJyA6ICd0b3AgY2VudGVyJyxcbiAgICAgICAgJ2JhY2tncm91bmQtc2l6ZSc6IHNlbGYud29ya2VyLmJhbm5lciA/ICdhdXRvJyA6ICdjb250YWluJyxcbiAgICAgICAgJ2JhY2tncm91bmQtcmVwZWF0JzogJ25vLXJlcGVhdCdcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCd3b3JrZXJGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZXItZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHdvcmtlciA6ICc9dmFsdWUnLFxuICAgICAgZ3JvdXBzIDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5ncm91cHMgPSAkc2NvcGUuZ3JvdXBzO1xuICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2VyKTtcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZXIpIHtcbiAgICAgICAgaWYod29ya2VyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIHdvcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICBpZiAoIXNlbGYubW9kZWwuaWQgJiYgc2VsZi5tb2RlbC5pZCAhPT0gMCkge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpjcmVhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6dXBkYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ2dyb3VwTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAtbGlzdC50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGdyb3VwcyA6ICc9JyxcbiAgICAgIHNlbGVjdGVkTW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuZ3JvdXBzID0gJHNjb3BlLmdyb3VwcztcbiAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgIHNlbGYuc2VsZWN0R3JvdXAgPSBmdW5jdGlvbihldmVudCwgZ3JvdXApIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmdyb3VwOnNlbGVjdGVkJywgZ3JvdXApO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNHcm91cFNob3duID0gZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc2hvd25Hcm91cCA9PT0gZ3JvdXA7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmFwcGx5RmlsdGVyID0gZnVuY3Rpb24odGVybSkge1xuICAgICAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzZWxmLmdyb3VwcyA9ICRzY29wZS5ncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhncm91cC5pZCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgICAgIHx8IFN0cmluZyhncm91cC5uYW1lKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVybSkgIT09IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnZ3JvdXAnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2dyb3VwLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZ3JvdXAgOiAnPScsXG4gICAgICBtZW1iZXJzIDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5ncm91cCA9ICRzY29wZS5ncm91cDtcbiAgICAgIHNlbGYubWVtYmVycyA9ICRzY29wZS5tZW1iZXJzO1xuICAgICAgc2VsZi5zZWxlY3RNZW1iZXIgPSBmdW5jdGlvbihldmVudCwgbWVtYmVyKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6c2VsZWN0ZWQnLCBtZW1iZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdncm91cEZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2dyb3VwLWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgICAgZ3JvdXAgOiAnPXZhbHVlJ1xuICAgICAgfVxuICAgICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUuZ3JvdXApO1xuICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLnNlbGVjdEdyb3VwID0gZnVuY3Rpb24oZXZlbnQsIGdyb3VwKSB7XG4gICAgICAgICAgaWYoZ3JvdXAuaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDpzZWxlY3RlZCcsIGdyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06Z3JvdXA6bGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDpjcmVhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06Z3JvdXA6dXBkYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgICB9O1xuICB9KTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuc2VydmljZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udXNlci5zZXJ2aWNlcyc7XG5cbnZhciBVc2VyQ2xpZW50ID0gcmVxdWlyZSgnLi4vdXNlci91c2VyLWNsaWVudCcpLFxuICAgIEdyb3VwQ2xpZW50ID0gcmVxdWlyZSgnLi4vZ3JvdXAvZ3JvdXAtY2xpZW50JyksXG4gICAgTWVtYmVyc2hpcENsaWVudCA9IHJlcXVpcmUoJy4uL21lbWJlcnNoaXAvbWVtYmVyc2hpcC1jbGllbnQnKTtcbiBcbmZ1bmN0aW9uIHdyYXBDbGllbnQoJHEsIGNsaWVudCwgbWV0aG9kTmFtZXMpIHtcbiAgdmFyIHdyYXBwZXIgPSB7fTtcbiAgbWV0aG9kTmFtZXMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgd3JhcHBlclttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRxLndoZW4oY2xpZW50W21ldGhvZE5hbWVdLmFwcGx5KGNsaWVudCwgYXJndW1lbnRzKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ3VzZXJDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnYXV0aCcsICdoYXNTZXNzaW9uJywgJ2NsZWFyU2Vzc2lvbicsICd2ZXJpZnknLCAnZ2V0UHJvZmlsZSddO1xuICB2YXIgdXNlckNsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBVc2VyQ2xpZW50KG1lZGlhdG9yKSwgbWV0aG9kTmFtZXMpO1xuICByZXR1cm4gdXNlckNsaWVudDtcbn0pO1xuXG5uZ01vZHVsZS5mYWN0b3J5KCdncm91cENsaWVudCcsIGZ1bmN0aW9uKCRxLCBtZWRpYXRvcikge1xuICB2YXIgbWV0aG9kTmFtZXMgPSBbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnbGlzdCcsICdtZW1iZXJzaGlwJ107XG4gIHZhciBncm91cENsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBHcm91cENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ21lbWJlcnNoaXBDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnbWVtYmVyc2hpcCddO1xuICB2YXIgZ3JvdXBDbGllbnQgPSB3cmFwQ2xpZW50KCRxLCBuZXcgTWVtYmVyc2hpcENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnVzZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXInLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlLmpzJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9ncm91cCdcbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWctZ3JvdXAnKTtcblxudmFyIEdyb3VwQ2xpZW50ID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdGhpcy5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICB0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG59O1xuXG52YXIgeGhyID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBhdGg6ICcvJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMoX29wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQob3B0aW9ucywgZnVuY3Rpb24ocmVzKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICB9LCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIGlkXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IEdyb3VwQ2xpZW50KG1lZGlhdG9yKTtcbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL21lbWJlcnNoaXAnXG59XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHEgPSByZXF1aXJlKCdxJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLW1lbWJlcnNoaXAnKTtcblxudmFyIE1lbWJlcnNoaXBDbGllbnQgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICB0aGlzLm1lZGlhdG9yID0gbWVkaWF0b3I7XG4gIHRoaXMuaW5pdENvbXBsZXRlID0gZmFsc2U7XG4gIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbn07XG5cbnZhciB4aHIgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcGF0aDogJy8nLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG4gIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyhfb3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5jbG91ZChvcHRpb25zLCBmdW5jdGlvbihyZXMpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gIH0sIGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BzKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZS5wcm9wcyA9IHByb3BzO1xuICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmFwcGlkID0gJGZoLmdldEZIUGFyYW1zKCkuYXBwaWQ7XG4gICAgc2VsZi5pbml0Q29tcGxldGUgPSB0cnVlO1xuICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgaWRcbiAgfSk7XG59O1xuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtZW1iZXJzaGlwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBtZW1iZXJzaGlwLmlkLFxuICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgZGF0YTogbWVtYmVyc2hpcFxuICB9KTtcbn07XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKG1lbWJlcnNoaXApIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGgsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgZGF0YTogbWVtYmVyc2hpcFxuICB9KTtcbn07XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKG1lbWJlcnNoaXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIG1lbWJlcnNoaXAuaWQsXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICBkYXRhOiBtZW1iZXJzaGlwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IE1lbWJlcnNoaXBDbGllbnQobWVkaWF0b3IpO1xufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL3VzZXInLFxuICBhdXRocG9saWN5UGF0aDogJy9ib3gvc3J2LzEuMS9hZG1pbi9hdXRocG9saWN5JyxcbiAgcG9saWN5SWQ6IHByb2Nlc3MuZW52LldGTV9BVVRIX1BPTElDWV9JRCB8fCAnd2ZtJ1xufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBxID0gcmVxdWlyZSgncScpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy11c2VyJyk7XG52YXIgcG9saWN5SWQ7XG5cbnZhciBVc2VyQ2xpZW50ID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdGhpcy5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICB0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG59O1xuXG52YXIgeGhyID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBhdGg6ICcvJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMoX29wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQob3B0aW9ucywgZnVuY3Rpb24ocmVzKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICB9LCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBzdG9yZVByb2ZpbGUgPSBmdW5jdGlvbihwcm9maWxlRGF0YSkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmgud2ZtLnByb2ZpbGVEYXRhJywgSlNPTi5zdHJpbmdpZnkocHJvZmlsZURhdGEpKTtcbn07XG5cbnZhciByZXRyaWV2ZVByb2ZpbGVEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHZhciBqc29uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZoLndmbS5wcm9maWxlRGF0YScpO1xuICByZXR1cm4ganNvbiA/IEpTT04ucGFyc2UoanNvbikgOiBudWxsO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgdmFyIHByb21pc2VDb25maWcgPSB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy9jb25maWcvYXV0aHBvbGljeSdcbiAgfSkudGhlbihmdW5jdGlvbihfcG9saWN5SWQpIHtcbiAgICBwb2xpY3lJZCA9IF9wb2xpY3lJZDtcbiAgICByZXR1cm4gcG9saWN5SWQ7XG4gIH0pXG4gIHJldHVybiBxLmFsbChbZGVmZXJyZWQucHJvbWlzZSwgcHJvbWlzZUNvbmZpZ10pO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuVXNlckNsaWVudC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgaWRcbiAgfSk7XG59O1xuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyB1c2VyLmlkLFxuICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgZGF0YTogdXNlclxuICB9KTtcbn07XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIHVzZXIuaWQsXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICBkYXRhOiB1c2VyXG4gIH0pO1xufTtcblxuVXNlckNsaWVudC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24odXNlcikge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBkYXRhOiB1c2VyXG4gIH0pO1xufTtcblxuVXNlckNsaWVudC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5pbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICRmaC5hdXRoKHtcbiAgICAgIHBvbGljeUlkOiBwb2xpY3lJZCxcbiAgICAgIGNsaWVudFRva2VuOiBzZWxmLmFwcGlkLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHVzZXJJZDogdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIC8vIHJlcy5zZXNzaW9uVG9rZW47IC8vIFRoZSBwbGF0Zm9ybSBzZXNzaW9uIGlkZW50aWZpZXJcbiAgICAgIC8vIHJlcy5hdXRoUmVzcG9uc2U7IC8vIFRoZSBhdXRoZXRpY2F0aW9uIGluZm9ybWF0aW9uIHJldHVybmVkIGZyb20gdGhlIGF1dGhldGljYXRpb24gc2VydmljZS5cbiAgICAgIHZhciBwcm9maWxlRGF0YSA9IHJlcy5hdXRoUmVzcG9uc2U7XG4gICAgICBpZiAodHlwZW9mIHByb2ZpbGVEYXRhID09PSAnc3RyaW5nJyB8fCBwcm9maWxlRGF0YSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHByb2ZpbGVEYXRhID0gSlNPTi5wYXJzZShwcm9maWxlRGF0YSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIHBhcnNlIHRoZSAkZmguYXV0aCByZXNwb25zZS4gVXNpbmcgYSB3b3JrYXJvdW5kJyk7XG4gICAgICAgICAgcHJvZmlsZURhdGEgPSBKU09OLnBhcnNlKHByb2ZpbGVEYXRhLnJlcGxhY2UoLyxcXHMvZywgJywnKS5yZXBsYWNlKC9bXiw9e31dKy9nLCAnXCIkJlwiJykucmVwbGFjZSgvPS9nLCAnOicpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdG9yZVByb2ZpbGUocHJvZmlsZURhdGEpO1xuICAgICAgc2VsZi5tZWRpYXRvci5wdWJsaXNoKCd3Zm06YXV0aDpwcm9maWxlOmNoYW5nZScsIHByb2ZpbGVEYXRhKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgICB9LCBmdW5jdGlvbiAobXNnLCBlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKG1zZywgZXJyKTtcbiAgICAgIHZhciBlcnJvck1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgLyogUG9zc2libGUgZXJyb3JzOlxuICAgICAgdW5rbm93bl9wb2xpY3lJZCAtIFRoZSBwb2xpY3lJZCBwcm92aWRlZCBkaWQgbm90IG1hdGNoIGFueSBkZWZpbmVkIHBvbGljeS4gQ2hlY2sgdGhlIEF1dGggUG9saWNpZXMgZGVmaW5lZC4gU2VlIEF1dGggUG9saWNpZXMgQWRtaW5pc3RyYXRpb25cbiAgICAgIHVzZXJfbm90X2ZvdW5kIC0gVGhlIEF1dGggUG9saWN5IGFzc29jaWF0ZWQgd2l0aCB0aGUgcG9saWN5SWQgcHJvdmlkZWQgaGFzIGJlZW4gc2V0IHVwIHRvIHJlcXVpcmUgdGhhdCBhbGwgdXNlcnMgYXV0aGVudGljYXRpbmcgZXhpc3Qgb24gdGhlIHBsYXRmb3JtLCBidXQgdGhpcyB1c2VyIGRvZXMgbm90IGV4aXN0cy5cbiAgICAgIHVzZXJfbm90X2FwcHJvdmVkIC0gLSBUaGUgQXV0aCBQb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoZSBwb2xpY3lJZCBwcm92aWRlZCBoYXMgYmVlbiBzZXQgdXAgdG8gcmVxdWlyZSB0aGF0IGFsbCB1c2VycyBhdXRoZW50aWNhdGluZyBhcmUgaW4gYSBsaXN0IG9mIGFwcHJvdmVkIHVzZXJzLCBidXQgdGhpcyB1c2VyIGlzIG5vdCBpbiB0aGF0IGxpc3QuXG4gICAgICB1c2VyX2Rpc2FibGVkIC0gVGhlIHVzZXIgaGFzIGJlZW4gZGlzYWJsZWQgZnJvbSBsb2dnaW5nIGluLlxuICAgICAgdXNlcl9wdXJnZV9kYXRhIC0gVGhlIHVzZXIgaGFzIGJlZW4gZmxhZ2dlZCBmb3IgZGF0YSBwdXJnZSBhbmQgYWxsIGxvY2FsIGRhdGEgc2hvdWxkIGJlIGRlbGV0ZWQuXG4gICAgICBkZXZpY2VfZGlzYWJsZWQgLSBUaGUgZGV2aWNlIGhhcyBiZWVuIGRpc2FibGVkLiBObyB1c2VyIG9yIGFwcHMgY2FuIGxvZyBpbiBmcm9tIHRoZSByZXF1ZXN0aW5nIGRldmljZS5cbiAgICAgIGRldmljZV9wdXJnZV9kYXRhIC0gVGhlIGRldmljZSBoYXMgYmVlbiBmbGFnZ2VkIGZvciBkYXRhIHB1cmdlIGFuZCBhbGwgbG9jYWwgZGF0YSBzaG91bGQgYmUgZGVsZXRlZC5cbiAgICAgICovXG4gICAgICBpZiAoZXJyb3JNc2cgPT0gXCJ1c2VyX3B1cmdlX2RhdGFcIiB8fCBlcnJvck1zZyA9PSBcImRldmljZV9wdXJnZV9kYXRhXCIpIHtcbiAgICAgICAgLy8gVE9ETzogVXNlciBvciBkZXZpY2UgaGFzIGJlZW4gYmxhY2sgbGlzdGVkIGZyb20gYWRtaW5pc3RyYXRpb24gY29uc29sZSBhbmQgYWxsIGxvY2FsIGRhdGEgc2hvdWxkIGJlIHdpcGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdVc2VyIG9yIGRldmljZSBoYXMgYmVlbiBibGFjayBsaXN0ZWQgZnJvbSBhZG1pbmlzdHJhdGlvbiBjb25zb2xlIGFuZCBhbGwgbG9jYWwgZGF0YSBzaG91bGQgYmUgd2lwZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gZmFpbGVkIC0gXCIgKyBlcnJvck1zZyk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvck1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5oYXNTZXNzaW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmF1dGguaGFzU2Vzc2lvbihmdW5jdGlvbihlcnIsIGV4aXN0cyl7XG4gICAgaWYoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNoZWNrIHNlc3Npb246ICcsIGVycik7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2UgaWYgKGV4aXN0cyl7XG4gICAgICAvL3VzZXIgaXMgYWxyZWFkeSBhdXRoZW50aWNhdGVkXG4gICAgICAvL29wdGlvbmFsbHkgd2UgY2FuIGFsc28gdmVyaWZ5IHRoZSBzZXNzaW9uIGlzIGFjdXRhbGx5IHZhbGlkIGZyb20gY2xpZW50LiBUaGlzIHJlcXVpcmVzIG5ldHdvcmsgY29ubmVjdGlvbi5cbiAgICAgIGRlZmVycmVkLnJlc29sdmUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmNsZWFyU2Vzc2lvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLmF1dGguY2xlYXJTZXNzaW9uKGZ1bmN0aW9uKGVycil7XG4gICAgaWYoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNsZWFyIHNlc3Npb246ICcsIGVycik7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RvcmVQcm9maWxlKG51bGwpO1xuICAgICAgc2VsZi5tZWRpYXRvci5wdWJsaXNoKCd3Zm06YXV0aDpwcm9maWxlOmNoYW5nZScsIG51bGwpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmF1dGgudmVyaWZ5KGZ1bmN0aW9uKGVyciwgdmFsaWQpe1xuICAgIGlmKGVycil7XG4gICAgICBjb25zb2xlLmxvZygnZmFpbGVkIHRvIHZlcmlmeSBzZXNzaW9uJyk7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYodmFsaWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXNzaW9uIGlzIHZhbGlkJyk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXNzaW9uIGlzIG5vdCB2YWxpZCcpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmdldFByb2ZpbGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHEud2hlbihyZXRyaWV2ZVByb2ZpbGVEYXRhKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1lZGlhdG9yKSB7XG4gIHJldHVybiBuZXcgVXNlckNsaWVudChtZWRpYXRvcik7XG59XG4iLCJyZXF1aXJlKCcuL3ZlaGljbGUtaW5zcGVjdGlvbi1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3ZlaGljbGUtaW5zcGVjdGlvbi50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlcicpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24tZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICcgIDxkaXYgbGF5b3V0PVwicm93XCIgY2xhc3M9XCJ3Zm0taW5zcGVjdGlvbi1yb3dcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleD1cIjQwXCIgbGF5b3V0PVwicm93XCIgbGF5b3V0LWFsaWduPVwic3RhcnQgY2VudGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtYm9keS0yXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxvY2FsX2dhc19zdGF0aW9uPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgIEZ1ZWwgKCUpXFxuJyArXG4gICAgJyAgICAgIDwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLXNsaWRlciBmbGV4IG1kLWRpc2NyZXRlIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5mdWVsXCIgc3RlcD1cIjI1XCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIGFyaWEtbGFiZWw9XCJyYXRpbmdcIj5cXG4nICtcbiAgICAnICAgIDwvbWQtc2xpZGVyPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBsYXlvdXQ9XCJyb3dcIiBjbGFzcz1cIndmbS1pbnNwZWN0aW9uLXJvd1wiPlxcbicgK1xuICAgICcgICAgPGRpdiBmbGV4PVwiMzBcIiBsYXlvdXQ9XCJyb3dcIiBsYXlvdXQtYWxpZ249XCJzdGFydCBjZW50ZXJcIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1ib2R5LTJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+YWxidW08L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgVGlyZXNcXG4nICtcbiAgICAnICAgICAgPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IGZsZXggbGF5b3V0LWFsaWduPVwic3RhcnQgc3RhcnRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLXJhZGlvLWdyb3VwIGxheW91dCBuZy1tb2RlbD1cImN0cmwubW9kZWwudGlyZXNcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtcmFkaW8tYnV0dG9uIG5nLXZhbHVlPVwiZmFsc2VcIiA+RmFpbDwvbWQtcmFkaW8tYnV0dG9uPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1yYWRpby1idXR0b24gbmctdmFsdWU9XCJ0cnVlXCI+IFBhc3MgPC9tZC1yYWRpby1idXR0b24+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtcmFkaW8tZ3JvdXA+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxkaXYgbGF5b3V0PVwicm93XCIgY2xhc3M9XCJ3Zm0taW5zcGVjdGlvbi1yb3dcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleD1cIjMwXCIgbGF5b3V0PVwicm93XCIgbGF5b3V0LWFsaWduPVwic3RhcnQgY2VudGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtYm9keS0yXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmJyaWdodG5lc3NfbG93PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgIExpZ2h0c1xcbicgK1xuICAgICcgICAgICA8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleCBsYXlvdXQtYWxpZ249XCJzdGFydCBzdGFydFwiPlxcbicgK1xuICAgICcgICAgICA8bWQtcmFkaW8tZ3JvdXAgbGF5b3V0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5saWdodHNcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtcmFkaW8tYnV0dG9uIG5nLXZhbHVlPVwiZmFsc2VcIj5GYWlsPC9tZC1yYWRpby1idXR0b24+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLXJhZGlvLWJ1dHRvbiBuZy12YWx1ZT1cInRydWVcIj4gUGFzcyA8L21kLXJhZGlvLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgPC9tZC1yYWRpby1ncm91cD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid29ya2Zsb3ctYWN0aW9ucyBtZC1wYWRkaW5nIG1kLXdoaXRlZnJhbWUtejRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnkgbWQtaHVlLTFcIiBuZy1jbGljaz1cImN0cmwuYmFjaygkZXZlbnQpXCI+QmFjazwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeVwiIG5nLWNsaWNrPVwiY3RybC5kb25lKCRldmVudClcIj5Db250aW51ZTwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPC9kaXY+PCEtLSB3b3JrZmxvdy1hY3Rpb25zLS0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlcicpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLXN1YmhlYWRlcj5WZWhpY2xlIEluc3BlY3Rpb248L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWxpc3QgY2xhc3M9XCJyaXNrLWFzc2Vzc21lbnRcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bG9jYWxfZ2FzX3N0YXRpb248L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3ZlaGljbGVJbnNwZWN0aW9uLmZ1ZWx9fSAlPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5GdWVsPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cInZlaGljbGVJbnNwZWN0aW9uLnRpcmVzXCIgY2xhc3M9XCJzdWNjZXNzXCI+Y2hlY2tfY2lyY2xlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLnRpcmVzXCIgY2xhc3M9XCJkYW5nZXJcIj5jYW5jZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMyBuZy1pZj1cInZlaGljbGVJbnNwZWN0aW9uLnRpcmVzXCI+UGFzczwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwiISB2ZWhpY2xlSW5zcGVjdGlvbi50aXJlc1wiPkZhaWw8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlRpcmVzPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cInZlaGljbGVJbnNwZWN0aW9uLmxpZ2h0c1wiIGNsYXNzPVwic3VjY2Vzc1wiPmNoZWNrX2NpcmNsZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwiISB2ZWhpY2xlSW5zcGVjdGlvbi5saWdodHNcIiBjbGFzcz1cImRhbmdlclwiPmNhbmNlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24ubGlnaHRzXCI+UGFzczwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwiISB2ZWhpY2xlSW5zcGVjdGlvbi5saWdodHNcIj5GYWlsPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5MaWdodHM8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udmVoaWNsZS1pbnNwZWN0aW9uJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3ZlaGljbGVJbnNwZWN0aW9uJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB2ZWhpY2xlSW5zcGVjdGlvbjogJz12YWx1ZSdcbiAgICB9XG4gIH07XG59KVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3ZlaGljbGVJbnNwZWN0aW9uRm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvdmVoaWNsZS1pbnNwZWN0aW9uLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLm1vZGVsID0ge307XG4gICAgc2VsZi5iYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmJhY2snKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgc2VsZi5kb25lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmRvbmUnLCBzZWxmLm1vZGVsKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnZlaGljbGUtaW5zcGVjdGlvbic7XG4iLCJyZXF1aXJlKCcuL3dvcmtmbG93LWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctc3RlcC1mb3JtLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhciBtZC1wcmltYXJ5XCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz57e2N0cmwubW9kZWwuaWQgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSB3b3JrZmxvdzwvaDM+XFxuJyArXG4gICAgJyAgICA8c3BhbiBmbGV4Pjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RXb3JrZmxvdygkZXZlbnQsIHdvcmtmbG93KVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbFwiPlxcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya2Zsb3dGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKHdvcmtmbG93Rm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5UaXRsZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInRpdGxlXCIgbmFtZT1cInRpdGxlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnRpdGxlXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2Zsb3cudGl0bGUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZmxvd0Zvcm0udGl0bGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB0aXRsZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPnt7Y3RybC5tb2RlbC5pZCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtmbG93PC9tZC1idXR0b24+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXByb2dyZXNzLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3b3JrZmxvdy1wcm9ncmVzc1wiIG5nLWNsYXNzPVwie2Nsb3NlOiBjdHJsLmNsb3NlZH1cIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvbiBtZC13YXJtIGV4cGFuZC1jb2xsYXBzZVwiPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG5nLXNob3c9XCJjdHJsLmNsb3NlZFwiIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1jbGljaz1cImN0cmwub3BlbigpXCI+a2V5Ym9hcmRfYXJyb3dfZG93bjwvbWQtaWNvbj5cXG4nICtcbiAgICAnICA8bWQtaWNvbiBuZy1zaG93PVwiIWN0cmwuY2xvc2VkXCIgbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWNsaWNrPVwiY3RybC5jbG9zZSgpXCI+a2V5Ym9hcmRfYXJyb3dfdXA8L21kLWljb24+XFxuJyArXG4gICAgJzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cInNjcm9sbC1ib3hcIj5cXG4nICtcbiAgICAnICA8b2w+XFxuJyArXG4gICAgJyAgICA8bGkgbmctY2xhc3M9XCJ7YWN0aXZlOiBcXCctMVxcJyA9PSBjdHJsLnN0ZXBJbmRleCwgY29tcGxldGU6IC0xIDwgY3RybC5zdGVwSW5kZXh9XCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtY2FwdGlvblwiPjxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj52aXNpYmlsaXR5PC9tZC1pY29uPjwvc3Bhbj5PdmVydmlld1xcbicgK1xuICAgICcgICAgPC9saT5cXG4nICtcbiAgICAnICAgIDxsaSBuZy1yZXBlYXQ9XCJzdGVwIGluIGN0cmwuc3RlcHNcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRpbmRleCA9PSBjdHJsLnN0ZXBJbmRleCwgY29tcGxldGU6ICRpbmRleCA8IGN0cmwuc3RlcEluZGV4fVwiPlxcbicgK1xuICAgICcgICAgICA8c3BhbiBjbGFzcz1cIm1kLWNhcHRpb25cIj57eyRpbmRleCArIDF9fTwvc3Bhbj57e3N0ZXAubmFtZX19XFxuJyArXG4gICAgJyAgICA8L2xpPlxcbicgK1xuICAgICcgICAgPGxpIG5nLWNsYXNzPVwie2FjdGl2ZTogY3RybC5zdGVwcy5sZW5ndGggPD0gY3RybC5zdGVwSW5kZXgsIGNvbXBsZXRlOiBjdHJsLnN0ZXBzLmxlbmd0aCA8PSBjdHJsLnN0ZXBJbmRleH1cIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1jYXB0aW9uXCI+PG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmRvbmU8L21kLWljb24+PC9zcGFuPlN1bW1hcnlcXG4nICtcbiAgICAnICAgIDwvbGk+XFxuJyArXG4gICAgJyAgPC9vbD5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9kaXY+PCEtLSB3b3JrZmxvdy1wcm9ncmVzcyAtLT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwnLFxuICAgICc8aDIgY2xhc3M9XCJtZC10aXRsZVwiPlN0ZXA6IHt7c3RlcC5uYW1lfX08L2gyPlxcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxhYmVsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3N0ZXAuY29kZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+U3RlcCBjb2RlPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctc2hvdz1cInN0ZXAuZm9ybUlkXCI+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bGFiZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7c3RlcC5mb3JtSWR9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgIDxwPkZvcm1JZDwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctc2hvdz1cInN0ZXAudGVtcGxhdGVzICYmIHN0ZXAudGVtcGxhdGVzLnZpZXdcIj5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sYWJlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3tzdGVwLnRlbXBsYXRlcy52aWV3fX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5WaWV3IHRlbXBsYXRlPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiBuZy1zaG93PVwic3RlcC50ZW1wbGF0ZXMuZm9ybVwiPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxhYmVsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3N0ZXAudGVtcGxhdGVzLmZvcm19fTwvaDM+XFxuJyArXG4gICAgJyAgICAgIDxwPkZvcm0gdGVtcGxhdGU8L3A+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctc3RlcC1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyIG1kLXByaW1hcnlcIiBuZy1zaG93PVwic3RlcFwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+VXBkYXRlIHN0ZXA8L2gzPlxcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0V29ya2Zsb3coJGV2ZW50LCB3b3JrZmxvdylcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJ3b3JrZmxvd1N0ZXBGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKHdvcmtmbG93U3RlcEZvcm0uJHZhbGlkKVwiIG5vdmFsaWRhdGUgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWw+Q29kZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImNvZGVcIiBuYW1lPVwiY29kZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLmNvZGVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZmxvdy5tb2RlbC5zdGVwLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2Zsb3dGb3JtLnRpdGxlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgY29kZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPk5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3RlcC5uYW1lXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2Zsb3cubmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtmbG93Rm9ybS5uYW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgbmFtZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPkZvcm1JRDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLmZvcm1JZFwiIG5hbWU9XCJmb3JtSWRcIiBpZD1cImZvcm1JZFwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJmb3JtIGluIGN0cmwuZm9ybXNcIiB2YWx1ZT1cInt7Zm9ybS5faWR9fVwiPnt7Zm9ybS5faWR9fSAoe3tmb3JtLm5hbWV9fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5mb3JtIHRlbXBsYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZm9ybVwiIG5hbWU9XCJmb3JtXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAudGVtcGxhdGVzLmZvcm1cIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD52aWV3IHRlbXBsYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidmlld1wiIG5hbWU9XCJ2aWV3XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAudGVtcGxhdGVzLnZpZXdcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlzTmV3ID8gXFwnQWRkXFwnIDogXFwnVXBkYXRlXFwnfX0gc3RlcDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtcbiAgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCd3b3JrZmxvd1Byb2dyZXNzJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR0aW1lb3V0KSB7XG4gIGZ1bmN0aW9uIHBhcnNlU3RlcEluZGV4KGN0cmwsIHN0ZXBJbmRleCkge1xuICAgIGN0cmwuc3RlcEluZGV4ID0gc3RlcEluZGV4O1xuICAgIGN0cmwuc3RlcCA9IGN0cmwuc3RlcHNbY3RybC5zdGVwSW5kZXhdO1xuICB9XG4gIGZ1bmN0aW9uIHNjcm9sbFRvQWN0aXZlKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudFswXTtcbiAgICB2YXIgYWN0aXZlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaS5hY3RpdmUnKTtcbiAgICBpZiAoIWFjdGl2ZSkge1xuICAgICAgYWN0aXZlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaScpO1xuICAgIH07XG4gICAgdmFyIHNjcm9sbGVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLWJveCcpO1xuICAgIHZhciBvZmZzZXQgPSBhY3RpdmUub2Zmc2V0VG9wO1xuICAgIHNjcm9sbGVyLnNjcm9sbFRvcCA9IG9mZnNldDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBzdGVwSW5kZXg6ICc9JyxcbiAgICAgIHdvcmtmbG93OiAnPSdcbiAgICB9XG4gICwgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjcm9sbFRvQWN0aXZlKGVsZW1lbnQpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYud29ya2Zsb3cgPSAkc2NvcGUud29ya2Zsb3c7XG4gICAgICBzZWxmLnN0ZXBzID0gJHNjb3BlLndvcmtmbG93LnN0ZXBzO1xuICAgICAgc2VsZi5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuY2xvc2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBzZWxmLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjcm9sbFRvQWN0aXZlKCRlbGVtZW50KTtcbiAgICAgICAgc2VsZi5jbG9zZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcGFyc2VTdGVwSW5kZXgoc2VsZiwgJHNjb3BlLnN0ZXBJbmRleCA/IHBhcnNlSW50KCRzY29wZS5zdGVwSW5kZXgpIDogMClcblxuICAgICAgJHNjb3BlLiR3YXRjaCgnc3RlcEluZGV4JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGVwSW5kZXggY2hhbmdlZCcpXG4gICAgICAgIHBhcnNlU3RlcEluZGV4KHNlbGYsICRzY29wZS5zdGVwSW5kZXggPyBwYXJzZUludCgkc2NvcGUuc3RlcEluZGV4KSA6IDApO1xuICAgICAgICBzZWxmLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNjcm9sbFRvQWN0aXZlKCRlbGVtZW50KTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtmbG93U3RlcCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZVJlcXVlc3QsICRjb21waWxlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCBzY29wZToge1xuICAgICAgc3RlcDogJz0nIC8vIHsgLi4uLCB0ZW1wbGF0ZTogXCJhbiBodG1sIHRlbXBsYXRlIHRvIHVzZVwiLCB0ZW1wbGF0ZVBhdGg6IFwiYSB0ZW1wbGF0ZSBwYXRoIHRvIGxvYWRcIn1cbiAgICAsIHdvcmtvcmRlcjogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgnc3RlcCcsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgaWYgKHNjb3BlLnN0ZXApIHtcbiAgICAgICAgICBpZiAoc2NvcGUuc3RlcC5mb3JtSWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbCgnPGFwcGZvcm0gZm9ybS1pZD1cInN0ZXAuZm9ybUlkXCI+PC9hcHBmb3JtPicpO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY29wZS5zdGVwLnRlbXBsYXRlUGF0aCkge1xuICAgICAgICAgICAgJHRlbXBsYXRlUmVxdWVzdChzY29wZS5zdGVwLnRlbXBsYXRlUGF0aCkudGhlbihmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoc2NvcGUuc3RlcC50ZW1wbGF0ZXMuZm9ybSk7XG4gICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnd29ya2Zsb3dSZXN1bHQnLCBmdW5jdGlvbigkY29tcGlsZSkge1xuICB2YXIgcmVuZGVyID0gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgaWYgKHNjb3BlLndvcmtmbG93LnN0ZXBzICYmIHNjb3BlLnJlc3VsdCkge1xuICAgICAgZWxlbWVudC5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgc2NvcGUud29ya2Zsb3cuc3RlcHMuZm9yRWFjaChmdW5jdGlvbihzdGVwLCBzdGVwSW5kZXgpIHtcbiAgICAgICAgaWYgKHNjb3BlLnJlc3VsdC5zdGVwUmVzdWx0cyAmJiBzY29wZS5yZXN1bHQuc3RlcFJlc3VsdHNbc3RlcC5jb2RlXSkge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKCc8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+Jyk7XG4gICAgICAgICAgdmFyIHRlbXBsYXRlID0gJyc7XG4gICAgICAgICAgdGVtcGxhdGUgPSAnPHdvcmtvcmRlci1zdWJtaXNzaW9uLXJlc3VsdCdcbiAgICAgICAgICB0ZW1wbGF0ZSArPSAnIHJlc3VsdD1cInJlc3VsdC5zdGVwUmVzdWx0c1tcXCcnK3N0ZXAuY29kZSsnXFwnXVwiJ1xuICAgICAgICAgIHRlbXBsYXRlICs9ICcgc3RlcD1cIndvcmtmbG93LnN0ZXBzW1xcJycrc3RlcEluZGV4KydcXCddXCInXG4gICAgICAgICAgdGVtcGxhdGUgKz0gJz48L3dvcmtvcmRlci1zdWJtaXNzaW9uLXJlc3VsdD4nO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRlbXBsYXRlKTtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZCh0ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCBzY29wZToge1xuICAgICAgd29ya2Zsb3c6ICc9J1xuICAgICwgcmVzdWx0OiAnPSdcbiAgICB9XG4gICwgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgcmVuZGVyKHNjb3BlLCBlbGVtZW50LCBhdHRycyk7XG4gICAgfVxuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3dvcmtmbG93Rm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctZm9ybS50cGwuaHRtbCcpXG4gICAgLCBzY29wZToge1xuICAgICAgd29ya2Zsb3cgOiAnPXZhbHVlJ1xuICAgICAgfVxuICAgICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2Zsb3cpO1xuICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYubW9kZWwuaWQgJiYgc2VsZi5tb2RlbC5pZCAhPT0gMCkge1xuICAgICAgICAgICAgICBzZWxmLm1vZGVsLnN0ZXBzID0gW107XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpjcmVhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnVwZGF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuc2VsZWN0V29ya2Zsb3cgPSBmdW5jdGlvbihldmVudCwgd29ya2Zsb3cpIHtcbiAgICAgICAgICBpZih3b3JrZmxvdy5pZCkge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgd29ya2Zsb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpsaXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gICAgfTtcbiAgfSlcbi5kaXJlY3RpdmUoJ3dvcmtmbG93U3RlcEZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXN0ZXAtZm9ybS50cGwuaHRtbCcpXG4gICAgLCBzY29wZToge1xuICAgICAgd29ya2Zsb3cgOiAnPScsXG4gICAgICBzdGVwIDogJz0nLFxuICAgICAgZm9ybXM6ICc9J1xuICAgICAgfVxuICAgICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5mb3JtcyA9ICRzY29wZS5mb3JtcztcbiAgICAgICAgdmFyIGV4aXN0aW5nU3RlcDtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYoISRzY29wZS5zdGVwKXtcbiAgICAgICAgICBzZWxmLm1vZGVsID0ge1xuICAgICAgICAgICAgc3RlcCA6IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVzIDoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZmxvdyA6IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2Zsb3cpLFxuICAgICAgICAgICAgaXNOZXcgOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNlbGYubW9kZWwgPSB7XG4gICAgICAgICAgICB3b3JrZmxvdyA6IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2Zsb3cpLFxuICAgICAgICAgICAgc3RlcCA6IGFuZ3VsYXIuY29weSgkc2NvcGUuc3RlcClcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhpc3RpbmdTdGVwID0gJHNjb3BlLndvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7cmV0dXJuIGl0ZW0uY29kZSA9PSAkc2NvcGUuc3RlcC5jb2RlO30pLmxlbmd0aD4wO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oaXNWYWxpZCkge1xuICAgICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAvL3dlIGNoZWNrIGlmIHRoZSBzdGVwIGFscmVhZHkgZXhpc3Qgb3Igbm90LCBpZiBpdCBleHNpdCB3ZSByZW1vdmUgdGhlIG9sZCBlbGVtZW50XG4gICAgICAgICAgICAgIGlmKGV4aXN0aW5nU3RlcCl7XG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWRTdGVwSW5kZXggPSBfLmZpbmRJbmRleCgkc2NvcGUud29ya2Zsb3cuc3RlcHMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8uY29kZSA9PSAkc2NvcGUuc3RlcC5jb2RlOyB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUud29ya2Zsb3cuc3RlcHNbdXBkYXRlZFN0ZXBJbmRleF0gPSBzZWxmLm1vZGVsLnN0ZXA7XG4gICAgICAgICAgICAgICAgLy8kc2NvcGUud29ya2Zsb3cuc3RlcHMgPSAkc2NvcGUud29ya2Zsb3cuc3RlcHMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtyZXR1cm4gaXRlbS5jb2RlICE9ICRzY29wZS5zdGVwLmNvZGU7fSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAkc2NvcGUud29ya2Zsb3cuc3RlcHMucHVzaChzZWxmLm1vZGVsLnN0ZXApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzp1cGRhdGVkJywgJHNjb3BlLndvcmtmbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5zZWxlY3RXb3JrZmxvdyA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZmxvdykge1xuICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIHdvcmtmbG93KTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgIH07XG4gIH0pXG4gIC5kaXJlY3RpdmUoJ3dvcmtmbG93U3RlcERldGFpbCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwnKVxuICAgICAgLCBzY29wZToge1xuICAgICAgICAgIHN0ZXAgOiAnPSdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuICAsIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICA7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3JrZmxvdy5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5uZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHdvcmtmbG93ID0ge1xuICAgICAgICB0aXRsZTogJydcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHdvcmtmbG93KTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuc3luYycsIFtyZXF1aXJlKCdmaC13Zm0tc3luYycpXSlcbi5mYWN0b3J5KCd3b3JrZmxvd1N5bmMnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIHN5bmNTZXJ2aWNlKSB7XG4gIHN5bmNTZXJ2aWNlLmluaXQoJGZoLCBjb25maWcuc3luY09wdGlvbnMpO1xuICB2YXIgd29ya2Zsb3dTeW5jID0ge307XG4gIHdvcmtmbG93U3luYy5jcmVhdGVNYW5hZ2VyID0gZnVuY3Rpb24ocXVlcnlQYXJhbXMpIHtcbiAgICBpZiAod29ya2Zsb3dTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKHdvcmtmbG93U3luYy5tYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHdvcmtmbG93U3luYy5tYW5hZ2VyUHJvbWlzZSA9IHN5bmNTZXJ2aWNlLm1hbmFnZShjb25maWcuZGF0YXNldElkLCBudWxsLCBxdWVyeVBhcmFtcylcbiAgICAgIC50aGVuKGZ1bmN0aW9uKG1hbmFnZXIpIHtcbiAgICAgICAgd29ya2Zsb3dTeW5jLm1hbmFnZXIgPSB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQsICd3aXRoIGZpbHRlcjogJywgcXVlcnlQYXJhbXMpO1xuICAgICAgICAvLyBUT0RPOiB3ZSBzaG91bGQgcmVmYWN0b3IgdGhlc2UgdXRpbGl0aWVzIGZ1bmN0aW9ucyBzb21ld2hlcmUgZWxzZSBwcm9iYWJseVxuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlci5zdGVwUmV2aWV3ID0gZnVuY3Rpb24oc3RlcHMsIHJlc3VsdCkge1xuICAgICAgICAgIHZhciBzdGVwSW5kZXggPSAtMTtcbiAgICAgICAgICB2YXIgY29tcGxldGU7XG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RlcFJlc3VsdHMgJiYgcmVzdWx0LnN0ZXBSZXN1bHRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHN0ZXAgPSBzdGVwc1tpXTtcbiAgICAgICAgICAgICAgdmFyIHN0ZXBSZXN1bHQgPSByZXN1bHQuc3RlcFJlc3VsdHNbc3RlcC5jb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHN0ZXBSZXN1bHQgJiYgKHN0ZXBSZXN1bHQuc3RhdHVzID09PSAnY29tcGxldGUnIHx8IHN0ZXBSZXN1bHQuc3RhdHVzID09PSAncGVuZGluZycpKSB7XG4gICAgICAgICAgICAgICAgc3RlcEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpZiAoc3RlcFJlc3VsdC5zdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgICAgY29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmV4dFN0ZXBJbmRleDogc3RlcEluZGV4LFxuICAgICAgICAgICAgY29tcGxldGU6IGNvbXBsZXRlIC8vIGZhbHNlIGlzIGFueSBzdGVwcyBhcmUgXCJwZW5kaW5nXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya2Zsb3dTeW5jLm1hbmFnZXIubmV4dFN0ZXBJbmRleCA9IGZ1bmN0aW9uKHN0ZXBzLCByZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdGVwUmV2aWV3KHN0ZXBzLCByZXN1bHQpLm5leHRTdGVwSW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlci5jaGVja1N0YXR1cyA9IGZ1bmN0aW9uKHdvcmtvcmRlciwgd29ya2Zsb3csIHJlc3VsdCkge1xuICAgICAgICAgIHZhciBzdGF0dXM7XG4gICAgICAgICAgdmFyIHN0ZXBSZXZpZXcgPSB0aGlzLnN0ZXBSZXZpZXcod29ya2Zsb3cuc3RlcHMsIHJlc3VsdCk7XG4gICAgICAgICAgaWYgKHN0ZXBSZXZpZXcubmV4dFN0ZXBJbmRleCA+PSB3b3JrZmxvdy5zdGVwcy5sZW5ndGggLSAxICYmIHN0ZXBSZXZpZXcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdDb21wbGV0ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmICghd29ya29yZGVyLmFzc2lnbmVlKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnVW5hc3NpZ25lZCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGVwUmV2aWV3Lm5leHRTdGVwSW5kZXggPCAwKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnTmV3JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gJ0luIFByb2dyZXNzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd29ya2Zsb3dTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgd29ya2Zsb3dTeW5jLnJlbW92ZU1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAod29ya2Zsb3dTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB3b3JrZmxvd1N5bmMubWFuYWdlci5zYWZlU3RvcCgpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIHdvcmtmbG93U3luYy5tYW5hZ2VyO1xuICAgICAgfSlcbiAgICB9XG4gIH07XG4gIHJldHVybiB3b3JrZmxvd1N5bmM7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3JrZmxvdyc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlLmpzJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaUhvc3Q6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxuICBhcGlQYXRoOiAnL2FwaS93Zm0vd29ya2Zsb3cnLFxuICBkYXRhc2V0SWQgOiAnd29ya2Zsb3dzJyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsInJlcXVpcmUoJy4vd29ya29yZGVyLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya29yZGVyLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya29yZGVyLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXItZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhciBtZC1wcmltYXJ5XCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz57e2N0cmwubW9kZWwuaWQgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSB3b3JrIG9yZGVyIElEIHt7Y3RybC5tb2RlbC5pZH19PC9oMz5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJ7e2N0cmwuc3RhdHVzfX1cIj5cXG4nICtcbiAgICAnICAgICAgPHdvcmtvcmRlci1zdGF0dXMgc3RhdHVzPVwiY3RybC5zdGF0dXNcIj48L3dvcmtvcmRlci1zdGF0dXM+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8c3BhbiBmbGV4Pjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RXb3Jrb3JkZXIoJGV2ZW50LCBjdHJsLm1vZGVsKVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIndvcmtvcmRlckZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUod29ya29yZGVyRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8IS0tXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3Jrb3JkZXJTdGF0ZVwiPlN0YXR1czwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0V29ya29yZGVyVHlwZVwiIG5hbWU9XCJ3b3Jrb3JkZXJTdGF0dXNcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3RhdHVzXCIgZGlzYWJsZWQ9XCJ0cnVlXCI+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgLS0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGxheW91dC1ndC1zbT1cInJvd1wiPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya29yZGVyVHlwZVwiPlR5cGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cImN0cmwubW9kZWwudHlwZVwiIG5hbWU9XCJ3b3Jrb3JkZXJUeXBlXCIgaWQ9XCJ3b3Jrb3JkZXJUeXBlXCI+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwiSm9iIE9yZGVyXCI+Sm9iIE9yZGVyPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwiVHlwZSAwMlwiPlR5cGUgMDI8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJUeXBlIDAzXCI+VHlwZSAwMzwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cIlR5cGUgMDRcIj5UeXBlIDA0PC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2Zsb3dcIj5Xb3JrZmxvdzwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC53b3JrZmxvd0lkXCIgbmFtZT1cIndvcmtmbG93XCIgaWQ9XCJ3b3JrZmxvd1wiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJ3b3JrZmxvdyBpbiBjdHJsLndvcmtmbG93c1wiIHZhbHVlPVwie3t3b3JrZmxvdy5pZH19XCI+e3t3b3JrZmxvdy5pZH19IC0ge3t3b3JrZmxvdy50aXRsZX19PC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJyAgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0ud29ya2Zsb3cuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLndvcmtmbG93LiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHdvcmtmbG93IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiYXNzaWduZWVcIj5Bc3NpZ25lZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5hc3NpZ25lZVwiIG5hbWU9XCJhc3NpZ25lZVwiIGlkPVwiYXNzaWduZWVcIj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiIHZhbHVlPVwie3t3b3JrZXIuaWR9fVwiPnt7d29ya2VyLm5hbWV9fSAoe3t3b3JrZXIucG9zaXRpb259fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPlRpdGxlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5wdXRUaXRsZVwiIG5hbWU9XCJ0aXRsZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC50aXRsZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0udGl0bGUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLnRpdGxlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgdGl0bGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0QWRkcmVzc1wiPkFkZHJlc3M8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgIGlkPVwiaW5wdXRBZGRyZXNzXCIgbmFtZT1cImFkZHJlc3NcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuYWRkcmVzc1wiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0uYWRkcmVzcy4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5hZGRyZXNzLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkFuIGFkZHJlc3MgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGxheW91dC1ndC1zbT1cInJvd1wiPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRBZGRyZXNzXCI+TGF0dGl0dWRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgIGlkPVwiaW5wdXRMYXR0aXR1ZGVcIiBuYW1lPVwibGF0dGl0dWRlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmxvY2F0aW9uWzBdXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5sYXR0aXR1ZGUuJGVycm9yXCIgbmctc2hvdz1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0ubGF0dGl0dWRlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkFuIGxhdHRpdHVkZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRBZGRyZXNzXCI+TG9uZ2l0dWRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgIGlkPVwiaW5wdXRMYXR0aXR1ZGVcIiBuYW1lPVwibG9uZ2l0dWRlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmxvY2F0aW9uWzFdXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5sb25naXR1ZGUuJGVycm9yXCIgbmctc2hvdz1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0ubG9uZ2l0dWRlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkFuIGxvbmdpdHVkZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0LWd0LXNtPVwicm93XCI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dEZpbmlzaERhdGVcIj5GaW5pc2ggRGF0ZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiAgaWQ9XCJpbnB1dEZpbmlzaERhdGVcIiBuYW1lPVwiZmluaXNoRGF0ZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5maW5pc2hEYXRlXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5maW5pc2hEYXRlLiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLmZpbmlzaERhdGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBmaW5pc2ggZGF0ZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRGaW5pc2hUaW1lXCIgPkZpbmlzaCBUaW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGltZVwiICBpZD1cImlucHV0RmluaXNoVGltZVwiIG5hbWU9XCJmaW5pc2hUaW1lXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmZpbmlzaFRpbWVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmZpbmlzaFRpbWUuJGVycm9yXCIgbmctc2hvdz1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0uZmluaXNoVGltZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIGZpbmlzaCB0aW1lIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1jbGFzcz1cInsgXFwnaGFzLWVycm9yXFwnIDogd29ya29yZGVyRm9ybS5zdW1tYXJ5LiRpbnZhbGlkICYmICF3b3Jrb3JkZXJGb3JtLnN1bW1hcnkuJHByaXN0aW5lIH1cIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dFN1bW1hcnlcIj5TdW1tYXJ5PC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDx0ZXh0YXJlYSBpZD1cImlucHV0U3VtbWFyeVwiIG5hbWU9XCJzdW1tYXJ5XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN1bW1hcnlcIiByZXF1aXJlZCBtZC1tYXhsZW5ndGg9XCIxNTBcIj48L3RleHRhcmVhPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLnN1bW1hcnkuJGVycm9yXCIgbmctc2hvdz1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0uc3VtbWFyeS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHN1bW1hcnkgZGF0ZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPnt7Y3RybC5tb2RlbC5pZCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtvcmRlcjwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLWxpc3QudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+V29ya29yZGVyczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCIgaGlkZS14cyBoaWRlLXNtPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPjwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCIgbmctbW9kZWw9XCJzZWFyY2hWYWx1ZVwiIG5nLWNoYW5nZT1cImN0cmwuYXBwbHlGaWx0ZXIoc2VhcmNoVmFsdWUpXCI+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1saXN0PlxcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW1cXG4nICtcbiAgICAnICAgIG5nLXJlcGVhdD1cIndvcmtvcmRlciBpbiBjdHJsLndvcmtvcmRlcnNcIlxcbicgK1xuICAgICcgICAgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtvcmRlcigkZXZlbnQsIHdvcmtvcmRlcilcIlxcbicgK1xuICAgICcgICAgbmctY2xhc3M9XCJ7YWN0aXZlOiBjdHJsLnNlbGVjdGVkLmlkID09PSB3b3Jrb3JkZXIuaWR9XCJcXG4nICtcbiAgICAnICAgIGNsYXNzPVwibWQtMy1saW5lIHdvcmtvcmRlci1pdGVtXCJcXG4nICtcbiAgICAnICA+XFxuJyArXG4gICAgJzwhLS1cXG4nICtcbiAgICAnICBUT0RPOiBjaGFuZ2UgY2xhc3MgbmFtZSBhY2NvcmRpbmcgdG8gdGhlIGNvbG9yOlxcbicgK1xuICAgICcgICAgXCJzdWNjZXNzXCIgPSBncmVlblxcbicgK1xuICAgICcgICAgZGFuZ2VyID0gXCJyZWRcIlxcbicgK1xuICAgICcgICAgd2FybmluZyA9IFwieWVsbG93XCJcXG4nICtcbiAgICAnICAgIG5vIGNsYXNzID0gZ3JleVxcbicgK1xuICAgICcgIC0tPlxcbicgK1xuICAgICcgIDx3b3Jrb3JkZXItc3RhdHVzIGNsYXNzPVwiXCIgc3RhdHVzPVwiY3RybC5yZXN1bHRNYXBbd29ya29yZGVyLmlkXS5zdGF0dXNcIj48L3dvcmtvcmRlci1zdGF0dXM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgICB7e3dvcmtvcmRlci50eXBlfX0gLVxcbicgK1xuICAgICcgICAgICAgIDxzcGFuIG5nLWlmPVwid29ya29yZGVyLmlkXCI+e3t3b3Jrb3JkZXIuaWR9fTwvc3Bhbj5cXG4nICtcbiAgICAnICAgICAgICA8c3BhbiBuZy1pZj1cIiEgd29ya29yZGVyLmlkXCIgc3R5bGU9XCJmb250LXN0eWxlOiBpdGFsaWM7XCI+Jmx0O2xvY2FsJmd0Ozwvc3Bhbj5cXG4nICtcbiAgICAnICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgICAgPGg0Pnt7d29ya29yZGVyLnRpdGxlfX08L2g0PlxcbicgK1xuICAgICcgICAgICA8cD57e3dvcmtvcmRlci5hZGRyZXNzfX08L3A+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICcgIDxtZC1saXN0PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8d29ya29yZGVyLXN0YXR1cyBzdGF0dXM9XCJzdGF0dXNcIj48L3dvcmtvcmRlci1zdGF0dXM+XFxuJyArXG4gICAgJyAgICA8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgPGgzPnt7c3RhdHVzIHx8IFwiTmV3XCJ9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgPHA+U3RhdHVzPC9wPlxcbicgK1xuICAgICcgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmUgbWQtbG9uZy10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5wbGFjZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgIDxoMz57e3dvcmtvcmRlci5sb2NhdGlvblswXX19LCB7e3dvcmtvcmRlci5sb2NhdGlvblsxXX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgPHA+XFxuJyArXG4gICAgJyAgICAgICAgICAge3t3b3Jrb3JkZXIuYWRkcmVzc319XFxuJyArXG4gICAgJyAgICAgICAgIDwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+YXNzaWdubWVudDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7d29ya29yZGVyLnRpdGxlfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPldvcmtvcmRlcjwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+ZXZlbnQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3dvcmtvcmRlci5zdGFydFRpbWVzdGFtcCB8IGRhdGU6XFwneXl5eS1NTS1kZFxcJyB9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+RmluaXNoIERhdGU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnNjaGVkdWxlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3t3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXAgfCBkYXRlOlxcJ0hIOm1tOnNzIFpcXCcgfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkZpbmlzaCBUaW1lPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiBuZy1zaG93PVwiYXNzaWduZWUgJiYgYXNzaWduZWUubmFtZVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cGVyc29uPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3thc3NpZ25lZS5uYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkFzaWduZWU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDwvbWQtbGlzdD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLXN1YmhlYWRlciBjbGFzcz1cIm1kLW5vLXN0aWNreVwiPldvcmsgU3VtbWFyeTwvbWQtc3ViaGVhZGVyPlxcbicgK1xuICAgICcgIDxwIGNsYXNzPVwibWQtYm9keS0xXCIgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj5cXG4nICtcbiAgICAnICAgIHt7d29ya29yZGVyLnN1bW1hcnl9fVxcbicgK1xuICAgICcgIDwvcD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbnZhciBnZXRTdGF0dXNJY29uID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gIHZhciBzdGF0dXNJY29uO1xuICBzd2l0Y2goc3RhdHVzKSB7XG4gICAgY2FzZSAnSW4gUHJvZ3Jlc3MnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhdXRvcmVuZXcnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQ29tcGxldGUnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhc3NpZ25tZW50X3R1cm5lZF9pbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdBYm9ydGVkJzpcbiAgICAgIHN0YXR1c0ljb24gPSAnYXNzaWdubWVudF9sYXRlJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ09uIEhvbGQnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdwYXVzZSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdVbmFzc2lnbmVkJzpcbiAgICAgIHN0YXR1c0ljb24gPSAnYXNzaWdubWVudF9pbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTmV3JzpcbiAgICAgIHN0YXR1c0ljb24gPSAnbmV3X3JlbGVhc2VzJztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0dXNJY29uID0gJ3JhZGlvX2J1dHRvbl91bmNoZWNrZWQnO1xuICB9XG4gIHJldHVybiBzdGF0dXNJY29uO1xufVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3dvcmtvcmRlckxpc3QnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgd29ya29yZGVycyA6ICc9JyxcbiAgICAgIHJlc3VsdE1hcDogJz0nLFxuICAgICAgc2VsZWN0ZWRNb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnM7XG4gICAgICAkc2NvcGUuJHdhdGNoKCd3b3Jrb3JkZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYud29ya29yZGVycyA9ICRzY29wZS53b3Jrb3JkZXJzO1xuICAgICAgfSlcbiAgICAgIHNlbGYucmVzdWx0TWFwID0gJHNjb3BlLnJlc3VsdE1hcDtcbiAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgIHNlbGYuc2VsZWN0V29ya29yZGVyID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgICAgICAvLyBzZWxmLnNlbGVjdGVkV29ya29yZGVySWQgPSB3b3Jrb3JkZXIuaWQ7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCB3b3Jrb3JkZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNXb3Jrb3JkZXJTaG93biA9IGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bldvcmtvcmRlciA9PT0gd29ya29yZGVyO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya29yZGVyLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKHdvcmtvcmRlci50aXRsZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXIudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgd29ya29yZGVyOiAnPScsXG4gICAgYXNzaWduZWU6ICc9JyxcbiAgICBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2hvd1NlbGVjdEJ1dHRvbiA9ICEhICRzY29wZS4kcGFyZW50LndvcmtvcmRlcnM7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtvcmRlckZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1mb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgIHdvcmtvcmRlciA6ICc9dmFsdWUnXG4gICwgd29ya2Zsb3dzOiAnPSdcbiAgLCB3b3JrZXJzOiAnPSdcbiAgLCBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtvcmRlcik7XG4gICAgICBzZWxmLndvcmtmbG93cyA9ICRzY29wZS53b3JrZmxvd3M7XG4gICAgICBzZWxmLndvcmtlcnMgPSAkc2NvcGUud29ya2VycztcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBpZiAoc2VsZi5tb2RlbCAmJiBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKSB7XG4gICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKTtcbiAgICAgIH07XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wID0gbmV3IERhdGUoc2VsZi5tb2RlbC5maW5pc2hEYXRlKTsgLy8gVE9ETzogaW5jb3Jwb3JhdGUgc2VsZi5tb2RlbC5maW5pc2hUaW1lXG4gICAgICAgICAgc2VsZi5tb2RlbC5zdGFydFRpbWVzdGFtcC5zZXRIb3VycyhcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRIb3VycygpLFxuICAgICAgICAgICAgc2VsZi5tb2RlbC5maW5pc2hUaW1lLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRTZWNvbmRzKCksXG4gICAgICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd3b3Jrb3JkZXJTdGF0dXMnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICc8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+e3tzdGF0dXNJY29ufX08bWQtdG9vbHRpcD57e3N0YXR1c319PC9tZC10b29sdGlwPjwvbWQtaWNvbj4nXG4gICwgc2NvcGU6IHtcbiAgICAgIHN0YXR1cyA6ICc9c3RhdHVzJ1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICRzY29wZS5zdGF0dXNJY29uID0gZ2V0U3RhdHVzSWNvbigkc2NvcGUuc3RhdHVzKTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfVxufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyU3VibWlzc2lvblJlc3VsdCcsIGZ1bmN0aW9uKCRjb21waWxlKSB7XG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBpZiAoIXNjb3BlLnJlc3VsdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gc2NvcGUucmVzdWx0O1xuICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuICAgIGlmIChzY29wZS5zdGVwLmZvcm1JZCkge1xuICAgICAgdmFyIHN1Ym1pc3Npb24gPSByZXN1bHQuc3VibWlzc2lvbjtcbiAgICAgIHZhciB0YWcsIHN1YklkO1xuICAgICAgaWYgKHN1Ym1pc3Npb24uX3N1Ym1pc3Npb24pIHtcbiAgICAgICAgdGFnID0gJ3N1Ym1pc3Npb24nO1xuICAgICAgICBzdWJJZCA9IHN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cbiAgICAgICAgdGVtcGxhdGUgPSAnPGFwcGZvcm0tc3VibWlzc2lvbiBzdWJtaXNzaW9uPVwicmVzdWx0LnN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25JZCkge1xuICAgICAgICB0ZW1wbGF0ZSA9ICc8YXBwZm9ybS1zdWJtaXNzaW9uIHN1Ym1pc3Npb24taWQ9XCJcXCcnK3N1Ym1pc3Npb24uc3VibWlzc2lvbklkKydcXCdcIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgICAgIHRlbXBsYXRlID0gJzxhcHBmb3JtLXN1Ym1pc3Npb24gc3VibWlzc2lvbi1sb2NhbC1pZD1cIlxcJycrc3VibWlzc2lvbi5zdWJtaXNzaW9uTG9jYWxJZCsnXFwnXCI+PC9hcHBmb3JtLXN1Ym1pc3Npb24+JztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlID0gc2NvcGUuc3RlcC50ZW1wbGF0ZXMudmlldztcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmQodGVtcGxhdGUpO1xuICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHNjb3BlOiB7XG4gICAgICByZXN1bHQ6ICc9J1xuICAgICwgc3RlcDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJlbmRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLndvcmtvcmRlci5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5uZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHdvcmtvcmRlciA9IHtcbiAgICAgICAgdHlwZTogJ0pvYiBPcmRlcidcbiAgICAgICwgc3RhdHVzOiAnTmV3J1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUod29ya29yZGVyKTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLnN5bmMnLCBbcmVxdWlyZSgnZmgtd2ZtLXN5bmMnKV0pXG4uZmFjdG9yeSgnd29ya29yZGVyU3luYycsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgc3luY1NlcnZpY2UpIHtcbiAgc3luY1NlcnZpY2UuaW5pdCgkZmgsIGNvbmZpZy5zeW5jT3B0aW9ucyk7XG4gIHZhciB3b3Jrb3JkZXJTeW5jID0ge307XG4gIHdvcmtvcmRlclN5bmMuY3JlYXRlTWFuYWdlciA9IGZ1bmN0aW9uKHF1ZXJ5UGFyYW1zKSB7XG4gICAgaWYgKHdvcmtvcmRlclN5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuICRxLndoZW4od29ya29yZGVyU3luYy5tYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHdvcmtvcmRlclN5bmMubWFuYWdlclByb21pc2UgPSBzeW5jU2VydmljZS5tYW5hZ2UoY29uZmlnLmRhdGFzZXRJZCwgbnVsbCwgcXVlcnlQYXJhbXMpXG4gICAgICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgICAgIHdvcmtvcmRlclN5bmMubWFuYWdlciA9IHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcik7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTeW5jIGlzIG1hbmFnaW5nIGRhdGFzZXQ6JywgY29uZmlnLmRhdGFzZXRJZCwgJ3dpdGggZmlsdGVyOiAnLCBxdWVyeVBhcmFtcyk7XG4gICAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgd29ya29yZGVyU3luYy5yZW1vdmVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHdvcmtvcmRlclN5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuIHdvcmtvcmRlclN5bmMubWFuYWdlci5zYWZlU3RvcCgpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIHdvcmtvcmRlclN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHJldHVybiB3b3Jrb3JkZXJTeW5jO1xufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ud29ya29yZGVyJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXInLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zeW5jLXNlcnZpY2UnKVxuXSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS93b3Jrb3JkZXInLFxuICBkYXRhc2V0SWQgOiAnd29ya29yZGVycycsXG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCdkMycpXG52YXIgYzMgPSByZXF1aXJlKCdjMycpXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuYW5hbHl0aWNzJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5hbmFseXRpY3MnLCBbXG4gICd1aS5yb3V0ZXInLFxuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuYW5hbHl0aWNzJywge1xuICAgICAgdXJsOiAnL2FuYWx5dGljcycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYW5hbHl0aWNzL2FuYWx5dGljcy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2FuYWx5dGljc0NvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG59KVxuXG4uY29udHJvbGxlcignYW5hbHl0aWNzQ29udHJvbGxlcicsIGZ1bmN0aW9uICh3b3Jrb3JkZXJzLCB3b3JrZXJzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcblxuICAvL2FkZCBmYWtlIGRhdGEgZm9yIGJhciBjaGFydHNcbiAgc2VsZi53b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgdmFyIGVzdGltYXRlZCAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgIHZhciByZWFsID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICB3b3Jrb3JkZXIuZXN0aW1hdGVkSG91cnMgPSBlc3RpbWF0ZWQ7XG4gICAgd29ya29yZGVyLmVmZmVjdGl2ZUhvdXJzID0gcmVhbDtcbiAgfSk7XG5cbiAgdmFyIGFyZWFDaGFydCA9IGMzLmdlbmVyYXRlKHtcbiAgICBiaW5kdG86ICcjYXJlYS1jaGFydCcsXG4gICAgc2l6ZToge1xuICAgICAgd2lkdGg6IDQ1MFxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgY29sdW1uczogW1xuICAgICAgICBbJ2RhdGExJywgMzAwLCAzNTAsIDMwMCwgMCwgMCwgMF0sXG4gICAgICAgIFsnZGF0YTInLCAxMzAsIDEwMCwgMTQwLCAyMDAsIDE1MCwgNTBdXG4gICAgICBdLFxuICAgIHR5cGVzOiB7XG4gICAgICBkYXRhMTogJ2FyZWEnLFxuICAgICAgZGF0YTI6ICdhcmVhLXNwbGluZSdcbiAgICB9XG4gIH1cbn0pO1xuXG59KVxuXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYXBwZm9ybScsIFsndWkucm91dGVyJ10pXG5cbi5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuYXBwZm9ybS5kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvYXBwZm9ybS86Zm9ybUlkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hcHBmb3JtL2FwcGZvcm0udHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdBcHBmb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgZm9ybTogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50LmdldEZvcm0oJHN0YXRlUGFyYW1zLmZvcm1JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5hcHBmb3JtJywge1xuICAgICAgdXJsOiAnL2FwcGZvcm1zJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hcHBmb3JtL2FwcGZvcm0tbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0FwcGZvcm1MaXN0Q29udHJvbGxlcicsXG4gICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgZm9ybXM6IGZ1bmN0aW9uKGFwcGZvcm1DbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFwcGZvcm1DbGllbnQubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ0FwcGZvcm1Db250cm9sbGVyJywgZnVuY3Rpb24oJHEsIGZvcm0pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmZvcm0gPSBmb3JtO1xufSlcblxuLmNvbnRyb2xsZXIoJ0FwcGZvcm1MaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRxLCAkc3RhdGUsIGZvcm1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5mb3JtcyA9IGZvcm1zO1xuICBzZWxmLnNlbGVjdEZvcm0gPSBmdW5jdGlvbihldmVudCwgZm9ybSkge1xuICAgIHNlbGYuc2VsZWN0ZWRGb3JtSWQgPSBmb3JtLl9pZDtcbiAgICAkc3RhdGUuZ28oJ2FwcC5hcHBmb3JtLmRldGFpbCcsIHtmb3JtSWQ6IGZvcm0uX2lkfSk7XG4gIH07XG5cbiAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuICAgIHNlbGYuZm9ybXMgPSBmb3Jtcy5maWx0ZXIoZnVuY3Rpb24oZm9ybSkge1xuICAgICAgcmV0dXJuIFN0cmluZyhmb3JtLm5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgfHwgU3RyaW5nKGZvcm0uZGVzY3JpcHRpb24pLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgfHwgU3RyaW5nKGZvcm0uX2lkKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICB9KTtcbiAgfTtcblxuXG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5hcHBmb3JtJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuYXV0aCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYXV0aCcsIFtcbiAgJ3VpLnJvdXRlcicsXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9sb2dpbi50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBoYXNTZXNzaW9uOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLnByb2ZpbGUnLCB7XG4gICAgICB1cmw6ICcvcHJvZmlsZScsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9wcm9maWxlLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUN0cmwgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSwgdXNlckNsaWVudCwgaGFzU2Vzc2lvbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5oYXNTZXNzaW9uID0gaGFzU2Vzc2lvbjtcblxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24odmFsaWQpIHtcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHVzZXJDbGllbnQuYXV0aChzZWxmLnVzZXJuYW1lLCBzZWxmLnBhc3N3b3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICBzZWxmLmxvZ2luTWVzc2FnZXMuZXJyb3IgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZi5sb2dpbk1lc3NhZ2VzID0ge3N1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZmFsc2V9O1xuXG4gIHNlbGYubG9naW4gPSBmdW5jdGlvbih2YWxpZCkge1xuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB1c2VyQ2xpZW50LmF1dGgoc2VsZi51c2VybmFtZSwgc2VsZi5wYXNzd29yZClcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKGhhc1Nlc3Npb24pIHtcbiAgICAgIHNlbGYuaGFzU2Vzc2lvbiA9IGhhc1Nlc3Npb247XG4gICAgICBpZiAoJHJvb3RTY29wZS50b1N0YXRlKSB7XG4gICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnRvU3RhdGUsICRyb290U2NvcGUudG9QYXJhbXMpO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1N0YXRlO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1BhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcicpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgc2VsZi5sb2dpbk1lc3NhZ2VzLmVycm9yID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgdXNlckNsaWVudC5jbGVhclNlc3Npb24oKVxuICAgIC50aGVuKHVzZXJDbGllbnQuaGFzU2Vzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihoYXNTZXNzaW9uKSB7XG4gICAgICBzZWxmLmhhc1Nlc3Npb24gPSBoYXNTZXNzaW9uO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnIoZXJyKTtcbiAgICB9KTtcbiAgfVxufSlcblxuLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oKSB7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5maWxlJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5maWxlJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuZmlsZScsIHtcbiAgICAgIHVybDogJy9maWxlcycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGZpbGVzOiBmdW5jdGlvbihmaWxlQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGVDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZXJNYXA6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCkudGhlbihmdW5jdGlvbih3b3JrZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gd29ya2Vycy5yZWR1Y2UoZnVuY3Rpb24obWFwLCB3b3JrZXIpIHtcbiAgICAgICAgICAgICAgbWFwW3dvcmtlci5pZF0gPSB3b3JrZXI7XG4gICAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZmlsZS9maWxlLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdGaWxlTGlzdENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgIH0sXG4gICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2ZpbGUvZW1wdHkudHBsLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmZpbGUuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2RldGFpbC86ZmlsZVVpZCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGZpbGU6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZmlsZXMpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnVpZCA9PT0gJHN0YXRlUGFyYW1zLmZpbGVVaWQ7XG4gICAgICAgICAgfSlbMF07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZmlsZS9maWxlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0ZpbGVDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmZpbGU6c2VsZWN0ZWQnLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAuZmlsZS5kZXRhaWwnLCB7XG4gICAgICBmaWxlVWlkOiBmaWxlLnVpZH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignRmlsZUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgZmlsZXMsIHdvcmtlck1hcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbiAgc2VsZi5maWxlcyA9IGZpbGVzO1xuICBzZWxmLndvcmtlck1hcCA9IHdvcmtlck1hcDtcbn0pXG5cbi5jb250cm9sbGVyKCdGaWxlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGZpbGUsIHdvcmtlck1hcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBmaWxlLmlkfTtcbiAgc2VsZi5maWxlID0gZmlsZTtcbiAgc2VsZi53b3JrZXJNYXAgPSB3b3JrZXJNYXA7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5ncm91cCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuZ3JvdXAnLCBbXG4gICd1aS5yb3V0ZXInXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5ncm91cCcsIHtcbiAgICAgIHVybDogJy9ncm91cHMnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lbWJlcnNoaXA6IGZ1bmN0aW9uKG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZ3JvdXAtbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2dyb3VwTGlzdENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZW1wdHkudHBsLmh0bWwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5ncm91cC5kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvZ3JvdXAvOmdyb3VwSWQnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBncm91cDogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBncm91cHMpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBzLmZpbHRlcihmdW5jdGlvbihncm91cCkge1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhncm91cC5pZCkgPT09IFN0cmluZygkc3RhdGVQYXJhbXMuZ3JvdXBJZCk7XG4gICAgICAgICAgfSlbMF07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZ3JvdXAtZGV0YWlsLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnZ3JvdXBEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmdyb3VwLmVkaXQnLCB7XG4gICAgICB1cmw6ICcvZ3JvdXAvOmdyb3VwSWQvZWRpdCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGdyb3VwOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGdyb3Vwcykge1xuICAgICAgICAgIHJldHVybiBncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGdyb3VwLmlkKSA9PT0gU3RyaW5nKCRzdGF0ZVBhcmFtcy5ncm91cElkKTtcbiAgICAgICAgICB9KVswXTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9ncm91cC1lZGl0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnZ3JvdXBGb3JtQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAuZ3JvdXAubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGdyb3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4ge31cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9ncm91cC1lZGl0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnZ3JvdXBGb3JtQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmdyb3VwOnNlbGVjdGVkJywgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cC5kZXRhaWwnLCB7XG4gICAgICBncm91cElkOiBncm91cC5pZFxuICAgIH0pO1xuICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06Z3JvdXA6bGlzdCcsIGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAuZ3JvdXAnLCBudWxsLCB7cmVsb2FkOiB0cnVlfSk7XG4gIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ2dyb3VwTGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBtZWRpYXRvciwgZ3JvdXBzKSB7XG4gIHRoaXMuZ3JvdXBzID0gZ3JvdXBzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG59KVxuXG4uY29udHJvbGxlcignZ3JvdXBEZXRhaWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkbWREaWFsb2csIG1lZGlhdG9yLCBncm91cCwgdXNlcnMsIG1lbWJlcnNoaXAsIGdyb3VwQ2xpZW50KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5ncm91cCA9IGdyb3VwO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSBncm91cC5pZDtcbiAgdmFyIGdyb3VwTWVtYmVyc2hpcCA9IG1lbWJlcnNoaXAuZmlsdGVyKGZ1bmN0aW9uKF9tZW1iZXJzaGlwKSB7XG4gICAgcmV0dXJuIF9tZW1iZXJzaGlwLmdyb3VwID09IGdyb3VwLmlkXG4gIH0pO1xuICBzZWxmLm1lbWJlcnMgPSB1c2Vycy5maWx0ZXIoZnVuY3Rpb24odXNlcikge1xuICAgIHJldHVybiBfLnNvbWUoZ3JvdXBNZW1iZXJzaGlwLCBmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgICAgcmV0dXJuIF9tZW1iZXJzaGlwLnVzZXIgPT0gdXNlci5pZDtcbiAgICB9KVxuICB9KTtcbiAgc2VsZi5kZWxldGUgPSBmdW5jdGlvbigkZXZlbnQsIGdyb3VwKSB7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYoc2VsZi5tZW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBhbGVydCA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAgIC50aXRsZSgnT3BlcmF0aW9uIG5vdCBwb3NzaWJsZScpXG4gICAgICAgICAgICAudGV4dENvbnRlbnQoJ0dyb3VwIGNhbiBub3QgYmUgZGVsZXRlZCBpZiBpdCBjb250YWlucyBtZW1iZXJzLicpXG4gICAgICAgICAgICAub2soJ09rJylcbiAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xuICAgICAgJG1kRGlhbG9nLnNob3coYWxlcnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgICAgLnRpdGxlKCdXb3VsZCB5b3UgbGlrZSB0byBkZWxldGUgZ3JvdXAgIycrZ3JvdXAuaWQrJz8nKVxuICAgICAgICAgICAgLnRleHRDb250ZW50KGdyb3VwLm5hbWUpXG4gICAgICAgICAgICAuYXJpYUxhYmVsKCdEZWxldGUgR3JvdXAnKVxuICAgICAgICAgICAgLnRhcmdldEV2ZW50KCRldmVudClcbiAgICAgICAgICAgIC5vaygnUHJvY2VlZCcpXG4gICAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGdyb3VwQ2xpZW50LmRlbGV0ZShncm91cCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cCcsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSlcblxuLmNvbnRyb2xsZXIoJ2dyb3VwRm9ybUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHN0YXRlLCAkc2NvcGUsIG1lZGlhdG9yLCBncm91cCwgZ3JvdXBDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmdyb3VwID0gZ3JvdXA7XG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06Z3JvdXA6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICByZXR1cm4gZ3JvdXBDbGllbnQudXBkYXRlKGdyb3VwKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cC5kZXRhaWwnLCB7Z3JvdXBJZDogc2VsZi5ncm91cC5pZH0sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTpncm91cDpjcmVhdGVkJywgJHNjb3BlLCBmdW5jdGlvbihncm91cCkge1xuICAgIHJldHVybiBncm91cENsaWVudC5jcmVhdGUoZ3JvdXApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNyZWF0ZWRncm91cCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwLmRldGFpbCcsIHtncm91cElkOiBjcmVhdGVkZ3JvdXAuaWR9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG59KVxuXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdhcHAuaG9tZScsIFsndWkucm91dGVyJ10pXG5cbi5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcbiAgICAgIHVybDogJy9ob21lJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ob21lL2hvbWUudHBsLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5ob21lJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnJlcXVpcmUoJ2ZlZWRoZW5yeScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICByZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpXG4sIHJlcXVpcmUoJ2FuZ3VsYXItbWF0ZXJpYWwnKVxuLCByZXF1aXJlKCdmaC13Zm0tbWVkaWF0b3InKVxuLCByZXF1aXJlKCdmaC13Zm0td29ya29yZGVyJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXJlc3VsdCcpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1tZXNzYWdlJylcbiwgcmVxdWlyZSgnZmgtd2ZtLWZpbGUnKVxuLCByZXF1aXJlKCdmaC13Zm0td29ya2Zsb3cnKVxuLCByZXF1aXJlKCdmaC13Zm0tYXBwZm9ybScpXG4sIHJlcXVpcmUoJ2ZoLXdmbS11c2VyJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXJpc2stYXNzZXNzbWVudCcpXG4sIHJlcXVpcmUoJ2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24nKVxuLCByZXF1aXJlKCdmaC13Zm0tbWFwJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXNjaGVkdWxlJylcbiwgcmVxdWlyZSgnZmgtd2ZtLWFuYWx5dGljcycpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1jYW1lcmEnKVxuXG4sIHJlcXVpcmUoJy4vYXV0aC9hdXRoJylcbiwgcmVxdWlyZSgnLi93b3Jrb3JkZXIvd29ya29yZGVyJylcbiwgcmVxdWlyZSgnLi93b3JrZmxvdy93b3JrZmxvdycpXG4sIHJlcXVpcmUoJy4vaG9tZS9ob21lJylcbiwgcmVxdWlyZSgnLi9hcHBmb3JtL2FwcGZvcm0nKVxuLCByZXF1aXJlKCcuL3dvcmtlci93b3JrZXInKVxuLCByZXF1aXJlKCcuL2dyb3VwL2dyb3VwJylcbiwgcmVxdWlyZSgnLi9tZXNzYWdlL21lc3NhZ2UnKVxuLCByZXF1aXJlKCcuL2ZpbGUvZmlsZScpXG4sIHJlcXVpcmUoJy4vc2NoZWR1bGUvc2NoZWR1bGUnKVxuLCByZXF1aXJlKCcuL21hcC9tYXAnKVxuLCByZXF1aXJlKCcuL2FuYWx5dGljcy9hbmFseXRpY3MnKVxuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93b3Jrb3JkZXJzL2xpc3QnKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tYWluLnRwbC5odG1sJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY29sdW1uczogM1xuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya29yZGVyTWFuYWdlcjogZnVuY3Rpb24od29ya29yZGVyU3luYykge1xuICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgd29ya2Zsb3dNYW5hZ2VyOiBmdW5jdGlvbih3b3JrZmxvd1N5bmMpIHtcbiAgICAgICAgICByZXR1cm4gd29ya2Zsb3dTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZU1hbmFnZXI6IGZ1bmN0aW9uKG1lc3NhZ2VTeW5jKSB7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJvZmlsZURhdGE6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5nZXRQcm9maWxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJG1kU2lkZW5hdiwgbWVkaWF0b3IsIHByb2ZpbGVEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb2ZpbGVEYXRhJywgcHJvZmlsZURhdGEpO1xuICAgICAgICAkc2NvcGUucHJvZmlsZURhdGEgPSBwcm9maWxlRGF0YTtcbiAgICAgICAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXV0aDpwcm9maWxlOmNoYW5nZScsIGZ1bmN0aW9uKF9wcm9maWxlRGF0YSkge1xuICAgICAgICAgICRzY29wZS5wcm9maWxlRGF0YSA9IF9wcm9maWxlRGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlbmF2ID0gZnVuY3Rpb24oZXZlbnQsIG1lbnVJZCkge1xuICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLm5hdmlnYXRlVG8gPSBmdW5jdGlvbihzdGF0ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoJG1kU2lkZW5hdignbGVmdCcpLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgICRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzdGF0ZS5nbyhzdGF0ZSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkcSwgbWVkaWF0b3IsIHVzZXJDbGllbnQpIHtcbiAgdmFyIGluaXRQcm9taXNlcyA9IFtdO1xuICB2YXIgaW5pdExpc3RlbmVyID0gbWVkaWF0b3Iuc3Vic2NyaWJlKCdwcm9taXNlOmluaXQnLCBmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgaW5pdFByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gIH0pO1xuICBtZWRpYXRvci5wdWJsaXNoKCdpbml0Jyk7XG4gIGNvbnNvbGUubG9nKGluaXRQcm9taXNlcy5sZW5ndGgsICdpbml0IHByb21pc2VzIHRvIHJlc29sdmUuJyk7XG4gIHZhciBhbGwgPSAoaW5pdFByb21pc2VzLmxlbmd0aCA+IDApID8gJHEuYWxsKGluaXRQcm9taXNlcykgOiAkcS53aGVuKG51bGwpO1xuICBhbGwudGhlbihmdW5jdGlvbigpIHtcbiAgICAkcm9vdFNjb3BlLnJlYWR5ID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhpbml0UHJvbWlzZXMubGVuZ3RoLCAnaW5pdCBwcm9taXNlcyByZXNvbHZlZC4nKTtcbiAgICBtZWRpYXRvci5yZW1vdmUoJ3Byb21pc2U6aW5pdCcsIGluaXRMaXN0ZW5lci5pZCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGUsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICBpZih0b1N0YXRlLm5hbWUgIT09IFwiYXBwLmxvZ2luXCIpe1xuICAgICAgdXNlckNsaWVudC5oYXNTZXNzaW9uKCkudGhlbihmdW5jdGlvbihoYXNTZXNzaW9uKSB7XG4gICAgICAgIGlmKCFoYXNTZXNzaW9uKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRyb290U2NvcGUudG9TdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgJHJvb3RTY29wZS50b1BhcmFtcyA9IHRvUGFyYW1zO1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdGF0ZSBjaGFuZ2UgZXJyb3I6ICcsIGVycm9yLCB7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICB0b1N0YXRlOiB0b1N0YXRlLFxuICAgICAgdG9QYXJhbXM6IHRvUGFyYW1zLFxuICAgICAgZnJvbVN0YXRlOiBmcm9tU3RhdGUsXG4gICAgICBmcm9tUGFyYW1zOiBmcm9tUGFyYW1zLFxuICAgICAgZXJyb3I6IGVycm9yXG4gICAgfSk7XG4gICAgaWYgKGVycm9yWydnZXQgc3RhY2snXSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvclsnZ2V0IHN0YWNrJ10oKSk7XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLm1hcCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAubWFwJywgW1xuICAndWkucm91dGVyJyxcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcbiAgICAgIHVybDogJy9tYXAnLFxuICAgICAgZGF0YToge1xuICAgICAgICBjb2x1bW5zOiAyXG4gICAgICB9LFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21hcC9tYXAudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdtYXBDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0pXG59KVxuXG4uY29udHJvbGxlcignbWFwQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCB3b3Jrb3JkZXJzKSB7XG4gIHRoaXMuY2VudGVyID0gWzQ5LjI3LCAtMTIzLjA4XTtcbiAgdGhpcy53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbn0pXG5cbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnYW5ndWxhci1tZXNzYWdlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAubWVzc2FnZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAubWVzc2FnZScsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgICAuc3RhdGUoJ2FwcC5tZXNzYWdlJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2VzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tZXNzYWdlL21lc3NhZ2UtbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ01lc3NhZ2VMaXN0Q29udHJvbGxlciBhcyBtZXNzYWdlTGlzdENvbnRyb2xsZXInLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBmdW5jdGlvbihtZXNzYWdlTWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZU1hbmFnZXIubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2UvOm1lc3NhZ2VJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgbWVzc2FnZU1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLm1lc3NhZ2VJZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLW5ldy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VOZXdDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2VNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5uZXcoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTptZXNzYWdlOnNlbGVjdGVkJywgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICRzdGF0ZS5nbygnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlLmlkIHx8IG1lc3NhZ2UuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignTWVzc2FnZUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVzc2FnZXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG4gIHNlbGYubWVzc2FnZXMgPSBtZXNzYWdlcztcbn0pXG5cbi5jb250cm9sbGVyKCdtZXNzYWdlRGV0YWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lc3NhZ2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICBtZXNzYWdlLnN0YXR1cyA9IFwicmVhZFwiO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSBtZXNzYWdlLmlkO1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uIChtZWRpYXRvcikge1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VOZXdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgbWVzc2FnZU1hbmFnZXIsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOm1lc3NhZ2U6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIG1lc3NhZ2Uuc2VuZGVyID0gJHNjb3BlLnByb2ZpbGVEYXRhO1xuICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5jcmVhdGUobWVzc2FnZSkudGhlbihmdW5jdGlvbihfbWVzc2FnZSkge1xuICAgICAgJHN0YXRlLmdvKCdhcHAubWVzc2FnZScsIHt3b3JrZXJzOiB3b3JrZXJzfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgIH0pXG4gIH0pO1xufSlcbjtcbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5tZXNzYWdlJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuc2NoZWR1bGUnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnNjaGVkdWxlJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuc2NoZWR1bGUnLCB7XG4gICAgICB1cmw6ICcvc2NoZWR1bGUnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICBjb2x1bW5zOiAyXG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NjaGVkdWxlL3NjaGVkdWxlLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnc2NoZWR1bGVDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ3NjaGVkdWxlQ29udHJvbGxlcicsIGZ1bmN0aW9uIChtZWRpYXRvciwgd29ya29yZGVyTWFuYWdlciwgd29ya29yZGVycywgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya29yZGVycyA9IHdvcmtvcmRlcnM7XG4gIHNlbGYud29ya2VycyA9IHdvcmtlcnM7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOnNjaGVkdWxlOndvcmtvcmRlcicsIGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgIHdvcmtvcmRlck1hbmFnZXIudXBkYXRlKHdvcmtvcmRlcikudGhlbihmdW5jdGlvbih1cGRhdGVkV29ya29yZGVyKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTpzY2hlZHVsZTp3b3Jrb3JkZXI6JyArIHdvcmtvcmRlci5pZCwgdXBkYXRlZFdvcmtvcmRlcik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9KVxufSlcblxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3JrZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLndvcmtlcicsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLndvcmtlcicsIHtcbiAgICAgIHVybDogJy93b3JrZXJzJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZXJMaXN0Q29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2VyL2VtcHR5LnRwbC5odG1sJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya2VyLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3JrZXIvOndvcmtlcklkJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5yZWFkKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgd29ya29yZGVyTWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHdvcmtvcmRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJzLmZpbHRlcihmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh3b3Jrb3JkZXIuYXNzaWduZWUpID09PSBTdHJpbmcoJHN0YXRlUGFyYW1zLndvcmtlcklkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBtZXNzYWdlTWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5saXN0KCkudGhlbihmdW5jdGlvbihtZXNzYWdlcyl7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZXMuZmlsdGVyKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG1lc3NhZ2UucmVjZWl2ZXJJZCkgPT09IFN0cmluZygkc3RhdGVQYXJhbXMud29ya2VySWQpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZmlsZUNsaWVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlQ2xpZW50Lmxpc3QoKS50aGVuKGZ1bmN0aW9uKGZpbGVzKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZmlsZS5vd25lcikgPT09IFN0cmluZygkc3RhdGVQYXJhbXMud29ya2VySWQpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzaGlwOiBmdW5jdGlvbihtZW1iZXJzaGlwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckRldGFpbENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya2VyLmVkaXQnLCB7XG4gICAgICB1cmw6ICcvd29ya2VyLzp3b3JrZXJJZC9lZGl0JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5yZWFkKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VwczogZnVuY3Rpb24oZ3JvdXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzaGlwOiBmdW5jdGlvbihtZW1iZXJzaGlwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtlci93b3JrZXItZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZXIubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVtYmVyc2hpcDogZnVuY3Rpb24obWVtYmVyc2hpcENsaWVudCkge1xuICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWVkaXQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZXJGb3JtQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7XG4gICAgICB3b3JrZXJJZDogd29ya2VyLmlkXG4gICAgfSk7XG4gIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3JrZXI6bGlzdCcsIGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtlcicsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya2VyTGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBtZWRpYXRvciwgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya2VycyA9IHdvcmtlcnM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZXJEZXRhaWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtlciwgd29ya29yZGVycywgbWVzc2FnZXMsIGZpbGVzLCBtZW1iZXJzaGlwLCBncm91cHMsIHVzZXJDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlciA9IHdvcmtlcjtcbiAgc2VsZi53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbiAgc2VsZi5tZXNzYWdlcyA9ICBtZXNzYWdlcztcbiAgc2VsZi5maWxlcyA9IGZpbGVzO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSB3b3JrZXIuaWQ7XG5cbiAgdmFyIHVzZXJNZW1iZXJzaGlwID0gbWVtYmVyc2hpcC5maWx0ZXIoZnVuY3Rpb24oX21lbWJlcnNoaXApIHtcbiAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB3b3JrZXIuaWRcbiAgfSlbMF07XG4gIGlmKHVzZXJNZW1iZXJzaGlwKXtcbiAgICBzZWxmLmdyb3VwID0gZ3JvdXBzLmZpbHRlcihmdW5jdGlvbihncm91cCkge1xuICAgICAgICByZXR1cm4gdXNlck1lbWJlcnNoaXAuZ3JvdXAgPT0gZ3JvdXAuaWQ7XG4gICAgfSlbMF07XG4gIH1cblxuICBzZWxmLmRlbGV0ZSA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZXIpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIHdvcmtlciAjJyt3b3JrZXIuaWQrJz8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudCh3b3JrZXIubmFtZSlcbiAgICAgICAgICAuYXJpYUxhYmVsKCdEZWxldGUgV29ya2VyJylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgdXNlckNsaWVudC5kZWxldGUod29ya2VyKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtlcicsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KVxuICAgIH0pO1xuICB9LFxuICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICRzdGF0ZS5nbyhcbiAgICAgICdhcHAud29ya29yZGVyLmRldGFpbCcsXG4gICAgICB7IHdvcmtvcmRlcklkOiB3b3Jrb3JkZXIuaWQgfHwgd29ya29yZGVyLl9sb2NhbHVpZCB9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gIH0sXG4gIHNlbGYuc2VsZWN0TWVzc2FnZSA9ICBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAubWVzc2FnZS5kZXRhaWwnLCB7XG4gICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2UuaWQgfHwgbWVzc2FnZS5fbG9jYWx1aWQgfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICB9XG5cbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZXJGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc3RhdGUsICRzY29wZSwgbWVkaWF0b3IsIHdvcmtlciwgZ3JvdXBzLCBtZW1iZXJzaGlwLCB1c2VyQ2xpZW50LCBtZW1iZXJzaGlwQ2xpZW50KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZXIgPSB3b3JrZXI7XG4gIHNlbGYuZ3JvdXBzID0gZ3JvdXBzO1xuICAvL2lmIHdlIGFyZSB1cGRhdGluZyBsZXQncyBhc3NpZ24gdGhlIGdyb3VwXG4gIGlmKHdvcmtlci5pZCB8fCB3b3JrZXIuaWQgPT09IDApIHtcbiAgICB2YXIgdXNlck1lbWJlcnNoaXAgPSBtZW1iZXJzaGlwLmZpbHRlcihmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgICAgcmV0dXJuIF9tZW1iZXJzaGlwLnVzZXIgPT0gd29ya2VyLmlkXG4gICAgfSlbMF07XG4gICAgaWYodXNlck1lbWJlcnNoaXApe1xuICAgICAgc2VsZi53b3JrZXIuZ3JvdXAgPSBncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJNZW1iZXJzaGlwLmdyb3VwID09IGdyb3VwLmlkO1xuICAgICAgfSlbMF0uaWQ7XG4gICAgfVxuICB9XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3JrZXI6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2VyKSB7XG4gICAgcmV0dXJuIHVzZXJDbGllbnQudXBkYXRlKHdvcmtlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXBkYXRlZFdvcmtlcikge1xuICAgICAgICAgIC8vcmV0cmlldmUgdGhlIGV4aXN0aW5nIG1lbWJlcnNoaXBcbiAgICAgICAgICB2YXIgdXNlck1lbWJlcnNoaXAgPSBtZW1iZXJzaGlwLmZpbHRlcihmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgICAgICAgICAgcmV0dXJuIF9tZW1iZXJzaGlwLnVzZXIgPT0gd29ya2VyLmlkXG4gICAgICAgICAgfSlbMF07XG4gICAgICAgICAgaWYodXNlck1lbWJlcnNoaXApe1xuICAgICAgICAgICAgdXNlck1lbWJlcnNoaXAuZ3JvdXAgPSB1cGRhdGVkV29ya2VyLmdyb3VwO1xuICAgICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQudXBkYXRlKHVzZXJNZW1iZXJzaGlwKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih1cGRhdGVkTWVtYmVyc2hpcCkge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7d29ya2VySWQ6IHVwZGF0ZWRNZW1iZXJzaGlwLnVzZXJ9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGdyb3VwIDogdXBkYXRlZFdvcmtlci5ncm91cCxcbiAgICAgICAgICAgICAgdXNlcjogdXBkYXRlZFdvcmtlci5pZFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoY3JlYXRlZE1lbWJlcnNoaXApIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZXIuZGV0YWlsJywge3dvcmtlcklkOiBjcmVhdGVkTWVtYmVyc2hpcC51c2VyfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtlcjpjcmVhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3JrZXIpIHtcbiAgICByZXR1cm4gdXNlckNsaWVudC5jcmVhdGUod29ya2VyKVxuICAgICAgICAudGhlbihmdW5jdGlvbihjcmVhdGVkV29ya2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQuY3JlYXRlKHtcbiAgICAgICAgICAgIGdyb3VwIDogY3JlYXRlZFdvcmtlci5ncm91cCxcbiAgICAgICAgICAgIHVzZXI6IGNyZWF0ZWRXb3JrZXIuaWRcbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChjcmVhdGVkTWVtYmVyc2hpcCkge1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZXIuZGV0YWlsJywge3dvcmtlcklkOiBjcmVhdGVkTWVtYmVyc2hpcC51c2VyfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KTtcbn0pXG5cbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAud29ya2Zsb3cnLCBbXG4gICd1aS5yb3V0ZXInXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbiwgJ25nTWVzc2FnZXMnXG4sIHJlcXVpcmUoJ25nLXNvcnRhYmxlJylcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdycsIHtcbiAgICAgIHVybDogJy93b3JrZmxvd3MvbGlzdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93TGlzdENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3dzOiBmdW5jdGlvbih3b3JrZmxvd01hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5saXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZmxvdy9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3JrZmxvdy86d29ya2Zsb3dJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctZGV0YWlsLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya2Zsb3dEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93OiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtmbG93SWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1zOiBmdW5jdGlvbihhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmFkZCcsIHtcbiAgICAgIHVybDogJy93b3JrZmxvd3MvJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZmxvdy93b3JrZmxvdy1hZGQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZmxvd0FkZENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLm5ldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmVkaXQnLCB7XG4gICAgICB1cmw6ICcvd29ya2Zsb3cvOndvcmtmbG93SWQvZWRpdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93Rm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgd29ya2Zsb3dNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya2Zsb3dJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdy5zdGVwJywge1xuICAgICAgdXJsOiAnL3dvcmtmbG93Lzp3b3JrZmxvd0lkL3N0ZXBzLzpjb2RlL2VkaXQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LXN0ZXAtZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93U3RlcEZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93OiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtmbG93SWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1zOiBmdW5jdGlvbihhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJywge1xuICAgICAgd29ya2Zsb3dJZDogd29ya2Zsb3cuaWQgfHwgd29ya2Zsb3cuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtmbG93Omxpc3QnLCBmdW5jdGlvbih3b3JrZmxvdykge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93JywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0xpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVkaWF0b3IsIHdvcmtmbG93cywgJHN0YXRlUGFyYW1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZmxvd3MgPSB3b3JrZmxvd3M7XG4gIHNlbGYuc2VsZWN0ZWRXb3JrZmxvd0lkID0gJHN0YXRlUGFyYW1zLndvcmtmbG93SWQ7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbiAgc2VsZi5zZWxlY3RXb3JrZmxvdyA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZmxvdykge1xuICAgIHNlbGYuc2VsZWN0ZWRXb3JrZmxvd0lkID0gd29ya2Zsb3cuaWQ7XG4gICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgd29ya2Zsb3cpO1xuICB9O1xuXG4gIHNlbGYuYXBwbHlGaWx0ZXIgPSBmdW5jdGlvbih0ZXJtKSB7XG4gICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cy5maWx0ZXIoZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICAgIHJldHVybiBTdHJpbmcod29ya2Zsb3cudGl0bGUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgfHwgU3RyaW5nKHdvcmtmbG93LmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICB9KTtcbiAgfTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0RldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtmbG93TWFuYWdlciwgd29ya29yZGVyTWFuYWdlciwgd29ya2Zsb3csIGZvcm1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJHNjb3BlLnNlbGVjdGVkLmlkID0gd29ya2Zsb3cuaWQ7XG4gICRzY29wZS5kcmFnQ29udHJvbExpc3RlbmVycyA9IHtcbiAgICBjb250YWlubWVudDogJyNzdGVwTGlzdCcsXG4gICAgb3JkZXJDaGFuZ2VkIDogIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICAgICk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBzZWxmLndvcmtmbG93ID0gd29ya2Zsb3c7XG4gIHNlbGYuZm9ybXMgPSBmb3JtcztcbiAgc2VsZi5kZWxldGUgPSBmdW5jdGlvbihldmVudCwgd29ya2Zsb3cpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpXG4gICAgICAudGhlbihmdW5jdGlvbih3b3Jrb3JkZXJzKXtcbiAgICAgICAgdmFyIHdvcmtvcmRlciA9IHdvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya29yZGVyLndvcmtmbG93SWQpID09PSBTdHJpbmcod29ya2Zsb3cuaWQpO1xuICAgICAgICB9KVxuICAgICAgICB2YXIgdGl0bGUgPSAod29ya29yZGVyLmxlbmd0aClcbiAgICAgICAgICA/IFwiV29ya2Zsb3cgaXMgdXNlZCBhdCBsZWFzdCBieSBhdCBsZWFzdCAxIHdvcmtvcmRlciwgYXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB3b3JrZmxvdyAjJ1wiK3dvcmtmbG93LmlkK1wiP1wiXG4gICAgICAgICAgOiBcIldvdWxkIHlvdSBsaWtlIHRvIGRlbGV0ZSB3b3JrZmxvdyAjXCIrd29ya2Zsb3cuaWQrXCI/XCI7XG4gICAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSh0aXRsZSlcbiAgICAgICAgICAudGV4dENvbnRlbnQod29ya2Zsb3cudGl0bGUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIHdvcmtmbG93JylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAgICAgcmV0dXJuIGNvbmZpcm07XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oY29uZmlybSkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3coY29uZmlybSlcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5kZWxldGUod29ya2Zsb3cpXG4gICAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZmxvdycsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgc2VsZi5kZWxldGVTdGVwID0gZnVuY3Rpb24oZXZlbnQsIHN0ZXAsIHdvcmtmbG93KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAudGl0bGUoJ1dvdWxkIHlvdSBsaWtlIHRvIGRlbGV0ZSBzdGVwIDogJysgc3RlcC5uYW1lICsnID8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudChzdGVwLm5hbWUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIHN0ZXAnKVxuICAgICAgICAgIC50YXJnZXRFdmVudChldmVudClcbiAgICAgICAgICAub2soJ1Byb2NlZWQnKVxuICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbCcpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICB3b3JrZmxvdy5zdGVwcyA9IHdvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmNvZGUgIT09IHN0ZXAuY29kZTtcbiAgICAgIH0pO1xuICAgICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICAgICk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KVxuICAgIH0pO1xuICB9O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIudXBkYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAge3dvcmtmbG93SWQ6IF93b3JrZmxvdy5pZH0sXG4gICAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICAgICApO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya2Zsb3dBZGRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVkaWF0b3IsIHdvcmtmbG93TWFuYWdlciwgd29ya2Zsb3cgKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZmxvdyA9IHdvcmtmbG93O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIuY3JlYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgX3dvcmtmbG93KTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0Zvcm1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgd29ya2Zsb3csIHdvcmtmbG93TWFuYWdlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi53b3JrZmxvdyA9IHdvcmtmbG93O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIudXBkYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd1N0ZXBGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBtZWRpYXRvciwgd29ya2Zsb3csIHdvcmtmbG93TWFuYWdlciwgZm9ybXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvdztcbiAgc2VsZi5mb3JtcyA9IGZvcm1zO1xuICBzZWxmLnN0ZXAgPSB3b3JrZmxvdy5zdGVwcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmNvZGUgPT0gJHN0YXRlUGFyYW1zLmNvZGU7XG4gIH0pWzBdO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtmbG93OnVwZGF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93LmRldGFpbCcsXG4gICAgICB7d29ya2Zsb3dJZDogX3dvcmtmbG93LmlkfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3JrZmxvdyc7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItbWVzc2FnZXMnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC53b3Jrb3JkZXInLCBbXG4gICd1aS5yb3V0ZXInXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbiwgJ25nTWVzc2FnZXMnXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAud29ya29yZGVyJywge1xuICAgICAgdXJsOiAnL3dvcmtvcmRlcnMvbGlzdCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtmbG93czogZnVuY3Rpb24od29ya2Zsb3dNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdE1hbmFnZXI6IGZ1bmN0aW9uKHJlc3VsdFN5bmMpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0U3luYy5tYW5hZ2VyUHJvbWlzZTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0TWFwOiBmdW5jdGlvbihyZXN1bHRNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdE1hbmFnZXIubGlzdCgpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIG1hcCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICBtYXBbcmVzdWx0LndvcmtvcmRlcklkXSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29sdW1uMjoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci93b3Jrb3JkZXItbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlckxpc3RDb250cm9sbGVyIGFzIHdvcmtvcmRlckxpc3RDb250cm9sbGVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya29yZGVyL2VtcHR5LnRwbC5odG1sJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya29yZGVyLm5ldycsIHtcbiAgICAgIHVybDogJy9uZXcnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci93b3Jrb3JkZXItbmV3LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya29yZGVyTmV3Q29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB3b3Jrb3JkZXI6IGZ1bmN0aW9uKHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubmV3KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXIuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL3dvcmtvcmRlci86d29ya29yZGVySWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci93b3Jrb3JkZXItZGV0YWlsLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya29yZGVyRGV0YWlsQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB3b3Jrb3JkZXI6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgYXBwZm9ybUNsaWVudCwgd29ya29yZGVyTWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci5yZWFkKCRzdGF0ZVBhcmFtcy53b3Jrb3JkZXJJZClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uKHdvcmtvcmRlciwgcmVzdWx0TWFwKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRNYXBbd29ya29yZGVyLmlkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlci5lZGl0Jywge1xuICAgICAgdXJsOiAnL3dvcmtvcmRlci86d29ya29yZGVySWQvZWRpdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya29yZGVyL3dvcmtvcmRlci1lZGl0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya29yZGVyRm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya29yZGVyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya29yZGVySWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdvcmtlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdDogZnVuY3Rpb24od29ya29yZGVyLCByZXN1bHRNYXApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdE1hcFt3b3Jrb3JkZXIuaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICRzdGF0ZS5nbyhcbiAgICAgICdhcHAud29ya29yZGVyLmRldGFpbCcsXG4gICAgICB7IHdvcmtvcmRlcklkOiB3b3Jrb3JkZXIuaWQgfHwgd29ya29yZGVyLl9sb2NhbHVpZCB9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3Jrb3JkZXI6bGlzdCcsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3Jrb3JkZXJMaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIHdvcmtvcmRlcnMsIHJlc3VsdE1hcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya29yZGVycyA9IHdvcmtvcmRlcnM7XG4gIHNlbGYucmVzdWx0TWFwID0gcmVzdWx0TWFwO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG59KVxuXG4uY29udHJvbGxlcignV29ya29yZGVyRGV0YWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJG1kRGlhbG9nLCBtZWRpYXRvciwgd29ya29yZGVyTWFuYWdlciwgd29ya2Zsb3dNYW5hZ2VyLCB3b3JrZmxvd3MsIHdvcmtvcmRlciwgcmVzdWx0LCB3b3JrZXJzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJHNjb3BlLnNlbGVjdGVkLmlkID0gd29ya29yZGVyLmlkO1xuXG4gIHNlbGYud29ya29yZGVyID0gd29ya29yZGVyO1xuICB2YXIgd29ya2Zsb3cgPSB3b3JrZmxvd3MuZmlsdGVyKGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgcmV0dXJuIFN0cmluZyh3b3JrZmxvdy5pZCkgPT09IFN0cmluZyh3b3Jrb3JkZXIud29ya2Zsb3dJZCk7XG4gIH0pO1xuICBpZiAod29ya2Zsb3cubGVuZ3RoKSB7XG4gICAgc2VsZi53b3JrZmxvdyA9IHdvcmtmbG93WzBdO1xuICB9XG4gIHNlbGYucmVzdWx0ID0gcmVzdWx0O1xuICB2YXIgYXNzaWduZWUgPSB3b3JrZXJzLmZpbHRlcihmdW5jdGlvbih3b3JrZXIpIHtcbiAgICByZXR1cm4gU3RyaW5nKHdvcmtlci5pZCkgPT09IFN0cmluZyh3b3Jrb3JkZXIuYXNzaWduZWUpO1xuICB9KVxuICBpZiAoYXNzaWduZWUubGVuZ3RoKSB7XG4gICAgc2VsZi5hc3NpZ25lZSA9IGFzc2lnbmVlWzBdO1xuICB9XG5cbiAgdmFyIG5leHRTdGVwSW5kZXggPSB3b3JrZmxvd01hbmFnZXIubmV4dFN0ZXBJbmRleChzZWxmLndvcmtmbG93LnN0ZXBzLCBzZWxmLnJlc3VsdCk7XG4gIHZhciBudW1TdGVwcyA9IHNlbGYud29ya2Zsb3cuc3RlcHMubGVuZ3RoO1xuICBzZWxmLnByb2dyZXNzID0gKDEwMCAqIChuZXh0U3RlcEluZGV4ICsgMSkgLyBudW1TdGVwcykudG9QcmVjaXNpb24oMyk7XG4gIGNvbnNvbGUubG9nKG5leHRTdGVwSW5kZXgsIG51bVN0ZXBzLCBzZWxmLnByb2dyZXNzKTtcblxuICBzZWxmLmJlZ2luV29ya2Zsb3cgPSBmdW5jdGlvbihldmVudCwgd29ya29yZGVyKSB7XG4gICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OmJlZ2luJywgd29ya29yZGVyLmlkKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIHNlbGYuZGVsZXRlID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXG4gICAgICAgICAgLnRpdGxlKCdXb3VsZCB5b3UgbGlrZSB0byBkZWxldGUgd29ya29yZGVyICMnK3dvcmtvcmRlci5pZCsnPycpXG4gICAgICAgICAgLnRleHRDb250ZW50KHdvcmtvcmRlci50aXRsZSlcbiAgICAgICAgICAuYXJpYUxhYmVsKCdEZWxldGUgV29ya29yZGVyJylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIuZGVsZXRlKHdvcmtvcmRlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXInLCBudWxsLCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSlcbiAgICB9KTtcbiAgfVxufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtvcmRlck5ld0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsIHdvcmtvcmRlciwgd29ya2Zsb3dzLCBtZWRpYXRvciwgd29ya29yZGVyTWFuYWdlciwgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi53b3Jrb3JkZXIgPSB3b3Jrb3JkZXI7XG4gIHNlbGYud29ya2Zsb3dzID0gd29ya2Zsb3dzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya29yZGVyOmNyZWF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgIHdvcmtvcmRlck1hbmFnZXIuY3JlYXRlKHdvcmtvcmRlcikudGhlbihmdW5jdGlvbihfd29ya29yZGVyKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOnNlbGVjdGVkJywgX3dvcmtvcmRlcik7XG4gICAgfSk7XG4gIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtvcmRlckZvcm1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgd29ya29yZGVyTWFuYWdlciwgd29ya29yZGVyLCB3b3JrZmxvd3MsIHdvcmtlcnMsIHJlc3VsdCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi53b3Jrb3JkZXIgPSB3b3Jrb3JkZXI7XG4gIHNlbGYud29ya2Zsb3dzID0gd29ya2Zsb3dzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuICBzZWxmLnJlc3VsdCA9IHJlc3VsdDtcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtvcmRlcjp1cGRhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci51cGRhdGUod29ya29yZGVyKS50aGVuKGZ1bmN0aW9uKF93b3Jrb3JkZXIpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCBfd29ya29yZGVyKTtcbiAgICB9KVxuICB9KTtcbn0pXG5cbjtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLndvcmtvcmRlcic7XG4iXX0=
