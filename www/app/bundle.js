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
    '  <button ng-click="ctrl.capture($event)">Take a photo</button>\n' +
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
    '        <label>{{ctrl.field.props.type}}</label>\n' +
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
        var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #'+workorder.id+'</strong><br>Vancouver, BC<br>'});
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
    '\n' +
    '<form name="messageForm" ng-submit="ctrl.done(messageForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <!--\n' +
    '  <md-input-container>\n' +
    '    <label for="messageState">Status</label>\n' +
    '    <input type="text" id="inputmessageType" name="messageStatus" ng-model="ctrl.model.status" disabled="true">\n' +
    '  </md-input-container>\n' +
    '  -->\n' +
    '\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="To">To</label>\n' +
    '    <md-select ng-model="ctrl.model.receiver" name="receiver" id="receiver">\n' +
    '       <md-option ng-repeat="worker in ctrl.workers" value="{{worker}}">{{worker.name}} ({{worker.position}})</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Subject</label>\n' +
    '    <input type="text" id="inputSubject" name="subject" ng-model="ctrl.model.subject" required>\n' +
    '    <div ng-messages="messageForm.subject.$error" ng-if="ctrl.submitted || messageForm.subject.$dirty">\n' +
    '      <div ng-message="required">A subject is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.summary.$invalid && !messageForm.summary.$pristine }">\n' +
    '    <label for="inputContent">Message</label>\n' +
    '    <textarea id="inputContent" name="content" ng-model="ctrl.model.content" required md-maxlength="350"></textarea>\n' +
    '\n' +
    '    <div ng-messages="messageForm.summary.$error" ng-show="ctrl.submitted || messageForm.summary.$dirty">\n' +
    '      <div ng-message="required">A summary date is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">Send message</md-button>\n' +
    '</form>\n' +
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
    '<form action="#" class="persistent-search">\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" id="search" placeholder="Search">\n' +
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
    '\n' +
    '\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="navigateTo(\'app.message.detail\', {messageId: message.id})" ng-repeat="message in ctrl.messages">\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{user.title}}</h3>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
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
    '<span class="wfm-chip wfm-chip-no-picture" style="width:300px">\n' +
    '  <span class="wfm-chip-name">{{ctrl.workorder.type}} #{{ctrl.workorder.id}}</span>\n' +
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
    '        </td>\n' +
    '      </tr>\n' +
    '    </table>\n' +
    '  </div>\n' +
    '\n' +
    '  <div flex="30" class="wfm-scheduler-workorders" id="workorders-list" droppable="true">\n' +
    '    <div class="wfm-toolbar-sm">\n' +
    '      <h3 class="md-subhead">\n' +
    '        Workorders\n' +
    '      </h3>\n' +
    '    </div>\n' +
    '    <span ng-repeat="workorder in ctrl.workorders | filter:workOrderfilter" class="wfm-chip wfm-chip-no-picture" draggable="true" data-workorderId="{{workorder.id}}">\n' +
    '      <schedule-workorder-chip workorder="workorder"></schedule-workorder-chip>\n' +
    '    </span>\n' +
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

  function renderWorkorder(scope, hourElement, workorder) {
    var element = angular.element(hourElement);
    var _workorder = scope.workorder;
    scope.workorder = workorder;
    var chip = angular.element('<schedule-workorder-chip workorder="workorder" scheduled="true" draggable="true"></schedule-workorder-chip>');

    element.append(chip);
    $compile(chip)(scope);
    chip[0].id = workorder.id;
    chip[0].addEventListener('dragstart', function(event) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('workorderid', workorder.id);
    });
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

  function scheduleWorkorder(workorder, workerId, hour) {
    workorder.assignee = workerId;
    var date = new Date();
    date.setHours(hour);
    workorder.startTimestamp = date.getTime();
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
    var hourElements = element.querySelectorAll('[droppable=true]');
    Array.prototype.forEach.call(hourElements, function(hourElement) {
      while (hourElement.firstChild) {
        hourElement.removeChild(hourElement.firstChild);
      }
    });
  }

  function render(scope, ctrl, element) {
    var workordersOnDate = scope.workorders.filter(function(workorder) {
      return new Date(workorder.startTimestamp).toDateString() === ctrl.scheduleDate.toDateString();
    });
    renderWorkorders(scope, element, workordersOnDate);
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
        var dragged = null;
        var droppables = element[0].querySelectorAll('[droppable=true]');
        Array.prototype.forEach.call(droppables, function(droppable) {
          droppable.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
              e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            return false;
          });
          droppable.addEventListener('dragenter', function(e) {
            this.classList.add('dragover');
          });
          droppable.addEventListener('dragleave', function(e) {
            this.classList.remove('dragover');
          });
          droppable.addEventListener('drop', function(e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            if(e.currentTarget.id != 'workorders-list'){
              this.classList.remove('dragover');
              var workorder = getWorkorder(scope.workorders, e.dataTransfer.getData('workorderid'));
              var worker = getWorker(scope.workers, this.dataset.workerid);
              var hour = this.dataset.hour;
              var dropped = dragged;

              var dropElement = this;
              scope.$apply(function() {
                var scheduledWorkorder = angular.copy(workorder);
                scheduleWorkorder(scheduledWorkorder, worker.id, hour);
                mediator.request('wfm:schedule:workorder', scheduledWorkorder, {uid: scheduledWorkorder.id})
                .then(function(savedWorkorder) {
                  var previousChipElement = document.getElementById(savedWorkorder.id);
                  if(previousChipElement){
                    previousChipElement.parentNode.removeChild(previousChipElement);
                  }

                  renderWorkorder(scope, dropElement, savedWorkorder);
                  if(dropped) {
                    element[0].querySelector('.wfm-scheduler-workorders').removeChild(dropped);
                    var index = scope.workorders.indexOf(workorder);
                    if (~index) {
                      scope.workorders[index] = savedWorkorder;
                    }
                  }
                }, function(error) {
                  console.error(error);
                })
              })
              // Remove the element from the list.
              return false;
            }
          });
        });

        var droppableBack = element[0].querySelector('.wfm-scheduler-workorders');
        droppableBack.addEventListener('dragover', function(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.dataTransfer.dropEffect = 'move';
          return false;
        });
        droppableBack.addEventListener('dragenter', function(e) {
          this.classList.add('dragover');
        });
        droppableBack.addEventListener('dragleave', function(e) {
          this.classList.remove('dragover');
        });

        //TODO this should be merged wit the global drop listener
        droppableBack.addEventListener('drop', function(e) {
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          var workorder = getWorkorder(scope.workorders, e.dataTransfer.getData('workorderid'));
          this.classList.remove('dragover');
          scope.$apply(function() {
            var scheduledWorkorder = angular.copy(workorder);
            scheduledWorkorder.startTimestamp = null;
            mediator.request('wfm:schedule:workorder', scheduledWorkorder, {uid: scheduledWorkorder.id})
            .then(function(savedWorkorder) {
              var element = document.getElementById(savedWorkorder.id);
              if(element){
                element.parentNode.removeChild(element);
              }
              var index = scope.workorders.indexOf(workorder);
              if (~index) {
                scope.workorders[index] = savedWorkorder;
                e.target.addEventListener('dragstart', function(event) {
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('workorderid', savedWorkorder.id);
                });
              }

            }, function(error) {
              console.error(error);
            })
          })
        });
        var draggables = element[0].querySelectorAll('[draggable=true]');
        Array.prototype.forEach.call(draggables, function(draggable) {
          if(!draggable.attributes.scheduled) {
          draggable.addEventListener('dragstart', function(event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('workorderid', draggable.dataset.workorderid);
            dragged = this;
          });
          draggable.addEventListener('dragend', function(e) {
            dragged = null;
          });
        }
        });
      });
    },
    controller: function($scope, $timeout, $element) {
      var self = this;
      self.scheduleDate = new Date();
      self.dateChange = function() {
        removeWorkorders($element[0]);
        render($scope, self, $element[0]);
      }
      $timeout(function() {
        render($scope, self, $element[0]);
      })
      self.workorders = $scope.workorders;
      $scope.$watch('workorders', function() {
        self.workorders = $scope.workorders;
      })
      self.workers = $scope.workers;
      $scope.workOrderfilter  = function(workorder) {
        return workorder.assignee == null || workorder.startTimestamp == null;
      };

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
        if(workorder.id) {
          mediator.publish('wfm:worker:selected', workorder);
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
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/user',
  authpolicyPath: '/box/srv/1.1/admin/authpolicy'
}

},{}],87:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-user');

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
  return deferred.promise;
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
      policyId: 'wfm',
      clientToken: self.appid,
      params: {
        userId: username,
        password: password
      }
    }, function (res) {
      // res.sessionToken; // The platform session identifier
      // res.authResponse; // The authetication information returned from the authetication service.
      storeProfile(res.authResponse);
      self.mediator.publish('wfm:auth:profile:change', res.authResponse);
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
    '<h2 class="md-title">{{step.name}}</h2>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.code}}</h3>\n' +
    '      <p>Code</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-divider></md-divider>\n' +
    '  <div ng-show="step.formId">\n' +
    '    <md-list-item class="md-2-line">\n' +
    '      <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{step.formId}}</h3>\n' +
    '        <p>FormId</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '  </div>\n' +
    '</md-list>\n' +
    '<div ng-show="step.templates">\n' +
    '  <div ng-show="step.templates.view">\n' +
    '    <md-list-item class="md-2-line">\n' +
    '      <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{step.templates.view}}</h3>\n' +
    '        <p>Template view</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '  </div>\n' +
    '  <div ng-show="step.templates.form">\n' +
    '    <md-list-item class="md-2-line">\n' +
    '      <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{step.templates.form}}</h3>\n' +
    '        <p>Template form</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '</div>\n' +
    '</div>\n' +
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
    '    <input type="text" id="formId" name="formId" ng-model="ctrl.model.step.formId">\n' +
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
      step : '='
      }
    , controller: function($scope) {
        var self = this;
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
                $scope.workflow.steps = $scope.workflow.steps.filter(function(item) {return item.code != $scope.step.code;});
              }
              //we add the new or updated step
              $scope.workflow.steps.push(self.model.step);
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
    '    <input type="text"  id="inputLattitude" name="lattitude" ng-model="ctrl.model.location[0]" required>\n' +
    '    <div ng-messages="workorderForm.lattitude.$error" ng-show="ctrl.submitted || workorderForm.lattitude.$dirty">\n' +
    '      <div ng-message="required">An lattitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputAddress">Longitude</label>\n' +
    '    <input type="text"  id="inputLattitude" name="longitude" ng-model="ctrl.model.location[1]" required>\n' +
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
  self.group = groups.filter(function(group) {
      return userMembership.group == group.id;
  })[0];

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
    self.worker.group = groups.filter(function(group) {
        return userMembership.group == group.id;
    })[0].id;
  }

  mediator.subscribeForScope('wfm:worker:updated', $scope, function(worker) {
    return userClient.update(worker)
        .then(function(updatedWorker) {
          //retrieve the existing membership
          var userMembership = membership.filter(function(_membership) {
            return _membership.user == worker.id
          })[0];
          userMembership.group = updatedWorker.group;
          return membershipClient.update(userMembership)
            .then(function(updatedMembership) {
              $state.go('app.worker.detail', {workerId: updatedMembership.user}, {reload: true});
            });
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
})

.controller('WorkflowDetailController', function ($scope, $state, $mdDialog, mediator, workflowManager, workflow) {
  var self = this;
  $scope.selected.id = workflow.id;
  $scope.dragControlListeners = {
    containment: '#stepList'
  }
  self.workflow = workflow;

  self.delete = function(event, workflow) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete workflow #'+workflow.id+'?')
          .textContent(workflow.title)
          .ariaLabel('Delete workflow')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      return workflowManager.delete(workflow)
      .then(function() {
        $state.go('app.workflow', null, {reload: true});
      }, function(err) {
        throw err;
      })
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

  mediator.subscribe('wfm:workflow:updated', function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail', {
        workflowId: _workflow.id
      });
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

.controller('WorkflowStepFormController', function ($scope, $state, $stateParams, mediator, workflow, workflowManager) {
  var self = this;

  self.workflow = workflow;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2FyZWEudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2NoYXJ0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYW5hbHl0aWNzL2Rpc3QvcGllLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvYW5hbHl0aWNzLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtcGhvdG8udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1zdWJtaXNzaW9uLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL2FwcGZvcm0tbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0tbWVkaWF0b3IuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0uanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbm9kZV9tb2R1bGVzL2ZoLXdmbS1zaWduYXR1cmUvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9ub2RlX21vZHVsZXMvZmgtd2ZtLXNpZ25hdHVyZS9kaXN0L3NpZ25hdHVyZS1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL25vZGVfbW9kdWxlcy9maC13Zm0tc2lnbmF0dXJlL2Rpc3Qvc2lnbmF0dXJlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL25vZGVfbW9kdWxlcy9maC13Zm0tc2lnbmF0dXJlL2xpYi9hbmd1bGFyL3NpZ25hdHVyZS1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9ub2RlX21vZHVsZXMvZmgtd2ZtLXNpZ25hdHVyZS9saWIvY2FudmFzLWRyYXdyLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvZGlzdC9jYW1lcmEudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvY2FtZXJhLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tY2FtZXJhL2xpYi9jYW1lcmEuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWZpbGUvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1maWxlL2xpYi9hbmd1bGFyL2ZpbGUtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWZpbGUvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tZmlsZS9saWIvZmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9kaXN0L3dvcmtvcmRlci1tYXAudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9tYXAtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1hcC9saWIvYW5ndWxhci9zZXJ2aWNlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZWRpYXRvci9saWIvYW5ndWxhci9tZWRpYXRvci1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVkaWF0b3IvbGliL21lZGlhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvZGlzdC9tZXNzYWdlLWRldGFpbC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9kaXN0L21lc3NhZ2UtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9kaXN0L21lc3NhZ2UtbGlzdC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvbGliL2FuZ3VsYXIvbWVzc2FnZS1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvYW5ndWxhci9zeW5jLXNlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmVzdWx0L2xpYi9hbmd1bGFyL3Jlc3VsdC1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmVzdWx0L2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXJlc3VsdC9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yaXNrLWFzc2Vzc21lbnQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmlzay1hc3Nlc3NtZW50L2Rpc3Qvcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXJpc2stYXNzZXNzbWVudC9kaXN0L3Jpc2stYXNzZXNzbWVudC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmlzay1hc3Nlc3NtZW50L2xpYi9hbmd1bGFyL3Jpc2stYXNzZXNzbWVudC1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvZGlzdC9zY2hlZHVsZS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2NoZWR1bGUvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zeW5jL2xpYi9hbmd1bGFyL3N5bmMtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXN5bmMvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc3luYy9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3QvZ3JvdXAtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L2dyb3VwLWxpc3QudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC9ncm91cC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3Qvd29ya2VyLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC93b3JrZXItbGlzdC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L3dvcmtlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvYW5ndWxhci91c2VyLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2xpYi9ncm91cC9jb25maWctZ3JvdXAuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2dyb3VwL2dyb3VwLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvbWVtYmVyc2hpcC9jb25maWctbWVtYmVyc2hpcC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvbWVtYmVyc2hpcC9tZW1iZXJzaGlwLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvdXNlci9jb25maWctdXNlci5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvdXNlci91c2VyLWNsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdmVoaWNsZS1pbnNwZWN0aW9uL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXZlaGljbGUtaW5zcGVjdGlvbi9kaXN0L3ZlaGljbGUtaW5zcGVjdGlvbi1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24vZGlzdC92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXZlaGljbGUtaW5zcGVjdGlvbi9saWIvYW5ndWxhci92ZWhpY2xlLWluc3BlY3Rpb24tbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3Qvd29ya2Zsb3ctZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1wcm9ncmVzcy50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1zdGVwLWRldGFpbC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvZGlzdC93b3JrZmxvdy1zdGVwLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya2Zsb3cvbGliL2FuZ3VsYXIvd29ya2Zsb3ctbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3Jrb3JkZXIvZGlzdC93b3Jrb3JkZXItZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2Rpc3Qvd29ya29yZGVyLWxpc3QudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9kaXN0L3dvcmtvcmRlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL3N5bmMtc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9hbmd1bGFyL3dvcmtvcmRlci1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2FwcC9hbmFseXRpY3MvYW5hbHl0aWNzLmpzIiwic3JjL2FwcC9hcHBmb3JtL2FwcGZvcm0uanMiLCJzcmMvYXBwL2F1dGgvYXV0aC5qcyIsInNyYy9hcHAvZmlsZS9maWxlLmpzIiwic3JjL2FwcC9ncm91cC9ncm91cC5qcyIsInNyYy9hcHAvaG9tZS9ob21lLmpzIiwic3JjL2FwcC9tYWluLmpzIiwic3JjL2FwcC9tYXAvbWFwLmpzIiwic3JjL2FwcC9tZXNzYWdlL21lc3NhZ2UuanMiLCJzcmMvYXBwL3NjaGVkdWxlL3NjaGVkdWxlLmpzIiwic3JjL2FwcC93b3JrZXIvd29ya2VyLmpzIiwic3JjL2FwcC93b3JrZmxvdy93b3JrZmxvdy5qcyIsInNyYy9hcHAvd29ya29yZGVyL3dvcmtvcmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BNQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFuYWx5dGljcy5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcmVhLnRwbC5odG1sJyxcbiAgICAnPGRpdiBmbGV4IGhpZGUtc20+XFxuJyArXG4gICAgJyAgICA8bWQtY2FyZD5cXG4nICtcbiAgICAnICAgICAgPGRpdiBpZD1cImFyZWEtY2hhcnRcIj48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICAgICAgICA8aDIgY2xhc3M9XCJtZC10aXRsZVwiPkFyZWEgQ2hhcnQ8L2gyPlxcbicgK1xuICAgICcgICAgICAgIDxwPlxcbicgK1xuICAgICcgICAgICAgICAgVGhpcyBhcmVhIGNoYXJ0IGNvbXBhcmVzIHRoZSBlc3RpbWF0ZWQgd29ya29yZGVyIHRpbWUgPGJyPmNvbXBsZXRpb24gdGltZSB3aXRoXFxuJyArXG4gICAgJyAgICAgICAgICB0aGUgcmVhbCBjb21wbGV0aW9uIHRpbWUuXFxuJyArXG4gICAgJyAgICAgICAgPC9wPlxcbicgK1xuICAgICcgICAgICA8L21kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICAgIDwvbWQtY2FyZD5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFuYWx5dGljcy5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9jaGFydC50cGwuaHRtbCcsXG4gICAgJzxkaXYgZmxleD5cXG4nICtcbiAgICAnICA8bWQtY2FyZD5cXG4nICtcbiAgICAnICAgIDxkaXYgaWQ9XCJiYXItY2hhcnRcIj48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1jYXJkLWNvbnRlbnQ+XFxuJyArXG4gICAgJyAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+Q29tcGxldGlvbiB0aW1lIC8gRXN0aW1hdGVkIHRpbWU8L2gyPlxcbicgK1xuICAgICcgICAgICA8cD5cXG4nICtcbiAgICAnICAgICAgICBUaGlzIGJhciBjaGFydCBjb21wYXJlcyB0aGUgZXN0aW1hdGVkIHdvcmtvcmRlciB0aW1lIDxicj5jb21wbGV0aW9uIHRpbWUgd2l0aFxcbicgK1xuICAgICcgICAgICAgIHRoZSByZWFsIGNvbXBsZXRpb24gdGltZS5cXG4nICtcbiAgICAnICAgICAgPC9wPlxcbicgK1xuICAgICcgICAgPC9tZC1jYXJkLWNvbnRlbnQ+XFxuJyArXG4gICAgJyAgPC9tZC1jYXJkPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJyZXF1aXJlKCcuL2FyZWEudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vY2hhcnQudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vcGllLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFuYWx5dGljcy5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9waWUudHBsLmh0bWwnLFxuICAgICc8ZGl2IGZsZXg+XFxuJyArXG4gICAgJyAgPG1kLWNhcmQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IGlkPVwicGllLWNoYXJ0XCI+PC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtY2FyZC1jb250ZW50PlxcbicgK1xuICAgICcgICAgICA8aDIgY2xhc3M9XCJtZC10aXRsZVwiPldvcmtvcmRlcnMgYnkgYXNzaWduZWU8L2gyPlxcbicgK1xuICAgICcgICAgICA8cD5cXG4nICtcbiAgICAnICAgICAgICBUaGlzIHBpZSBjaGFydCByZXByZXNlbnRzIHRoZSBudW1iZXIgb2Ygd29ya29yZGVycyBhc3NpZ25lZCB0byBlYWNoIHdvcmtlci5cXG4nICtcbiAgICAnICAgICAgPC9wPlxcbicgK1xuICAgICcgICAgPC9tZC1jYXJkLWNvbnRlbnQ+XFxuJyArXG4gICAgJyAgPC9tZC1jYXJkPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmFuYWx5dGljcy5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xudmFyIGMzID0gcmVxdWlyZSgnYzMnKVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FuYWx5dGljc1BpZWNoYXJ0JywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yLCAkd2luZG93LCAkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3BpZS50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICB3b3JrZXJzOiAnPScsXG4gICAgICB3b3Jrb3JkZXJzOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciB3b3JrZXJNYXAgPSB7fTtcbiAgICAgICRzY29wZS53b3JrZXJzLmZvckVhY2goZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICAgIHdvcmtlck1hcFt3b3JrZXIuaWRdID0gd29ya2VyO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciB3b3Jrb3JkZXJDb3VudHMgPSB7fTtcbiAgICAgICRzY29wZS53b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICAgIHdvcmtvcmRlckNvdW50c1t3b3Jrb3JkZXIuYXNzaWduZWVdID0gd29ya29yZGVyQ291bnRzW3dvcmtvcmRlci5hc3NpZ25lZV0gfHwgMDtcbiAgICAgICAgd29ya29yZGVyQ291bnRzW3dvcmtvcmRlci5hc3NpZ25lZV0rKztcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sdW1ucyA9IFtdO1xuICAgICAgXy5mb3JJbih3b3Jrb3JkZXJDb3VudHMsIGZ1bmN0aW9uKGNvdW50LCB3b3JrZXJpZCkge1xuICAgICAgICB2YXIgd29ya2VyID0gd29ya2VyTWFwW3dvcmtlcmlkXTtcbiAgICAgICAgdmFyIG5hbWUgPSB3b3JrZXIgPyB3b3JrZXIubmFtZSA6ICdVbmFzc2lnbmVkJztcbiAgICAgICAgdmFyIGNvbHVtbiA9IFtuYW1lLCBjb3VudF07XG4gICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgfSk7XG5cblxuICAgICAgdmFyIHBpZUNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xuICAgICAgICBiaW5kdG86ICcjcGllLWNoYXJ0JyxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHdpZHRoOiA0NTBcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgICAgIHR5cGUgOiAncGllJyxcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uIChkLCBpKSB7IGNvbnNvbGUubG9nKFwib25jbGlja1wiLCBkLCBpKTsgfSxcbiAgICAgICAgICAgIG9ubW91c2VvdmVyOiBmdW5jdGlvbiAoZCwgaSkgeyBjb25zb2xlLmxvZyhcIm9ubW91c2VvdmVyXCIsIGQsIGkpOyB9LFxuICAgICAgICAgICAgb25tb3VzZW91dDogZnVuY3Rpb24gKGQsIGkpIHsgY29uc29sZS5sb2coXCJvbm1vdXNlb3V0XCIsIGQsIGkpOyB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfX0pXG4gIC5kaXJlY3RpdmUoJ2FuYWx5dGljc0JhcmNoYXJ0JywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yLCAkd2luZG93LCAkdGltZW91dCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2NoYXJ0LnRwbC5odG1sJyksXG4gICAgICBzY29wZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgICAvL2FkZCBmYWtlIGRhdGEgZm9yIGJhciBjaGFydHNcbiAgICAgICAgdmFyIGNvbHVtbkVzdGltYXRlZCA9IFtcImVzdGltYXRlZFwiXTtcbiAgICAgICAgdmFyIGNvbHVtblJlYWwgPSBbXCJyZWFsXCJdO1xuICAgICAgICB2YXIgeEF4aXMgPSBbXTtcbiAgICAgICAgJHNjb3BlLndvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgICB2YXIgZXN0aW1hdGVkICA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxNSk7XG4gICAgICAgICAgdmFyIHJlYWwgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgICAgICAgIHhBeGlzLnB1c2goXCIjXCIgKyB3b3Jrb3JkZXIuaWQgKyBcIjpcIiArIHdvcmtvcmRlci50aXRsZSk7XG4gICAgICAgICAgY29sdW1uRXN0aW1hdGVkLnB1c2goZXN0aW1hdGVkKTtcbiAgICAgICAgICBjb2x1bW5SZWFsLnB1c2gocmVhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiYXJDaGFydCA9IGMzLmdlbmVyYXRlKHtcbiAgICAgICAgICBiaW5kdG86ICcjYmFyLWNoYXJ0JyxcbiAgICAgICAgICBzaXplOiB7XG4gICAgICAgICAgICB3aWR0aDogNDUwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgIGNvbHVtbkVzdGltYXRlZCxcbiAgICAgICAgICAgICAgY29sdW1uUmVhbFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHR5cGU6ICdiYXInXG4gICAgICAgICAgfSxcbiAgICAgICAgICBheGlzOiB7XG4gICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcbiAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogeEF4aXNcbiAgICAgICAgICAgICB9XG4gICAgICAgICB9LFxuICAgICAgICAgIGJhcjoge1xuICAgICAgICAgICAgd2lkdGg6IHtcbiAgICAgICAgICAgICAgcmF0aW86IC44XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgfSxcbiAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH19KVxuICAuZGlyZWN0aXZlKCdhbmFseXRpY3NBcmVhY2hhcnQnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IsICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXJlYS50cGwuaHRtbCcpLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgd29ya29yZGVyczogJz0nXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgfSxcbiAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgICAgLy9hZGQgZmFrZSBkYXRhIGZvciBiYXIgY2hhcnRzXG4gICAgICAgIHZhciBjb2x1bW5Fc3RpbWF0ZWQgPSBbXCJlc3RpbWF0ZWRcIl07XG4gICAgICAgIHZhciBjb2x1bW5SZWFsID0gW1wicmVhbFwiXTtcbiAgICAgICAgdmFyIHhBeGlzID0gW107XG4gICAgICAgICRzY29wZS53b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICAgICAgdmFyIGVzdGltYXRlZCAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgICAgICAgIHZhciByZWFsID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICAgICAgICB4QXhpcy5wdXNoKFwiI1wiICsgd29ya29yZGVyLmlkICsgXCI6XCIgKyB3b3Jrb3JkZXIudGl0bGUpO1xuICAgICAgICAgIGNvbHVtbkVzdGltYXRlZC5wdXNoKGVzdGltYXRlZCk7XG4gICAgICAgICAgY29sdW1uUmVhbC5wdXNoKHJlYWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYXJlYUNoYXJ0ID0gYzMuZ2VuZXJhdGUoe1xuICAgICAgICAgICAgYmluZHRvOiAnI2FyZWEtY2hhcnQnLFxuICAgICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgICB3aWR0aDogNDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgICAgY29sdW1uRXN0aW1hdGVkLFxuICAgICAgICAgICAgICAgIGNvbHVtblJlYWxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHR5cGVzOiB7XG4gICAgICAgICAgICAgIGVzdGltYXRlZDogJ2FyZWEnLFxuICAgICAgICAgICAgICByZWFsOiAnYXJlYS1zcGxpbmUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICB9LFxuICAgICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfX0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWRhdGUudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJpbnB1dERhdGVcIiBjbGFzcz1cIlwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cImRhdGVcIlxcbicgK1xuICAgICcgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICBuYW1lPVwiaW5wdXREYXRlXCJcXG4nICtcbiAgICAnICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5kYXRlXCJcXG4nICtcbiAgICAnICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICBtaW49XCJ7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19XCJcXG4nICtcbiAgICAnICAgIG1heD1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX1cIlxcbicgK1xuICAgICcgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm51bWJlclwiPllvdSBkaWQgbm90IGVudGVyIGEgdmFsaWQgZGF0YWU8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJzxkaXYgbGF5b3V0PVwicm93XCI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBmbGV4IGNsYXNzPVwibWQtYmxvY2tcIiBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1udW1iZXJcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dERhdGVcIiBjbGFzcz1cIlwiPkRhdGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJkYXRlXCJcXG4nICtcbiAgICAnICAgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICAgIG5hbWU9XCJpbnB1dERhdGVcIlxcbicgK1xuICAgICcgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwuZGF0ZVwiXFxuJyArXG4gICAgJyAgICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICAgIG1pbj1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX1cIlxcbicgK1xuICAgICcgICAgICBtYXg9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1heH19XCJcXG4nICtcbiAgICAnICAgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICAgID48L2lucHV0PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZXJyb3JcIiBuZy1zaG93PVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRkaXJ0eSB8fCAkcGFyZW50LmZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibnVtYmVyXCI+WW91IGRpZCBub3QgZW50ZXIgYSB2YWxpZCBkYXRlPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cIm1pblwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGFyZ2VyIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fS48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgZmxleCBjbGFzcz1cIm1kLWJsb2NrXCIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbnVtYmVyXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRUaW1lXCIgY2xhc3M9XCJcIj5UaW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGltZVwiXFxuJyArXG4gICAgJyAgICAgIHBsYWNlaG9sZGVyPVwie3tjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0fX1cIlxcbicgK1xuICAgICcgICAgICBuYW1lPVwiaW5wdXRUaW1lXCJcXG4nICtcbiAgICAnICAgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnRpbWVcIlxcbicgK1xuICAgICcgICAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJudW1iZXJcIj5Zb3UgZGlkIG5vdCBlbnRlciBhIHZhbGlkIHRpbWU8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWluXCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsYXJnZXIgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19LjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1sb2NhdGlvbi50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8cCBjbGFzcz1cIm1kLWNhcHRpb25cIj57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnPHA+e3tmaWVsZC5wcm9wcy5oZWxwVGV4dH19PC9wPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJjdHJsLnNldExvY2F0aW9uKCRldmVudClcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxvY2F0aW9uX3NlYXJjaGluZzwvbWQtaWNvbj5cXG4nICtcbiAgICAnICBHZXQgTG9jYXRpb25cXG4nICtcbiAgICAnPC9tZC1idXR0b24+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGxheW91dD1cInJvd1wiPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbG9jYXRpb24gbWQtYmxvY2tcIiBmbGV4PlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIlxcbicgK1xuICAgICcgICAgICBwbGFjZWhvbGRlcj1cIkxhdGl0dWRlXCJcXG4nICtcbiAgICAnICAgICAgbmFtZT1cImlucHV0TmFtZVhcIlxcbicgK1xuICAgICcgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudmFsdWUubGF0XCJcXG4nICtcbiAgICAnICAgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICAgID48L2lucHV0PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWVYLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWVYLiRkaXJ0eSB8fCAkcGFyZW50LmZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBsYXRpdHVkZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLWxvY2F0aW9uIG1kLWJsb2NrXCIgZmxleD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCJcXG4nICtcbiAgICAnICAgICAgcGxhY2Vob2xkZXI9XCJMb25naXR1ZGVcIlxcbicgK1xuICAgICcgICAgICBuYW1lPVwiaW5wdXROYW1lWVwiXFxuJyArXG4gICAgJyAgICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC52YWx1ZS5sb25nXCJcXG4nICtcbiAgICAnICAgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICAgID48L2lucHV0PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZVkuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZVkuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGxvbmdpdHVkZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtbnVtYmVyLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJpbnB1dE5hbWVcIiBjbGFzcz1cIlwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cIm51bWJlclwiXFxuJyArXG4gICAgJyAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgIG5hbWU9XCJpbnB1dE5hbWVcIlxcbicgK1xuICAgICcgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlXCJcXG4nICtcbiAgICAnICAgIG1pbj1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX1cIlxcbicgK1xuICAgICcgICAgbWF4PVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fVwiXFxuJyArXG4gICAgJyAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgID48L2lucHV0PlxcbicgK1xuICAgICcgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibnVtYmVyXCI+WW91IGRpZCBub3QgZW50ZXIgYSB2YWxpZCBudW1iZXI8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1waG90by50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxidXR0b24gbmctY2xpY2s9XCJjdHJsLmNhcHR1cmUoJGV2ZW50KVwiPlRha2UgYSBwaG90bzwvYnV0dG9uPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtdGltZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgY2xhc3M9XCJ7e2ZpZWxkLnByb3BzLmZpZWxkQ29kZX19IGFwcGZvcm0tZmllbGQtbnVtYmVyXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cImlucHV0VGltZVwiIGNsYXNzPVwiXCI+e3tmaWVsZC5wcm9wcy5uYW1lfX08L2xhYmVsPlxcbicgK1xuICAgICcgIDxpbnB1dCB0eXBlPVwidGltZVwiXFxuJyArXG4gICAgJyAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgIG5hbWU9XCJpbnB1dFRpbWVcIlxcbicgK1xuICAgICcgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnRpbWVcIlxcbicgK1xuICAgICcgICAgbmctY2hhbmdlPVwiY3RybC51cGRhdGVNb2RlbCgpXCJcXG4nICtcbiAgICAnICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1tZXNzYWdlcz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZXJyb3JcIiBuZy1zaG93PVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRkaXJ0eSB8fCAkcGFyZW50LmZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJudW1iZXJcIj5Zb3UgZGlkIG5vdCBlbnRlciBhIHZhbGlkIHRpbWU8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bmctZm9ybSBuYW1lPVwiZmllbGRGb3JtXCIgbmctc3VibWl0PVwiY3RybC5zdWJtaXQoKVwiPlxcbicgK1xuICAgICcgIDxkaXYgbmctc3dpdGNoPVwiY3RybC5maWVsZC5wcm9wcy50eXBlXCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cIm51bWJlclwiPlxcbicgK1xuICAgICcgICAgICA8YXBwZm9ybS1maWVsZC1udW1iZXIgbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLW51bWJlcj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJkYXRlVGltZVwiIG5nLXN3aXRjaD1cImN0cmwuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGF0ZXRpbWVVbml0XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJkYXRlXCI+XFxuJyArXG4gICAgJyAgICAgICAgPGFwcGZvcm0tZmllbGQtZGF0ZSBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtZGF0ZT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwiZGF0ZXRpbWVcIj5cXG4nICtcbiAgICAnICAgICAgICAgPGFwcGZvcm0tZmllbGQtZGF0ZXRpbWUgbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLWRhdGV0aW1lPlxcbicgK1xuICAgICcgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwidGltZVwiPlxcbicgK1xuICAgICcgICAgICAgICA8YXBwZm9ybS1maWVsZC10aW1lIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC10aW1lPlxcbicgK1xuICAgICcgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0PlxcbicgK1xuICAgICcgICAgICAgICB7e2N0cmwuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGF0ZXRpbWVVbml0fX1cXG4nICtcbiAgICAnICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cImxvY2F0aW9uXCI+XFxuJyArXG4gICAgJyAgICAgIDxhcHBmb3JtLWZpZWxkLWxvY2F0aW9uIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC1sb2NhdGlvbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJzaWduYXR1cmVcIiBmbGV4IGNsYXNzPVwiYXBwZm9ybS1zaWduYXR1cmVcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+e3tjdHJsLmZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICA8c2lnbmF0dXJlLWZvcm0gdmFsdWU9XCJjdHJsLm1vZGVsLnZhbHVlXCI+PC9zaWduYXR1cmUtZm9ybT5cXG4nICtcbiAgICAnICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwicGhvdG9cIiBmbGV4IGNsYXNzPVwiYXBwZm9ybS1waG90b1wiPlxcbicgK1xuICAgICcgICAgICA8YXBwZm9ybS1maWVsZC1waG90byBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtcGhvdG8+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0IGZsZXg+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgICAgIDxsYWJlbD57e2N0cmwuZmllbGQucHJvcHMudHlwZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICAgICAgICA8aW5wdXRcXG4nICtcbiAgICAnICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcXG4nICtcbiAgICAnICAgICAgICAgIG5hbWU9XCJpbnB1dE5hbWVcIlxcbicgK1xuICAgICcgICAgICAgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlXCJcXG4nICtcbiAgICAnICAgICAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICAgICAgICBuZy1jbGFzcz1cImN0cmwuZmllbGQucHJvcHMudHlwZVwiXFxuJyArXG4gICAgJyAgICAgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cImZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cImZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8IGZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiIG5nLXNob3c9XCJjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0XCI+e3tjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0fX08L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCIgbmctaGlkZT1cImN0cmwuZmllbGQucHJvcHMuaGVscFRleHRcIj5BIHt7Y3RybC5maWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L25nLWZvcm0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLXN1Ym1pc3Npb24udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1zdWJoZWFkZXI+e3tjdHJsLmZvcm0ucHJvcHMubmFtZX19PC9tZC1zdWJoZWFkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtbGlzdCBjbGFzcz1cImFwcGZvcm0tdmlld1wiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIG5nLWlmPVwiISBjdHJsLmZpZWxkc1wiIGNsYXNzPVwibG9hZGluZ1wiPlxcbicgK1xuICAgICcgICAgTG9hZGluZyBhcHBGb3JtIHN1Ym1pc3Npb24uLi5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBuZy1yZXBlYXQ9XCJmaWVsZCBpbiBjdHJsLmZpZWxkc1wiPlxcbicgK1xuICAgICcgICAgPG5nLXN3aXRjaCBvbj1cImZpZWxkLnByb3BzLnR5cGVcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cInNpZ25hdHVyZVwiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmUgd2l0aC1pbWFnZVwiPlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdlc3R1cmU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxzaWduYXR1cmUgbmctaWY9XCJmaWVsZC52YWx1ZS5sb2NhbFVSSVwiIHZhbHVlPVwiZmllbGQudmFsdWUubG9jYWxVUklcIiBhbHQ9XCJTaWduYXR1cmVcIj48L3NpZ25hdHVyZT5cXG4nICtcbiAgICAnICAgICAgICAgICAgICA8c2lnbmF0dXJlIG5nLWlmPVwiIWZpZWxkLnZhbHVlLmxvY2FsVVJJXCIgdmFsdWU9XCJmaWVsZC52YWx1ZS5pbWdIZWFkZXIgKyBmaWVsZC52YWx1ZS5kYXRhXCIgYWx0PVwiU2lnbmF0dXJlXCI+PC9zaWduYXR1cmU+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxwPnt7ZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cImxvY2F0aW9uXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTMtbGluZVwiPlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBsYWNlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxoMz57e2ZpZWxkLnZhbHVlLmxhdH19Tiwge3tmaWVsZC52YWx1ZS5sb25nfX1XPC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHA+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwibnVtYmVyXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiPlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmZpbHRlcl80PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxoMz57e2ZpZWxkLnZhbHVlfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgICAgICA8cD57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJwaG90b1wiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmUgd2l0aC1pbWFnZVwiPlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNhbWVyYTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPGltZyBuZy1pZj1cImZpZWxkLnZhbHVlLmxvY2FsVVJJXCIgbmctc3JjPVwie3tmaWVsZC52YWx1ZS5sb2NhbFVSSX19XCIgYWx0PVwicGhvdG9cIj48L2ltZz5cXG4nICtcbiAgICAnICAgICAgICAgICAgICA8aW1nIG5nLWlmPVwiIWZpZWxkLnZhbHVlLmxvY2FsVVJJXCIgbmctc3JjPVwie3tmaWVsZC52YWx1ZS5pbWdIZWFkZXIgKyBmaWVsZC52YWx1ZS5kYXRhfX1cIiBhbHQ9XCJwaG90b1wiPjwvaW1nPlxcbicgK1xuICAgICcgICAgICAgICAgICA8L2gzPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtZGVmYXVsdD5cXG4nICtcbiAgICAnICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+dGV4dF9mb3JtYXQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPnt7ZmllbGQudmFsdWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxwPnt7ZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9uZy1zd2l0Y2g+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cImFwcC1mb3JtXCIgbGF5b3V0LXBhZGRpbmcgPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIndvcmtvcmRlckZvcm1cIiBub3ZhbGlkYXRlPlxcbicgK1xuICAgICcgIDxkaXYgbmctcmVwZWF0PVwiZmllbGQgaW4gY3RybC5maWVsZHNcIj5cXG4nICtcbiAgICAnICAgIDxhcHBmb3JtLWZpZWxkIGZpZWxkPVwiZmllbGRcIiBtb2RlbD1cImN0cmwubW9kZWxbZmllbGQucHJvcHMuZmllbGRDb2RlIHx8IGZpZWxkLnByb3BzLl9pZF1cIj48L2FwcGZvcm0tZmllbGQ+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJ3b3JrZmxvdy1hY3Rpb25zIG1kLXBhZGRpbmcgbWQtd2hpdGVmcmFtZS16NFwiPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnkgbWQtaHVlLTFcIiBuZy1jbGljaz1cImN0cmwuYmFjaygkZXZlbnQpXCI+QmFjazwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJjdHJsLmRvbmUoJGV2ZW50LCB3b3Jrb3JkZXJGb3JtLiR2YWxpZClcIiBjbGFzcz1cIm1kLXByaW1hcnlcIj5Db250aW51ZTwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PjwhLS0gd29ya2Zsb3ctYWN0aW9ucy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9kaXY+PCEtLSBhcHAtZm9ybSAtLT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJyZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtZGF0ZS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLWRhdGV0aW1lLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC1udW1iZXIudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC1waG90by50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLXN1Ym1pc3Npb24udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS50cGwuaHRtbC5qcycpO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5hcHBmb3JtJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtJywgW1xuICAnd2ZtLmNvcmUubWVkaWF0b3InXG4sIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbl0pXG5cbi5ydW4oZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgcmVxdWlyZSgnLi4vYXBwZm9ybS1tZWRpYXRvcicpKG1lZGlhdG9yKTtcbn0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW1xuICAnd2ZtLmNvcmUubWVkaWF0b3InLFxuICByZXF1aXJlKCcuL3NlcnZpY2UnKSxcbiAgcmVxdWlyZSgnZmgtd2ZtLXNpZ25hdHVyZScpXG5dKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5ydW4oZnVuY3Rpb24oYXBwZm9ybUNsaWVudCkge1xuICBhcHBmb3JtQ2xpZW50LmluaXQoKTtcbn0pXG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybVN1Ym1pc3Npb24nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgJHEsIGFwcGZvcm1DbGllbnQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tc3VibWlzc2lvbi50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHN1Ym1pc3Npb25Mb2NhbElkOiAnPXN1Ym1pc3Npb25Mb2NhbElkJ1xuICAgICwgc3VibWlzc2lvbklkOiAnPXN1Ym1pc3Npb25JZCdcbiAgICAsIHN1Ym1pc3Npb246ICc9c3VibWlzc2lvbidcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgc3VibWlzc2lvblByb21pc2U7XG4gICAgICBpZiAoJHNjb3BlLnN1Ym1pc3Npb24pIHtcbiAgICAgICAgc3VibWlzc2lvblByb21pc2UgPSAkcS53aGVuKCRzY29wZS5zdWJtaXNzaW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLnN1Ym1pc3Npb25JZCkge1xuICAgICAgICBzdWJtaXNzaW9uUHJvbWlzZSA9IGFwcGZvcm1DbGllbnQuZ2V0U3VibWlzc2lvbigkc2NvcGUuc3VibWlzc2lvbklkKTtcbiAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLnN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgICAgIHN1Ym1pc3Npb25Qcm9taXNlID0gYXBwZm9ybUNsaWVudC5nZXRTdWJtaXNzaW9uTG9jYWwoJHNjb3BlLnN1Ym1pc3Npb25Mb2NhbElkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2FwcGZvcm1TdWJtaXNzaW9uIGNhbGxlZCB3aXRoIG5vIHN1Ym1pc3Npb24nKTtcbiAgICAgIH1cbiAgICAgIHN1Ym1pc3Npb25Qcm9taXNlLnRoZW4oZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICAgICAgICB2YXIgZm9ybVByb21pc2UgPSBzdWJtaXNzaW9uLmZvcm0gPyAkcS53aGVuKHN1Ym1pc3Npb24uZm9ybSkgOiBhcHBmb3JtQ2xpZW50LmdldEZvcm0oc3VibWlzc2lvbi5wcm9wcy5mb3JtSWQpO1xuICAgICAgICByZXR1cm4gZm9ybVByb21pc2UudGhlbihmdW5jdGlvbihmb3JtKSB7XG4gICAgICAgICAgc2VsZi5mb3JtID0gZm9ybTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGZvcm1DbGllbnQuZ2V0RmllbGRzKHN1Ym1pc3Npb24pO1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZpZWxkcykge1xuICAgICAgICBzZWxmLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICRxLCBtZWRpYXRvciwgYXBwZm9ybUNsaWVudCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGZvcm06ICc9JyxcbiAgICAgIGZvcm1JZDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZvcm07XG4gICAgdmFyIGZvcm1Qcm9taXNlID0gJHNjb3BlLmZvcm0gPyAkcS53aGVuKCRzY29wZS5mb3JtKSA6IGFwcGZvcm1DbGllbnQuZ2V0Rm9ybSgkc2NvcGUuZm9ybUlkKTtcbiAgICBmb3JtUHJvbWlzZS50aGVuKGZ1bmN0aW9uKF9mb3JtKSB7XG4gICAgICBmb3JtID0gX2Zvcm07XG4gICAgICBzZWxmLmZpZWxkcyA9IGZvcm0uZmllbGRzO1xuICAgICAgc2VsZi5tb2RlbCA9IHt9O1xuICAgICAgXy5mb3JFYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICBzZWxmLm1vZGVsW2ZpZWxkLnByb3BzLmZpZWxkQ29kZSB8fCBmaWVsZC5wcm9wcy5faWRdID0ge307XG4gICAgICB9KTtcbiAgICB9KVxuICAgIHNlbGYuYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c3RlcDpiYWNrJyk7XG4gICAgfVxuICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGV2ZW50LCBpc1ZhbGlkKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3BhcmVudEZvcm1TdWJtaXR0ZWQnKTtcbiAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCcsIGV2ZW50KVxuICAgICAgICB2YXIgZmlyc3RJbnZhbGlkID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignaW5wdXQubmctaW52YWxpZCcpO1xuICAgICAgICAvLyBpZiB3ZSBmaW5kIG9uZSwgc2V0IGZvY3VzXG4gICAgICAgIGlmIChmaXJzdEludmFsaWQpIHtcbiAgICAgICAgICBmaXJzdEludmFsaWQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHN1Ym1pc3Npb25GaWVsZHMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHNlbGYubW9kZWxbZmllbGQucHJvcHMuZmllbGRDb2RlIHx8IGZpZWxkLnByb3BzLl9pZF0udmFsdWU7XG4gICAgICAgICAgc3VibWlzc2lvbkZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgIGZpZWxkSWQ6IGZpZWxkLnByb3BzLl9pZCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICBhcHBmb3JtQ2xpZW50LmNyZWF0ZVN1Ym1pc3Npb24oZm9ybSwgc3VibWlzc2lvbkZpZWxkcylcbiAgICAgICAgLnRoZW4oYXBwZm9ybUNsaWVudC5zdWJtaXRTdWJtaXNzaW9uKVxuICAgICAgICAudGhlbihhcHBmb3JtQ2xpZW50LmNvbXBvc2VTdWJtaXNzaW9uUmVzdWx0KVxuICAgICAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0KSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6ZG9uZScsIHN1Ym1pc3Npb25SZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3N1Ym1pc3Npb25GaWVsZHMnLCBzdWJtaXNzaW9uRmllbGRzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBmaWVsZDogJz0nLFxuICAgICAgbW9kZWw6ICc9J1xuICAgIH1cbiAgLCBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICB2YXIgcGFyZW50Rm9ybSA9IGVsZW1lbnQucGFyZW50KCk7XG4gICAgICB3aGlsZSAocGFyZW50Rm9ybSAmJiBwYXJlbnRGb3JtLnByb3AoJ3RhZ05hbWUnKSAhPT0gJ0ZPUk0nKSB7XG4gICAgICAgIHBhcmVudEZvcm0gPSBwYXJlbnRGb3JtLnBhcmVudCgpO1xuICAgICAgfTtcbiAgICAgIGlmIChwYXJlbnRGb3JtKSB7XG4gICAgICAgIHZhciBmb3JtQ29udHJvbGxlciA9IGVsZW1lbnQuZmluZCgnbmctZm9ybScpLmNvbnRyb2xsZXIoJ2Zvcm0nKTtcbiAgICAgICAgc2NvcGUuJG9uKCdwYXJlbnRGb3JtU3VibWl0dGVkJyxmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGN0cmwuc3VibWl0KGVsZW1lbnQpO1xuICAgICAgICAgIGZvcm1Db250cm9sbGVyLiRzZXRTdWJtaXR0ZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgICBzZWxmLm1vZGVsID0ge307XG4gICAgaWYgKCRzY29wZS5tb2RlbCAmJiAkc2NvcGUubW9kZWwudmFsdWUpIHtcbiAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1vZGVsKTtcbiAgICB9IGVsc2UgaWYgKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24gJiYgc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIHNlbGYubW9kZWwudmFsdWUgPSBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZTtcbiAgICB9O1xuICAgIHNlbGYuc3VibWl0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICBpZiAoc2VsZi5maWVsZC5wcm9wcy50eXBlID09PSAnbG9jYXRpb24nKSB7XG4gICAgICAgIHZhciBpbnB1dHMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0ge1xuICAgICAgICAgIGxhdDogaW5wdXRzWzBdLnZhbHVlLFxuICAgICAgICAgIGxvbmc6IGlucHV0c1sxXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBzZWxmLm1vZGVsLnZhbHVlO1xuICAgIH1cbiAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRMb2NhdGlvbicsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBmaWVsZDogJz0nXG4gICAgLCBtb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWwgPyBhbmd1bGFyLmNvcHkoJHNjb3BlLm1vZGVsKSA6IHt9O1xuICAgIHNlbGYubW9kZWwudmFsdWUgPSBzZWxmLm1vZGVsLnZhbHVlIHx8IHt9O1xuICAgIHNlbGYuaXNWYWxpZCA9IGZ1bmN0aW9uKGZvcm0sIGVsZW1lbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3JtJywgZm9ybSk7XG4gICAgICBjb25zb2xlLmxvZygnZWxlbWVudCcsIGVsZW1lbnQpO1xuICAgIH1cbiAgICBzZWxmLnNldExvY2F0aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYubW9kZWwudmFsdWUubGF0ID0gcGFyc2VGbG9hdChwb3MuY29vcmRzLmxhdGl0dWRlKTtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxvbmcgPSBwYXJzZUZsb2F0KHBvcy5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygncG9zaXRpb24gc2V0Jywgc2VsZi5tb2RlbC52YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBnZXQgY3VycmVudCBwb3NpdGlvbicpO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxhdCA9IC0xO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxvbmcgPSAtMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRQaG90bycsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCBtZWRpYXRvciwgbW9iaWxlQ2FtZXJhLCBkZXNrdG9wQ2FtZXJhKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLXBob3RvLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZmllbGQ6ICc9J1xuICAgICwgbW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgICBzZWxmLm1vZGVsID0gJHNjb3BlLm1vZGVsOyAvLyA/IGFuZ3VsYXIuY29weSgkc2NvcGUubW9kZWwpIDoge307XG4gICAgc2VsZi5pc1ZhbGlkID0gZnVuY3Rpb24oZm9ybSwgZWxlbWVudCkge1xuICAgICAgY29uc29sZS5sb2coJ2Zvcm0nLCBmb3JtKTtcbiAgICAgIGNvbnNvbGUubG9nKCdlbGVtZW50JywgZWxlbWVudCk7XG4gICAgfVxuICAgIHNlbGYuY2FwdHVyZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCR3aW5kb3cuY29yZG92YSkge1xuICAgICAgICBtb2JpbGVDYW1lcmEuY2FwdHVyZSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNhcHR1cmUpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0gY2FwdHVyZTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc2t0b3BDYW1lcmEuY2FwdHVyZSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0gZGF0YVVybDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZE51bWJlcicsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1udW1iZXIudHBsLmh0bWwnKVxuICwgc2NvcGU6IHtcbiAgIGZpZWxkOiAnPScsXG4gICBtb2RlbDogJz0nLFxuIH1cbiAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7XG4gICBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICBzZWxmLm1vZGVsLnZhbHVlID0gcGFyc2VGbG9hdChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSk7XG4gICB9O1xuIH1cbiAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gfTtcbn0pO1xuXG5mdW5jdGlvbiBnZXREYXRlKGQpe1xuICByZXR1cm4gJ1lZWVktTU0tREQnLnJlcGxhY2UoJ1lZWVknLCBkLmdldEZ1bGxZZWFyKCkpLnJlcGxhY2UoJ01NJywgdHdvRGlnaShkLmdldE1vbnRoKCkrMSkpLnJlcGxhY2UoJ0REJywgdHdvRGlnaShkLmdldERhdGUoKSkpO1xufTtcblxuZnVuY3Rpb24gZ2V0VGltZShkKXtcbiAgcmV0dXJuICdISDptbScucmVwbGFjZSgnSEgnLCB0d29EaWdpKGQuZ2V0SG91cnMoKSkpLnJlcGxhY2UoJ21tJywgdHdvRGlnaShkLmdldE1pbnV0ZXMoKSkpO1xufTtcblxuZnVuY3Rpb24gdHdvRGlnaShudW0pe1xuICBpZiAobnVtIDwgMTApe1xuICAgIHJldHVybiAnMCcgKyBudW0udG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGREYXRldGltZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbCcpXG4gLCBzY29wZToge1xuICAgZmllbGQ6ICc9JyxcbiAgIG1vZGVsOiAnPScsXG4gfVxuICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgc2VsZi5tb2RlbCA9ICRzY29wZS5tb2RlbDtcbiAgIGlmIChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uICYmIHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKSB7XG4gICAgIHNlbGYubW9kZWwudmFsdWUgPSBuZXcgRGF0ZShzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSk7XG4gICB9O1xuICAgc2VsZi51cGRhdGVNb2RlbCA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuZGF0ZSk7XG4gICAgIHZhciB0aW1lID0gbmV3IERhdGUoc2VsZi5tb2RlbC50aW1lKTtcbiAgICAgJHNjb3BlLm1vZGVsLnZhbHVlID0gZ2V0RGF0ZShkYXRlKSArICcgJyArIGdldFRpbWUodGltZSk7XG4gICB9XG4gfVxuICwgY29udHJvbGxlckFzOiAnY3RybCdcbiB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybUZpZWxkRGF0ZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sJylcbiAsIHNjb3BlOiB7XG4gICBmaWVsZDogJz0nLFxuICAgbW9kZWw6ICc9JyxcbiB9XG4gLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuZmllbGQgPSAkc2NvcGUuZmllbGQ7XG4gICBzZWxmLm1vZGVsID0gJHNjb3BlLm1vZGVsO1xuICAgaWYgKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24gJiYgc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpIHtcbiAgICAgc2VsZi5tb2RlbC52YWx1ZSA9IG5ldyBEYXRlKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKTtcbiAgIH07XG4gICBzZWxmLnVwZGF0ZU1vZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBkYXRlID0gbmV3IERhdGUoc2VsZi5tb2RlbC5kYXRlKTtcbiAgICAgJHNjb3BlLm1vZGVsLnZhbHVlID0gZ2V0RGF0ZShkYXRlKTtcbiAgIH1cbiB9XG4gLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRUaW1lJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gcmV0dXJuIHtcbiAgIHJlc3RyaWN0OiAnRSdcbiAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwnKVxuICwgc2NvcGU6IHtcbiAgIGZpZWxkOiAnPScsXG4gICBtb2RlbDogJz0nLFxuIH1cbiAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7XG4gICBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICBzZWxmLm1vZGVsLnZhbHVlID0gbmV3IERhdGUoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpO1xuICAgfTtcbiAgIHNlbGYudXBkYXRlTW9kZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnRpbWUpO1xuICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBnZXRUaW1lKHRpbWUpO1xuICAgfVxuIH1cbiAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gfTtcbn0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjbGllbnQgPSByZXF1aXJlKCcuLi9hcHBmb3JtJylcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmFwcGZvcm0uc2VydmljZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5zZXJ2aWNlJywgW10pXG5cbi5zZXJ2aWNlKCdhcHBmb3JtQ2xpZW50JywgZnVuY3Rpb24oJHEpIHtcbiAgdmFyIHNlcnZpY2UgPSB7fTtcblxuICB2YXIgbWV0aG9kcyA9IFtcbiAgICAnaW5pdCcsXG4gICAgJ2xpc3QnLFxuICAgICdnZXRGb3JtJyxcbiAgICAnZ2V0U3VibWlzc2lvbkxvY2FsJyxcbiAgICAnZ2V0U3VibWlzc2lvbicsXG4gICAgJ2dldFN1Ym1pc3Npb25zJyxcbiAgICAnZ2V0RmllbGRzJyxcbiAgICAnY3JlYXRlU3VibWlzc2lvbicsXG4gICAgJ3N1Ym1pdFN1Ym1pc3Npb24nLFxuICAgICd1cGxvYWRTdWJtaXNzaW9uJyxcbiAgICAnY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQnLFxuICAgICdzeW5jU3RlcFJlc3VsdCcsXG4gICAgJ3dhdGNoU3VibWlzc2lvbk1vZGVsJ1xuICBdO1xuXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICBzZXJ2aWNlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKGNsaWVudFttZXRob2RdLmFwcGx5KGNsaWVudCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlcnZpY2U7XG59KTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xpZW50ID0gcmVxdWlyZSgnLi9hcHBmb3JtJylcblxuZnVuY3Rpb24gd3JhcHBlcihtZWRpYXRvcikge1xuICB2YXIgaW5pdFByb21pc2UgPSBjbGllbnQuaW5pdCgpO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOmluaXQnLCBmdW5jdGlvbigpIHtcbiAgICBpbml0UHJvbWlzZVxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTppbml0Jyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06aW5pdCcsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCdpbml0JywgZnVuY3Rpb24oKSB7XG4gICAgbWVkaWF0b3IucHVibGlzaCgncHJvbWlzZTppbml0JywgaW5pdFByb21pc2UpO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOmZvcm06bGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgIGNsaWVudC5saXN0KClcbiAgICAudGhlbihmdW5jdGlvbihmb3Jtcykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpmb3JtOmxpc3QnLCBmb3Jtcyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06Zm9ybTpsaXN0JywgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOmZvcm06cmVhZCcsIGZ1bmN0aW9uKGZvcm1JZCkge1xuICAgIGNsaWVudC5nZXRGb3JtKGZvcm1JZClcbiAgICAudGhlbihmdW5jdGlvbihmb3JtKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOmZvcm06cmVhZDonICsgZm9ybUlkLCBmb3JtKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpmb3JtOnJlYWQ6JyArIGZvcm1JZCwgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246bG9jYWw6cmVhZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgY2xpZW50LmdldFN1Ym1pc3Npb25Mb2NhbChzdWJtaXNzaW9uTG9jYWxJZClcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246bG9jYWw6cmVhZDonK3N1Ym1pc3Npb25Mb2NhbElkLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOmxvY2FsOnJlYWQ6JytzdWJtaXNzaW9uTG9jYWxJZCwgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246cmVtb3RlOnJlYWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgICBjbGllbnQuZ2V0U3VibWlzc2lvbihzdWJtaXNzaW9uSWQpXG4gICAgLnRoZW4oZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnJlbW90ZTpyZWFkOicrc3VibWlzc2lvbklkLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOnJlbW90ZTpyZWFkOicrc3VibWlzc2lvbklkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpsaXN0OnJlbW90ZTpyZWFkJywgZnVuY3Rpb24oc3VibWlzc2lvbklkcywgaWQpIHtcbiAgICBjbGllbnQuZ2V0U3VibWlzc2lvbnMoc3VibWlzc2lvbklkcylcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9ucykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmxpc3Q6cmVtb3RlOnJlYWQ6JytpZCwgc3VibWlzc2lvbnMpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246bGlzdDpyZW1vdGU6cmVhZDonK2lkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpmaWVsZDpsaXN0JywgZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICAgIGNsaWVudC5nZXRGaWVsZHMoc3VibWlzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihmaWVsZHMpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpmaWVsZDpsaXN0Oicrc3VibWlzc2lvbi5nZXRMb2NhbElkKCksIGZpZWxkcyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjpmaWVsZDpsaXN0Oicrc3VibWlzc2lvbi5nZXRMb2NhbElkKCksIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmNyZWF0ZScsIGZ1bmN0aW9uKGZvcm0sIHN1Ym1pc3Npb25GaWVsZHMsIHRzKSB7XG4gICAgY2xpZW50LmNyZWF0ZVN1Ym1pc3Npb24oZm9ybSwgc3VibWlzc2lvbkZpZWxkcylcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246Y3JlYXRlOicgKyB0cywgc3VibWlzc2lvbik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjpjcmVhdGU6JyArIHRzLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpzdWJtaXQnLCBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgY2xpZW50LnN1Ym1pdFN1Ym1pc3Npb24oc3VibWlzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246c3VibWl0OicgKyBzdWJtaXNzaW9uLmdldExvY2FsSWQoKSwgc3VibWlzc2lvbik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjpzdWJtaXQ6JyArIHN1Ym1pc3Npb24uZ2V0TG9jYWxJZCgpLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjp1cGxvYWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgY2xpZW50LnVwbG9hZFN1Ym1pc3Npb24oc3VibWlzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjp1cGxvYWQ6JyArIHN1Ym1pc3Npb24ucHJvcHMuX2x1ZGlkLCBzdWJtaXNzaW9uSWQpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246dXBsb2FkOicgKyBzdWJtaXNzaW9uLnByb3BzLl9sdWRpZCwgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGllbnQuYWRkU3VibWlzc2lvbkNvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24oc3VibWlzc2lvblJlc3VsdCwgbWV0YURhdGEpIHtcbiAgICBpZiAobWV0YURhdGEpIHtcbiAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgc3VibWlzc2lvblJlc3VsdDogc3VibWlzc2lvblJlc3VsdCxcbiAgICAgICAgbWV0YURhdGE6IG1ldGFEYXRhXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnbWV0YURhdGEnLCBtZXRhRGF0YSk7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmNvbXBsZXRlJywgZXZlbnQpXG4gICAgfVxuICB9KVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBxID0gcmVxdWlyZSgncScpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIGNsaWVudCA9IHt9O1xudmFyIGluaXRQcm9taXNlO1xuXG5jbGllbnQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoaW5pdFByb21pc2UpIHtcbiAgICByZXR1cm4gaW5pdFByb21pc2U7XG4gIH1cbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYubGlzdGVuZXJzID0gW107XG4gIGluaXRQcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkZmguZm9ybXMuaW5pdChmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3JtcyBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgJGZoLmZvcm1zLm9uKFwic3VibWlzc2lvbjpzdWJtaXR0ZWRcIiwgZnVuY3Rpb24oc3VibWlzc2lvbklkKSB7XG4gICAgdmFyIHN1Ym1pc3Npb24gPSB0aGlzO1xuICAgIHZhciBtZXRhRGF0YSA9IHN1Ym1pc3Npb24uZ2V0KCdtZXRhRGF0YScpO1xuICAgIGlmIChzZWxmLmxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgIHNlbGYuY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQoc3VibWlzc2lvbikudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0KSB7XG4gICAgICAgIHNlbGYubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgICBsaXN0ZW5lcihzdWJtaXNzaW9uUmVzdWx0LCBtZXRhRGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGluaXRQcm9taXNlO1xufTtcblxuY2xpZW50LmFkZFN1Ym1pc3Npb25Db21wbGV0ZUxpc3RlbmVyID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG59O1xuXG5jbGllbnQubGlzdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgJGZoLmZvcm1zLmdldEZvcm1zKGZ1bmN0aW9uKGVycm9yLCBmb3Jtc01vZGVsKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgZm9ybXMgPSBmb3Jtc01vZGVsLnByb3BzLmZvcm1zO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmb3Jtcyk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmNsaWVudC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybUlkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguZm9ybXMuZ2V0Rm9ybSh7Zm9ybUlkOiBmb3JtSWR9LCBmdW5jdGlvbiAoZXJyb3IsIGZvcm0pIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZm9ybSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb25Mb2NhbCA9IGZ1bmN0aW9uKHN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguZm9ybXMuZ2V0U3VibWlzc2lvbnMoZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb25zKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdWJtaXNzaW9ucy5nZXRTdWJtaXNzaW9uQnlNZXRhKHtfbHVkaWQ6IHN1Ym1pc3Npb25Mb2NhbElkfSwgZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb24pIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb24gPSBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICRmaC5mb3Jtcy5kb3dubG9hZFN1Ym1pc3Npb24oe3N1Ym1pc3Npb25JZDogc3VibWlzc2lvbklkfSwgZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb24pIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb25zID0gZnVuY3Rpb24oc3VibWlzc2lvbklkcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBwcm9taXNlcyA9IHN1Ym1pc3Npb25JZHMubWFwKGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgIHJldHVybiBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5nZXRTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcS5hbGxTZXR0bGVkKHByb21pc2VzKTtcbn1cblxuY2xpZW50LmdldEZpZWxkcyA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN1Ym1pc3Npb24uZ2V0Rm9ybShmdW5jdGlvbihlcnJvciwgZm9ybSkge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGZpZWxkcyA9IGZvcm0uZmllbGRzO1xuICAgICAgdmFyIHFzID0gW107XG4gICAgICBfLmZvck93bihmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9kZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgICAgICAgcXMucHVzaChfZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgIHN1Ym1pc3Npb24uZ2V0SW5wdXRWYWx1ZUJ5RmllbGRJZChmaWVsZC5nZXRGaWVsZElkKCksIGZ1bmN0aW9uKGVycm9yLCBmaWVsZFZhbHVlcykge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgX2RlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmllbGQudmFsdWUgPSBmaWVsZFZhbHVlc1swXTtcbiAgICAgICAgICBfZGVmZXJyZWQucmVzb2x2ZShmaWVsZFZhbHVlcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBxLmFsbChxcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmaWVsZHMpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuLyoqXG4qIFRoZSBmaWVsZHMgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mIHtmaWVsZElkOiA8Li4uPiwgdmFsdWU6IDwuLi4+fSBvYmplY3RzXG4qL1xuY2xpZW50LmNyZWF0ZVN1Ym1pc3Npb24gPSBmdW5jdGlvbihmb3JtLCBzdWJtaXNzaW9uRmllbGRzKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICB2YXIgc3VibWlzc2lvbiA9IGZvcm0ubmV3U3VibWlzc2lvbigpO1xuICAgIHZhciBkcyA9IFtdO1xuICAgIF8uZm9yRWFjaChzdWJtaXNzaW9uRmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgdmFyIGQgPSBxLmRlZmVyKCk7XG4gICAgICBkcy5wdXNoKGQucHJvbWlzZSk7XG4gICAgICBzdWJtaXNzaW9uLmFkZElucHV0VmFsdWUoZmllbGQsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBxLmFsbChkcylcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuY2xpZW50LnN1Ym1pdFN1Ym1pc3Npb24gPSBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICBzdWJtaXNzaW9uLnN1Ym1pdChmdW5jdGlvbihlcnJvciwgc3VibWl0UmVzcG9uc2UpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb24pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5jbGllbnQudXBsb2FkU3VibWlzc2lvbiA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN1Ym1pc3Npb24udXBsb2FkKGZ1bmN0aW9uKGVycm9yLCB1cGxvYWRUYXNrKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9O1xuICAgICAgdXBsb2FkVGFzay5zdWJtaXNzaW9uTW9kZWwoZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb25Nb2RlbCkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb25Nb2RlbCk7XG4gICAgICB9KVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5jbGllbnQuY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQgPSBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gIHZhciBzdWJtaXNzaW9uUmVzdWx0ID0ge1xuICAgICAgc3VibWlzc2lvbkxvY2FsSWQ6IHN1Ym1pc3Npb24ucHJvcHMuX2x1ZGlkXG4gICAgLCBmb3JtSWQ6IHN1Ym1pc3Npb24ucHJvcHMuZm9ybUlkXG4gICAgLCBzdGF0dXM6IHN1Ym1pc3Npb24ucHJvcHMuc3RhdHVzXG4gIH07XG4gIGlmIChzdWJtaXNzaW9uLnByb3BzLl9pZCkge1xuICAgIHN1Ym1pc3Npb25SZXN1bHQuc3VibWlzc2lvbklkID0gc3VibWlzc2lvbi5wcm9wcy5faWQ7XG4gIH1cbiAgcmV0dXJuIHEud2hlbihzdWJtaXNzaW9uUmVzdWx0KTtcbn07XG5cbmNsaWVudC5zeW5jU3RlcFJlc3VsdCA9IGZ1bmN0aW9uKHdvcmtvcmRlciwgc3RlcFJlc3VsdCkge1xuICAvLyBraWNrLW9mZiBhbiBhcHBmb3JtIHVwbG9hZCwgdXBkYXRlIHRoZSB3b3Jrb3JkZXIgd2hlbiBjb21wbGV0ZVxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgcmV0dXJuIGluaXRQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2VsZi5nZXRTdWJtaXNzaW9uTG9jYWwoc3RlcFJlc3VsdC5zdWJtaXNzaW9uLnN1Ym1pc3Npb25Mb2NhbElkKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIHN1Ym1pc3Npb24uc2V0KCdtZXRhRGF0YScsIHtcbiAgICAgICAgd2ZtOiB7XG4gICAgICAgICAgd29ya29yZGVySWQ6IHdvcmtvcmRlci5pZCxcbiAgICAgICAgICBzdGVwOiBzdGVwUmVzdWx0LnN0ZXAsXG4gICAgICAgICAgdGltZXN0YW1wOiBzdGVwUmVzdWx0LnRpbWVzdGFtcFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzdWJtaXNzaW9uO1xuICAgIH0pXG4gICAgLnRoZW4oc2VsZi51cGxvYWRTdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25Nb2RlbCkge1xuICAgICAgc2VsZi53YXRjaFN1Ym1pc3Npb25Nb2RlbChzdWJtaXNzaW9uTW9kZWwpOyAvLyBuZWVkIHRoaXMgdG8gdHJpZ2dldCB0aGUgZ2xvYmFsIGV2ZW50XG4gICAgICByZXR1cm4gc3VibWlzc2lvbk1vZGVsO1xuICAgIH0pO1xufTtcblxuY2xpZW50LndhdGNoU3VibWlzc2lvbk1vZGVsID0gZnVuY3Rpb24oc3VibWlzc2lvbk1vZGVsKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgc3VibWlzc2lvbk1vZGVsLm9uKCdzdWJtaXR0ZWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgICAkZmguZm9ybXMuZG93bmxvYWRTdWJtaXNzaW9uKHtzdWJtaXNzaW9uSWQ6IHN1Ym1pc3Npb25JZH0sIGZ1bmN0aW9uKGVycm9yLCByZW1vdGVTdWJtaXNzaW9uKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVtb3RlU3VibWlzc2lvbik7XG4gICAgfSk7XG4gIH0pO1xuICAvLyAgVE9ETzogRG8gd2UgbmVlZCBhIHRpbWVvdXQgaGVyZSB0byBjbGVhbnVwIHN1Ym1pc3Npb25Nb2RlbCBsaXN0ZW5lcnM/XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGllbnQ7XG4iLCJyZXF1aXJlKCcuL3NpZ25hdHVyZS1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3NpZ25hdHVyZS50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNpZ25hdHVyZScpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9zaWduYXR1cmUtZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwic2lnbmF0dXJlLWZvcm1cIj5cXG4nICtcbiAgICAnICA8Y2FudmFzIHRhYmluZGV4PVwiMFwiPjwvY2FudmFzPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3NpZ25hdHVyZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8aW1nIG5nLXNyYz1cInt7Y3RybC5zaWduYXR1cmV9fVwiPjwvaW1nPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FudmFzRHJhd3IgPSByZXF1aXJlKCcuLi9jYW52YXMtZHJhd3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnNpZ25hdHVyZSc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKVxuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2lnbmF0dXJlRm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB2YWx1ZTogJz0nLFxuICAgICAgb3B0aW9uczogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucyB8fCB7fTtcbiAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdXBwb3J0JywgJ29udG91Y2hzdGFydCcgaW4gJGRvY3VtZW50WzBdKTtcbiAgICAgIHZhciBkcmF3ciA9ICdvbnRvdWNoc3RhcnQnIGluICRkb2N1bWVudFswXVxuICAgICAgICA/IG5ldyBjYW52YXNEcmF3ci5DYW52YXNEcmF3cihlbGVtZW50LCBvcHRpb25zLCAkZG9jdW1lbnQpXG4gICAgICAgIDogbmV3IGNhbnZhc0RyYXdyLkNhbnZhc0RyYXdyTW91c2UoZWxlbWVudCwgb3B0aW9ucywgJGRvY3VtZW50KTtcblxuICAgICAgdmFyICRjYW52YXMgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF0pO1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICRjYW52YXMub24oJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHJsLnN1Ym1pdChlbGVtZW50KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5zdWJtaXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgICAgICAgJHNjb3BlLnZhbHVlID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdzaWduYXR1cmUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgdmFsdWU6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2lnbmF0dXJlID0gJHNjb3BlLnZhbHVlO1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FudmFzRHJhd3JNb3VzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gIHZhciBjYW52YXMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgY2FudmFzLndpZHRoID0gKHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgY2FudmFzLmhlaWdodCA9IDIwMDtcbiAgY2FudmFzLnN0eWxlLndpZHRoID0gJyc7XG5cbiAgLy8gc2V0IHByb3BzIGZyb20gb3B0aW9ucywgYnV0IHRoZSBkZWZhdWx0cyBhcmUgZm9yIHRoZSBjb29sIGtpZHNcbiAgY3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMuc2l6ZSB8fCA1O1xuICBjdHgubGluZUNhcCA9IG9wdGlvbnMubGluZUNhcCB8fCBcInJvdW5kXCI7XG4gIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8ICdibHVlJztcblxuICAvLyBsYXN0IGtub3duIHBvc2l0aW9uXG4gIHZhciBwb3MgPSB7IHg6IDAsIHk6IDAgfTtcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZHJhdyk7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzZXRQb3NpdGlvbik7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3RvcCk7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHN0b3ApO1xuXG4gIC8vIG5ldyBwb3NpdGlvbiBmcm9tIG1vdXNlIGV2ZW50XG4gIGZ1bmN0aW9uIHNldFBvc2l0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjYW52YXMuZm9jdXMoKTtcbiAgICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgb2Zmc2V0ID0ge1xuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGxlZnQ6IHJlY3QubGVmdFxuICAgIH07XG4gICAgcG9zLnggPSBlLmNsaWVudFggLSBvZmZzZXQubGVmdDtcbiAgICBwb3MueSA9IGUuY2xpZW50WSAtIG9mZnNldC50b3A7XG4gIH1cblxuICBmdW5jdGlvbiBkcmF3KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyBtb3VzZSBsZWZ0IGJ1dHRvbiBtdXN0IGJlIHByZXNzZWRcbiAgICBpZiAoZS5idXR0b25zICE9PSAxKSByZXR1cm47XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7IC8vIGJlZ2luXG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmNvbG9yO1xuXG4gICAgY3R4Lm1vdmVUbyhwb3MueCwgcG9zLnkpOyAvLyBmcm9tXG5cbiAgICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgb2Zmc2V0ID0ge1xuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGxlZnQ6IHJlY3QubGVmdFxuICAgIH07XG4gICAgcG9zLnggPSBlLmNsaWVudFggLSBvZmZzZXQubGVmdDtcbiAgICBwb3MueSA9IGUuY2xpZW50WSAtIG9mZnNldC50b3A7XG4gICAgY3R4LmxpbmVUbyhwb3MueCwgcG9zLnkpOyAvLyB0b1xuXG4gICAgY3R4LnN0cm9rZSgpOyAvLyBkcmF3IGl0IVxuXG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgIGNhbnZhcy5ibHVyKCk7XG4gIH1cbn07XG5cbnZhciBDYW52YXNEcmF3ciA9IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdGlvbnMsICRkb2N1bWVudCkge1xuICB2YXIgY2FudmFzID0gZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF07XG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnXG4gIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5vZmZzZXRXaWR0aDtcbiAgY2FudmFzLnN0eWxlLndpZHRoID0gJyc7XG5cbiAgLy8gc2V0IHByb3BzIGZyb20gb3B0aW9ucywgYnV0IHRoZSBkZWZhdWx0cyBhcmUgZm9yIHRoZSBjb29sIGtpZHNcbiAgY3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMuc2l6ZSB8fCA1O1xuICBjdHgubGluZUNhcCA9IG9wdGlvbnMubGluZUNhcCB8fCAncm91bmQnO1xuICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnYmx1ZSc7XG4gIGN0eC5wWCA9IHVuZGVmaW5lZDtcbiAgY3R4LnBZID0gdW5kZWZpbmVkO1xuXG4gIHZhciBsaW5lcyA9IFssLF07XG4gIHZhciByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIHZhciBvZmZzZXQgPSB7XG4gICAgdG9wOiByZWN0LnRvcCArICRkb2N1bWVudFswXS5ib2R5LnNjcm9sbFRvcCxcbiAgICBsZWZ0OiByZWN0LmxlZnQgKyAkZG9jdW1lbnRbMF0uYm9keS5zY3JvbGxMZWZ0XG4gIH07XG5cbiAgdmFyIHNlbGYgPSB7XG4gICAgLy9iaW5kIGNsaWNrIGV2ZW50c1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gdXNlIGFuZ3VsZXIuZWxlbWVudCNvbiBmb3IgYXV0b21hdGljIGxpc3RlbmVyIGNsZWFudXBcbiAgICAgIHZhciBjYW52YXNOZyA9IGFuZ3VsYXIuZWxlbWVudChjYW52YXMpO1xuICAgICAgLy9zZXQgcFggYW5kIHBZIGZyb20gZmlyc3QgY2xpY2tcbiAgICAgIGNhbnZhc05nLm9uKCd0b3VjaHN0YXJ0Jywgc2VsZi5wcmVEcmF3KTtcbiAgICAgIGNhbnZhc05nLm9uKCd0b3VjaG1vdmUnLCBzZWxmLmRyYXcpO1xuICAgICAgY2FudmFzTmcub24oJ3RvdWNoZW5kJywgc2VsZi5zdG9wKTtcbiAgICAgIGNhbnZhc05nLm9uKCd0b3VjaGNhbmNlbCcsIHNlbGYuc3RvcCk7XG4gICAgfSxcblxuICAgIHByZURyYXc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjYW52YXMuZm9jdXMoKTtcbiAgICAgIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBvZmZzZXQgPSB7XG4gICAgICAgIHRvcDogcmVjdC50b3AgKyAkZG9jdW1lbnRbMF0uYm9keS5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHJlY3QubGVmdCArICRkb2N1bWVudFswXS5ib2R5LnNjcm9sbExlZnRcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdG91Y2ggPSBldmVudC50b3VjaGVzW2ldO1xuICAgICAgICB2YXIgaWQgICAgICA9IHRvdWNoLmlkZW50aWZpZXI7XG5cbiAgICAgICAgbGluZXNbaWRdID0ge1xuICAgICAgICAgIHggICAgIDogdG91Y2gucGFnZVggLSBvZmZzZXQubGVmdCxcbiAgICAgICAgICB5ICAgICA6IHRvdWNoLnBhZ2VZIC0gb2Zmc2V0LnRvcCxcbiAgICAgICAgICBjb2xvciA6IG9wdGlvbnMuY29sb3JcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZHJhdzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdG91Y2ggPSBldmVudC50b3VjaGVzW2ldO1xuICAgICAgICB2YXIgaWQgPSB0b3VjaC5pZGVudGlmaWVyLFxuXG4gICAgICAgIG1vdmVYID0gdG91Y2gucGFnZVggLSBvZmZzZXQubGVmdCAtIGxpbmVzW2lkXS54LFxuICAgICAgICBtb3ZlWSA9IHRvdWNoLnBhZ2VZIC0gb2Zmc2V0LnRvcCAtIGxpbmVzW2lkXS55O1xuXG4gICAgICAgIHZhciByZXQgPSBzZWxmLm1vdmUoaWQsIG1vdmVYLCBtb3ZlWSk7XG4gICAgICAgIGxpbmVzW2lkXS54ID0gcmV0Lng7XG4gICAgICAgIGxpbmVzW2lkXS55ID0gcmV0Lnk7XG4gICAgICB9O1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbihpLCBjaGFuZ2VYLCBjaGFuZ2VZKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lc1tpXS5jb2xvcjtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8obGluZXNbaV0ueCwgbGluZXNbaV0ueSk7XG5cbiAgICAgIGN0eC5saW5lVG8obGluZXNbaV0ueCArIGNoYW5nZVgsIGxpbmVzW2ldLnkgKyBjaGFuZ2VZKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgcmV0dXJuIHsgeDogbGluZXNbaV0ueCArIGNoYW5nZVgsIHk6IGxpbmVzW2ldLnkgKyBjaGFuZ2VZIH07XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgY2FudmFzLmJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNlbGYuaW5pdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ2FudmFzRHJhd3I6IENhbnZhc0RyYXdyLFxuICBDYW52YXNEcmF3ck1vdXNlOiBDYW52YXNEcmF3ck1vdXNlXG59O1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmNhbWVyYS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvY2FtZXJhLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3Zm0tY2FtZXJhXCIgZmxleD5cXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQmFja1wiIG5nLWNsaWNrPVwiY3RybC5jYW5jZWwoKVwiIGZsZXg+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+YXJyb3dfYmFjazwvbWQtaWNvbj5cXG4nICtcbiAgICAnICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8dmlkZW8gIG5nLXNob3c9XCJjdHJsLmNhbWVyYU9uXCIgYXV0b3BsYXk+PC92aWRlbz5cXG4nICtcbiAgICAnICA8Y2FudmFzIG5nLWhpZGU9XCJjdHJsLmNhbWVyYU9uXCI+PC9jYW52YXM+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIndmbS1jYW1lcmEtYWN0aW9uc1wiIHN0eWxlPVwiei1pbmRleDogMTAwMFwiPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBuZy1zaG93PVwiY3RybC5jYW1lcmFPblwiIGNsYXNzPVwid2ZtLWNhbWVyYS1idG5cIiBuZy1jbGljaz1cImN0cmwuc25hcCgpXCI+PC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIG5nLWhpZGU9XCJjdHJsLmNhbWVyYU9uXCIgY2xhc3M9XCJ3Zm0tY2FtZXJhLWNvbmZpcm1hdGlvbi1idG4gbWQtd2FyblwiIG5nLWNsaWNrPVwiY3RybC5zdGFydENhbWVyYSgpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBuZy1oaWRlPVwiY3RybC5jYW1lcmFPblwiIGNsYXNzPVwid2ZtLWNhbWVyYS1jb25maXJtYXRpb24tYnRuXCIgbmctY2xpY2s9XCJjdHJsLmRvbmUoKVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2hlY2s8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwicmVxdWlyZSgnLi9jYW1lcmEudHBsLmh0bWwuanMnKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uY2FtZXJhJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlJylcbl0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uY2FtZXJhLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmNhbWVyYS5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2NhbWVyYScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvciwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9jYW1lcmEudHBsLmh0bWwnKSxcbiAgICBzY29wZToge1xuICAgICAgbW9kZWw6ICc9JyxcbiAgICAgIGF1dG9zdGFydDogJz0nXG4gICAgfSxcbiAgICBjb21waWxlOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hdHRyKCdmbGV4JywgdHJ1ZSk7XG4gICAgfSxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgZWxlbWVudCA9ICRlbGVtZW50WzBdLFxuICAgICAgICAgIGNhbnZhcyA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdLFxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSxcbiAgICAgICAgICB2aWRlbyA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3ZpZGVvJylbMF0sXG4gICAgICAgICAgc3RyZWFtLCB3aWR0aCwgaGVpZ2h0LCB6b29tO1xuXG4gICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdmlkZW8uaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICBzZWxmLmNhbWVyYU9uID0gZmFsc2U7XG4gICAgICAgIGlmICgkc2NvcGUuYXV0b3N0YXJ0KSB7XG4gICAgICAgICAgc2VsZi5zdGFydENhbWVyYSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcblxuICAgICAgc2VsZi5zbmFwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzeCA9ICh2aWRlby5jbGllbnRXaWR0aCAtIHdpZHRoICkgLyAyO1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgc3gvem9vbSwgMCwgd2lkdGgvem9vbSwgaGVpZ2h0L3pvb20sIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBzZWxmLnN0b3BDYW1lcmEoKTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc3RhcnRDYW1lcmEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVE9ETzogaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZ2V0dXNlcm1lZGlhLWpzXG4gICAgICAgIHZhciBnZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYVxuICAgICAgICBnZXRVc2VyTWVkaWEuY2FsbChuYXZpZ2F0b3IsIHsgJ3ZpZGVvJzogdHJ1ZSB9LCBmdW5jdGlvbihfc3RyZWFtKSB7XG4gICAgICAgICAgc3RyZWFtID0gX3N0cmVhbTtcbiAgICAgICAgICB2aWRlby5zcmMgPSAkd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5tb2RlbCA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLmNhbWVyYU9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB2aWRlb1dpZHRoO1xuICAgICAgICAgICAgdmlkZW8ub25sb2Fkc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmlkZW9XaWR0aCA9IHZpZGVvLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlkZW8ub25jYW5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHpvb20gPSB2aWRlb1dpZHRoIC8gdmlkZW8uY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgIHZpZGVvLnN0eWxlLmxlZnQgPSAtKHZpZGVvLmNsaWVudFdpZHRoIC0gd2lkdGggKSAvIDIgKyAncHgnO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdWaWRlbyBjYXB0dXJlIGVycm9yOiAnLCBlcnJvci5jb2RlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc3RvcENhbWVyYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICAgIHNlbGYuY2FtZXJhT24gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zdG9wQ2FtZXJhKCk7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpjYW1lcmE6Y2FuY2VsJyk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUubW9kZWwgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuc3RvcENhbWVyYSgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZXJhID0gcmVxdWlyZSgnLi4vY2FtZXJhJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5jYW1lcmEuc2VydmljZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uY2FtZXJhLnNlcnZpY2UnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pXG5cbi5mYWN0b3J5KCdtb2JpbGVDYW1lcmEnLCBmdW5jdGlvbigkcSwgJHdpbmRvdywgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIGNhbWVyYTtcbn0pXG5cbi5mYWN0b3J5KCdkZXNrdG9wQ2FtZXJhJywgZnVuY3Rpb24oJG1kRGlhbG9nLCBtZWRpYXRvcikge1xuICB2YXIgY2FtZXJhID0ge307XG4gIGNhbWVyYS5jYXB0dXJlID0gZnVuY3Rpb24oZXYpIHtcbiAgICByZXR1cm4gJG1kRGlhbG9nLnNob3coe1xuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gQ2FtZXJhQ3RybCgkc2NvcGUsIG1lZGlhdG9yKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgJHNjb3BlLmRhdGEgPSBudWxsO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoISBfLmlzRW1wdHkoJHNjb3BlLmRhdGEpICkge1xuICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoJHNjb3BlLmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOmNhbWVyYTpjYW5jZWwnLCAkc2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRtZERpYWxvZy5jYW5jZWwoJ1Bob3RvIGNhcHR1cmUgY2FuY2VsbGVkLicpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogJzxjYW1lcmEgbW9kZWw9XCJkYXRhXCIgYXV0b3N0YXJ0PVwidHJ1ZVwiPjwvY2FtZXJhPicsXG4gICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcbiAgICAgIHRhcmdldEV2ZW50OiBldixcbiAgICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6IGZhbHNlLFxuICAgICAgZnVsbHNjcmVlbjogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBjYW1lcmE7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBxID0gcmVxdWlyZSgncScpO1xuXG5mdW5jdGlvbiBDYW1lcmEoKSB7XG4gIHRoaXMuaW5pdCgpO1xufTtcblxuQ2FtZXJhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpZiAod2luZG93LmNvcmRvdmEpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24gY2FtZXJhUmVhZHkoKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfSwgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgfTtcblxuICBzZWxmLmluaXRQcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgcmV0dXJuIHNlbGYuaW5pdFByb21pc2U7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgd2luZG93Lm5hdmlnYXRvci5jYW1lcmEuY2xlYW51cCgpO1xufTtcblxuQ2FtZXJhLnByb3RvdHlwZS5jYXB0dXJlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgc2VsZi5pbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2FtZXJhLmdldFBpY3R1cmUoZnVuY3Rpb24gY2FwdHVyZVN1Y2Nlc3MoZmlsZVVSSSkge1xuICAgICAgdmFyIGZpbGVOYW1lID0gZmlsZVVSSS5zdWJzdHIoZmlsZVVSSS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICBmaWxlVVJJOiBmaWxlVVJJXG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiBjYXB0dXJlRmFpbHVyZShlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICB9LCB7XG4gICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICBkZXN0aW5hdGlvblR5cGU6IHdpbmRvdy5uYXZpZ2F0b3IuY2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5GSUxFX1VSSSxcbiAgICAgIGVuY29kaW5nVHlwZTogd2luZG93LkNhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgIGNvcnJlY3RPcmllbnRhdGlvbjogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xubW9kdWxlLmV4cG9ydHMgPSBjYW1lcmE7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uZmlsZS5kaXJlY3RpdmVzJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5maWxlLmRpcmVjdGl2ZXMnLCBbXSlcblxuLmRpcmVjdGl2ZSgnd2ZtSW1nJywgZnVuY3Rpb24oJHEpIHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgY2xvdWRVcmwgPSAkZmguZ2V0Q2xvdWRVUkwoKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoY2xvdWRVcmwpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgdmFyIGluaXRQcm9taXNlID0gaW5pdCgpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZToge1xuICAgICAgdWlkOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCd1aWQnLCBmdW5jdGlvbih1aWQpIHtcbiAgICAgICAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbihjbG91ZFVybCkge1xuICAgICAgICAgIGVsZW1lbnRbMF0uc3JjID0gY2xvdWRVcmwgKyBjb25maWcuYXBpUGF0aCArICcvZ2V0LycgKyB1aWQ7XG4gICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudFswXS5zcmMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xpZW50ID0gcmVxdWlyZSgnLi4vZmlsZScpLFxuICAgIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmZpbGUuc2VydmljZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uZmlsZS5zZXJ2aWNlJywgW1xuICByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG5dKVxuXG4uZmFjdG9yeSgnZmlsZUNsaWVudCcsIGZ1bmN0aW9uKCRxKSB7XG4gIHZhciBmaWxlQ2xpZW50ID0ge307XG5cbiAgXy5mb3JPd24oY2xpZW50LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZpbGVDbGllbnRba2V5XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHEud2hlbihjbGllbnRba2V5XS5hcHBseShjbGllbnQsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlQ2xpZW50W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBmaWxlQ2xpZW50O1xufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCdcbiwgYXBpUGF0aDogJy9maWxlL3dmbSdcbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICBxID0gcmVxdWlyZSgncScpO1xuXG52YXIgY2xpZW50ID0ge307XG5cbmNsaWVudC5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZEZoaW5pdCA9IHEuZGVmZXIoKTtcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWRGaGluaXQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGllbnQuY2xvdWRVcmwgPSAkZmguZ2V0Q2xvdWRVUkwoKTtcbiAgICBkZWZlcnJlZEZoaW5pdC5yZXNvbHZlKCk7XG4gIH0pO1xuXG4gIHZhciBkZWZlcnJlZFJlYWR5ID0gcS5kZWZlcigpO1xuICBpZiAod2luZG93LmNvcmRvdmEpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24gY2FtZXJhUmVhZHkoKSB7XG4gICAgICBkZWZlcnJlZFJlYWR5LnJlc29sdmUoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgZGVmZXJyZWRSZWFkeS5yZXNvbHZlKCk7XG4gIH07XG5cbiAgY2xpZW50LmluaXRQcm9taXNlID0gcS5hbGwoW2RlZmVycmVkRmhpbml0LnByb21pc2UsIGRlZmVycmVkUmVhZHkucHJvbWlzZV0pXG4gIHJldHVybiBjbGllbnQuaW5pdFByb21pc2U7XG59O1xuXG5jbGllbnQudXBsb2FkRGF0YVVybCA9IGZ1bmN0aW9uKHVzZXJJZCwgZGF0YVVybCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIGRlZmVycmVkLnJlamVjdCgnQm90aCB1c2VySWQgYW5kIGEgZGF0YVVybCBwYXJhbWV0ZXJzIGFyZSByZXF1aXJlZC4nKTtcbiAgfSBlbHNlIHtcbiAgICAkZmguY2xvdWQoe1xuICAgICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnL293bmVyLycrdXNlcklkKycvdXBsb2FkL2Jhc2U2NC9waG90by5wbmcnLFxuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBkYXRhOiBkYXRhVXJsXG4gICAgfSxcbiAgICBmdW5jdGlvbihyZXMpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BzKSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50Lmxpc3QgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHVybCA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyBjb25maWcuYXBpUGF0aCArICcvYWxsJ1xuICAgIDogY29uZmlnLmFwaVBhdGggKyAnL293bmVyLycgKyB1c2VySWQ7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmNsb3VkKHtcbiAgICAgIHBhdGg6IHVybCxcbiAgICAgIG1ldGhvZDogJ2dldCdcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlcykge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24obWVzc2FnZSwgcHJvcHMpIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgZS5wcm9wcyA9IHByb3BzO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIH1cbiAgKTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkKGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgdHJhbnNmZXIgPSBuZXcgRmlsZVRyYW5zZmVyKCk7XG4gIHRyYW5zZmVyLnVwbG9hZChmaWxlVVJJLCBzZXJ2ZXJVUkksIGZ1bmN0aW9uIHVwbG9hZFN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSwgZnVuY3Rpb24gdXBsb2FkRmFpbHVyZShlcnJvcikge1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0sIGZpbGVVcGxvYWRPcHRpb25zKTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkUmV0cnkoZmlsZVVSSSwgc2VydmVyVVJJLCBmaWxlVXBsb2FkT3B0aW9ucywgdGltZW91dCwgcmV0cmllcykge1xuICByZXR1cm4gZmlsZVVwbG9hZChmaWxlVVJJLCBzZXJ2ZXJVUkksIGZpbGVVcGxvYWRPcHRpb25zKVxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmIChyZXRyaWVzID09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHVwbG9hZCB0byBcIiArIEpTT04uc3RyaW5naWZ5KHNlcnZlclVSSSkpO1xuICAgIH07XG4gICAgcmV0dXJuIHEuZGVsYXkodGltZW91dClcbiAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmlsZVVwbG9hZFJldHJ5KGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMsIHRpbWVvdXQsIHJldHJpZXMgLSAxKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jbGllbnQudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKHVzZXJJZCwgZmlsZVVSSSwgb3B0aW9ucykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gcS5yZWplY3QoJ3VzZXJJZCBhbmQgZmlsZVVSSSBwYXJhbWV0ZXJzIGFyZSByZXF1aXJlZC4nKTtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZmlsZVVwbG9hZE9wdGlvbnMgPSBuZXcgRmlsZVVwbG9hZE9wdGlvbnMoKTtcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5maWxlS2V5ID0gb3B0aW9ucy5maWxlS2V5IHx8ICdiaW5hcnlmaWxlJztcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5maWxlTmFtZSA9IG9wdGlvbnMuZmlsZU5hbWU7XG4gICAgZmlsZVVwbG9hZE9wdGlvbnMubWltZVR5cGUgPSBvcHRpb25zLm1pbWVUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5wYXJhbXMgPSB7XG4gICAgICBvd25lcklkOiB1c2VySWQsXG4gICAgICBmaWxlTmFtZTogb3B0aW9ucy5maWxlTmFtZVxuICAgIH07XG4gICAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgMjAwMDtcbiAgICB2YXIgcmV0cmllcyA9IG9wdGlvbnMucmV0cmllcyB8fCAxO1xuICAgIHJldHVybiBjbGllbnQuaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZXJ2ZXJVUkkgPSB3aW5kb3cuZW5jb2RlVVJJKGNsaWVudC5jbG91ZFVybCArIGNvbmZpZy5hcGlQYXRoICsgJy91cGxvYWQvYmluYXJ5Jyk7XG4gICAgICByZXR1cm4gZmlsZVVwbG9hZFJldHJ5KGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMsIHRpbWVvdXQsIHJldHJpZXMpO1xuICAgIH0pXG4gIH07XG59O1xuXG5jbGllbnQuaW5pdCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsaWVudDtcbiIsInJlcXVpcmUoJy4vd29ya29yZGVyLW1hcC50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1hcC5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tYXAuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLW1hcC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8ZGl2IGlkPVxcJ2dtYXBfY2FudmFzXFwnPjwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1hcC5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5tYXAuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCd3b3Jrb3JkZXJNYXAnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQpIHtcbiAgZnVuY3Rpb24gaW5pdE1hcChlbGVtZW50LCBjZW50ZXIpIHtcbiAgICB2YXIgbXlPcHRpb25zID0ge1xuICAgICAgem9vbToxNCxcbiAgICAgIGNlbnRlcjpuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNlbnRlclswXSwgY2VudGVyWzFdKSxcbiAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcbiAgICB9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignI2dtYXBfY2FudmFzJyksIG15T3B0aW9ucyk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfTtcblxuICBmdW5jdGlvbiByZXNpemVNYXAoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgdmFyIG1hcEVsZW1lbnQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJyNnbWFwX2NhbnZhcycpXG4gICAgdmFyIGhlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQ7XG4gICAgdmFyIHdpZHRoID0gcGFyZW50LmNsaWVudFdpZHRoO1xuICAgIG1hcEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICBtYXBFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXG4gICAgY29uc29sZS5sb2coJ01hcCBkaW1lbnNpb25zOicsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwRWxlbWVudCwgJ3Jlc2l6ZScpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGFkZE1hcmtlcnMobWFwLCBlbGVtZW50LCB3b3Jrb3JkZXJzKSB7XG4gICAgd29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgaWYgKHdvcmtvcmRlci5sb2NhdGlvbikge1xuICAgICAgICAvLyB2YXIgbGF0ID0gY2VudGVyWzBdICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4wNTtcbiAgICAgICAgLy8gdmFyIGxvbmcgPSBjZW50ZXJbMV0gKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjI7XG4gICAgICAgIHZhciBsYXQgPSB3b3Jrb3JkZXIubG9jYXRpb25bMF07XG4gICAgICAgIHZhciBsb25nID0gd29ya29yZGVyLmxvY2F0aW9uWzFdO1xuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7bWFwOiBtYXAscG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKX0pO1xuICAgICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtjb250ZW50Oic8c3Ryb25nPldvcmtvcmRlciAjJyt3b3Jrb3JkZXIuaWQrJzwvc3Ryb25nPjxicj5WYW5jb3V2ZXIsIEJDPGJyPid9KTtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsbWFya2VyKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmluZFBhcmVudChkb2N1bWVudCwgZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgd2hpbGUocGFyZW50KSB7XG4gICAgICB2YXIgaXNQYXJlbnRNYXRjaCA9IEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwobWF0Y2hlcywgZnVuY3Rpb24oX21hdGNoKSB7XG4gICAgICAgIHJldHVybiBwYXJlbnQgPT09IF9tYXRjaDtcbiAgICAgIH0pO1xuICAgICAgaWYgKGlzUGFyZW50TWF0Y2gpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9O1xuICAgICAgdmFyIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgY29uc29sZS5sb2coJ3BhcmVudCcsIHBhcmVudClcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudCB8fCBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1tYXAudHBsLmh0bWwnKSxcbiAgICBzY29wZToge1xuICAgICAgbGlzdDogJz0nLFxuICAgICAgY2VudGVyOiAnPScsXG4gICAgICB3b3Jrb3JkZXJzOiAnPScsXG4gICAgICBjb250YWluZXJTZWxlY3RvcjogJ0AnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICB2YXIgbWFwID0gaW5pdE1hcChlbGVtZW50LCBzY29wZS5jZW50ZXIgfHwgWzQ5LjI3LCAtMTIzLjA4XSk7XG4gICAgICBhZGRNYXJrZXJzKG1hcCwgZWxlbWVudCwgc2NvcGUud29ya29yZGVycyk7XG4gICAgICB2YXIgcGFyZW50ID0gZmluZFBhcmVudCgkZG9jdW1lbnRbMF0sIGVsZW1lbnRbMF0sIHNjb3BlLmNvbnRhaW5lclNlbGVjdG9yKTtcbiAgICAgIHZhciByZXNpemVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNpemVNYXAoZWxlbWVudCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KHJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5vbigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpOyAvLyBUT0RPOiB0aHJvdHRsZSB0aGlzXG4gICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5vZmYoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCAkZWxlbWVudCkge1xuXG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWFwJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5tYXAnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tYXAuc2VydmljZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1hcC5zZXJ2aWNlcyc7XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ21hcENsaWVudCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgbWFwQ2xpZW50ID0ge307XG4gIG1hcENsaWVudC5nZXRDb29yZHMgPSBmdW5jdGlvbihhZGRyZXNzKSB7XG4gICAgLy8gaW52b2tlIHRoZSBnb29nbGUgQVBJIHRvIHJldHVybiB0aGUgY28tb3JkaW5hdGVzIG9mIHRoZSBnaXZlbiBsb2NhdGlvblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9nZW9jb2RpbmcvaW50cm9cbiAgfVxufSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWVkaWF0b3IgPSByZXF1aXJlKCcuLi9tZWRpYXRvcicpO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmNvcmUubWVkaWF0b3InLCBbJ25nJ10pXG5cbi5mYWN0b3J5KCdtZWRpYXRvcicsIGZ1bmN0aW9uIG1lZGlhdG9yU2VydmljZSgkcSwgJGxvZykge1xuICB2YXIgb3JpZ2luYWxSZXF1ZXN0ID0gbWVkaWF0b3IucmVxdWVzdDtcblxuICAvLyBtb25rZXkgcGF0Y2ggdGhlIHJlcXVlc3QgZnVuY3Rpb24sIHdyYXBwaW5nIHRoZSByZXR1cm5lZCBwcm9taXNlIGFzIGFuIGFuZ3VsYXIgcHJvbWlzZVxuICBtZWRpYXRvci5yZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHByb21pc2UgPSBvcmlnaW5hbFJlcXVlc3QuYXBwbHkobWVkaWF0b3IsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuICRxLndoZW4ocHJvbWlzZSk7XG4gIH07XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUgPSBmdW5jdGlvbih0b3BpYyxzY29wZSxmbikge1xuICAgIHZhciBzdWJzY3JpYmVyID0gbWVkaWF0b3Iuc3Vic2NyaWJlKHRvcGljLGZuKTtcbiAgICBzY29wZS4kb24oXCIkZGVzdHJveVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIG1lZGlhdG9yLnJlbW92ZSh0b3BpYywgc3Vic2NyaWJlci5pZCk7XG4gICAgfSk7XG5cbiAgfTtcblxuICByZXR1cm4gbWVkaWF0b3I7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmNvcmUubWVkaWF0b3InO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgTWVkaWF0b3IgPSByZXF1aXJlKCdtZWRpYXRvci1qcycpLk1lZGlhdG9yO1xudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbnZhciBtZWRpYXRvciA9IG5ldyBNZWRpYXRvcigpO1xuXG5tZWRpYXRvci5wcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIGNiID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gIH07XG4gIHZhciBhcmdzID0gW107XG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gIGFyZ3Muc3BsaWNlKDEsIDAsIGNiKTtcbiAgbWVkaWF0b3Iub25jZS5hcHBseShtZWRpYXRvciwgYXJncyk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5tZWRpYXRvci5yZXF1ZXN0ID0gZnVuY3Rpb24odG9waWMsIHBhcmFtZXRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHRvcGljcyA9IHt9LCBzdWJzID0ge30sIGNvbXBsZXRlID0gZmFsc2UsIHRpbWVvdXQ7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdG9waWNzLnJlcXVlc3QgPSB0b3BpYztcbiAgdG9waWNzLmRvbmUgPSBvcHRpb25zLmRvbmVUb3BpYyB8fCAnZG9uZTonICsgdG9waWM7XG4gIHRvcGljcy5lcnJvciA9IG9wdGlvbnMuZXJyb3JUb3BpYyB8fCAnZXJyb3I6JyArIHRvcGljO1xuXG4gIHZhciB1aWQgPSBudWxsO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ3VpZCcpKSB7XG4gICAgdWlkID0gb3B0aW9ucy51aWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcnMgIT09IFwidW5kZWZpbmVkXCIgJiYgcGFyYW1ldGVycyAhPT0gbnVsbCkge1xuICAgIHVpZCA9IHBhcmFtZXRlcnMgaW5zdGFuY2VvZiBBcnJheSA/IHBhcmFtZXRlcnNbMF0gOiBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgaWYgKHVpZCAhPT0gbnVsbCkge1xuICAgICB0b3BpY3MuZG9uZSArPSAnOicgKyB1aWQ7XG4gICAgIHRvcGljcy5lcnJvciArPSAnOicgKyB1aWQ7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMudGltZW91dCkge1xuICAgIG9wdGlvbnMudGltZW91dCA9IDIwMDA7XG4gIH07XG5cbiAgdmFyIGNsZWFuVXAgPSBmdW5jdGlvbigpIHtcbiAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIG1lZGlhdG9yLnJlbW92ZSh0b3BpY3MuZG9uZSwgc3Vicy5kb25lLmlkKTtcbiAgICBtZWRpYXRvci5yZW1vdmUodG9waWNzLmVycm9yLCBzdWJzLmVycm9yLmlkKTtcbiAgfTtcblxuICBzdWJzLmRvbmUgPSBtZWRpYXRvci5zdWJzY3JpYmUodG9waWNzLmRvbmUsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIGNsZWFuVXAoKTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gIH0pO1xuXG4gIHN1YnMuZXJyb3IgPSBtZWRpYXRvci5zdWJzY3JpYmUodG9waWNzLmVycm9yLCBmdW5jdGlvbihlcnJvcikge1xuICAgIGNsZWFuVXAoKTtcbiAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICB9KTtcblxuICB2YXIgYXJncyA9IFt0b3BpY3MucmVxdWVzdF07XG4gIGlmIChwYXJhbWV0ZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhcmdzLCBwYXJhbWV0ZXJzKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzLnB1c2gocGFyYW1ldGVycyk7XG4gIH1cbiAgbWVkaWF0b3IucHVibGlzaC5hcHBseShtZWRpYXRvciwgYXJncyk7XG5cbiAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgY2xlYW5VcCgpO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignTWVkaWF0b3IgcmVxdWVzdCB0aW1lb3V0IGZvciB0b3BpYyAnICsgIHRvcGljKSk7XG4gICAgfVxuICB9LCBvcHRpb25zLnRpbWVvdXQpO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZWRpYXRvcjtcbiIsInJlcXVpcmUoJy4vbWVzc2FnZS1kZXRhaWwudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vbWVzc2FnZS1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL21lc3NhZ2UtbGlzdC50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAge3tjdHJsLm1lc3NhZ2Uuc3ViamVjdH19XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3Zm0tbWFpbmNvbC1zY3JvbGxcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtaGVhZGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1ib2R5LTFcIj5cXG4nICtcbiAgICAnICAgICAgICA8c3Bhbj5Gcm9tOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2Uuc2VuZGVyLm5hbWV9fVxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWJvZHktMVwiPlxcbicgK1xuICAgICcgICAgICAgIDxzcGFuPlRvOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2UucmVjZWl2ZXIubmFtZX19XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtYm9keS0xXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4+U3RhdHVzOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2Uuc3RhdHVzfX1cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwhLS08ZGl2IGNsYXNzPVwibWQtYm9keS0xIHRpbWUtc3RhbXBcIj4xMTozOCBBTSAoMyBob3VycyBhZ28pPC9kaXY+LS0+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIj57e2N0cmwubWVzc2FnZS5jb250ZW50fX08L3A+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyIG1kLXByaW1hcnlcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPk5ldyBtZXNzYWdlPC9oMz5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIm1lc3NhZ2VGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKG1lc3NhZ2VGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDwhLS1cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIm1lc3NhZ2VTdGF0ZVwiPlN0YXR1czwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0bWVzc2FnZVR5cGVcIiBuYW1lPVwibWVzc2FnZVN0YXR1c1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGF0dXNcIiBkaXNhYmxlZD1cInRydWVcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAtLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIlRvXCI+VG88L2xhYmVsPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cImN0cmwubW9kZWwucmVjZWl2ZXJcIiBuYW1lPVwicmVjZWl2ZXJcIiBpZD1cInJlY2VpdmVyXCI+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cIndvcmtlciBpbiBjdHJsLndvcmtlcnNcIiB2YWx1ZT1cInt7d29ya2VyfX1cIj57e3dvcmtlci5uYW1lfX0gKHt7d29ya2VyLnBvc2l0aW9ufX0pPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5TdWJqZWN0PC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5wdXRTdWJqZWN0XCIgbmFtZT1cInN1YmplY3RcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3ViamVjdFwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIm1lc3NhZ2VGb3JtLnN1YmplY3QuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCBtZXNzYWdlRm9ybS5zdWJqZWN0LiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgc3ViamVjdCBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgbmctY2xhc3M9XCJ7IFxcJ2hhcy1lcnJvclxcJyA6IG1lc3NhZ2VGb3JtLnN1bW1hcnkuJGludmFsaWQgJiYgIW1lc3NhZ2VGb3JtLnN1bW1hcnkuJHByaXN0aW5lIH1cIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dENvbnRlbnRcIj5NZXNzYWdlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDx0ZXh0YXJlYSBpZD1cImlucHV0Q29udGVudFwiIG5hbWU9XCJjb250ZW50XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmNvbnRlbnRcIiByZXF1aXJlZCBtZC1tYXhsZW5ndGg9XCIzNTBcIj48L3RleHRhcmVhPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJtZXNzYWdlRm9ybS5zdW1tYXJ5LiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCBtZXNzYWdlRm9ybS5zdW1tYXJ5LiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgc3VtbWFyeSBkYXRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+U2VuZCBtZXNzYWdlPC9tZC1idXR0b24+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL21lc3NhZ2UtbGlzdC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5NZXNzYWdlczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCI+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwibWVzc2FnZXNcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMy1saW5lXCIgbmctcmVwZWF0PVwibWVzc2FnZSBpbiBjdHJsLmxpc3QgfCByZXZlcnNlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdE1lc3NhZ2UoJGV2ZW50LCBtZXNzYWdlKVwiIGNsYXNzPVwibWQtMy1saW5lIHdvcmtvcmRlci1pdGVtXCJcXG4nICtcbiAgICAnICAgICBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IG1lc3NhZ2UuaWQsIG5ldzogbWVzc2FnZS5zdGF0dXMgPT09IFxcJ3VucmVhZFxcJ31cIj5cXG4nICtcbiAgICAnICAgICAgPGltZyBuZy1zcmM9XCJ7e21lc3NhZ2Uuc2VuZGVyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiBhbHQ9XCJ7e21lc3NhZ2Uuc2VuZGVyLm5hbWV9fVwiIC8+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiIGxheW91dD1cImNvbHVtblwiPlxcbicgK1xuICAgICcgICAgICAgIDwhLS08c3BhbiBjbGFzcz1cIm1kLWNhcHRpb24gdGltZS1zdGFtcFwiPjEzIG1pbnMgYWdvPC9zcGFuPi0tPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e21lc3NhZ2Uuc2VuZGVyLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPGg0Pnt7bWVzc2FnZS5zdWJqZWN0fX08L2g0PlxcbicgK1xuICAgICcgICAgICAgIDxwPnt7bWVzc2FnZS5jb250ZW50fX08L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlciBtZC1pbnNldD48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICA8L21kLWxpc3Q+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLWNsaWNrPVwibmF2aWdhdGVUbyhcXCdhcHAubWVzc2FnZS5kZXRhaWxcXCcsIHttZXNzYWdlSWQ6IG1lc3NhZ2UuaWR9KVwiIG5nLXJlcGVhdD1cIm1lc3NhZ2UgaW4gY3RybC5tZXNzYWdlc1wiPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3VzZXIudGl0bGV9fTwvaDM+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ21lc3NhZ2VMaXN0JywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWxpc3QudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBsaXN0IDogJz1saXN0JyxcbiAgICAgIHNlbGVjdGVkTW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxpc3QgPSAkc2NvcGUubGlzdDtcbiAgICAgICAgc2VsZi5zZWxlY3RlZCA9ICRzY29wZS5zZWxlY3RlZE1vZGVsO1xuICAgICAgICBzZWxmLnNlbGVjdE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCwgbWVzc2FnZSkge1xuICAgICAgICBzZWxmLnNlbGVjdGVkTWVzc2FnZUlkID0gbWVzc2FnZS5pZDtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOm1lc3NhZ2U6c2VsZWN0ZWQnLCBtZXNzYWdlKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmlzbWVzc2FnZVNob3duID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bm1lc3NhZ2UgPT09IG1lc3NhZ2U7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnbWVzc2FnZUZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL21lc3NhZ2UtZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICBtZXNzYWdlIDogJz12YWx1ZSdcbiAgLCB3b3JrZXJzOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLm1vZGVsID0gYW5ndWxhci5jb3B5KCRzY29wZS5tZXNzYWdlKTtcbiAgICAgIHNlbGYud29ya2VycyA9ICRzY29wZS53b3JrZXJzO1xuICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGlzVmFsaWQpIHtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzZWxmLm1vZGVsLnJlY2VpdmVyID0gSlNPTi5wYXJzZShzZWxmLm1vZGVsLnJlY2VpdmVyKTtcbiAgICAgICAgc2VsZi5tb2RlbC5yZWNlaXZlcklkID0gc2VsZi5tb2RlbC5yZWNlaXZlci5pZDtcbiAgICAgICAgc2VsZi5tb2RlbC5zdGF0dXMgPSBcInVucmVhZFwiO1xuICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOm1lc3NhZ2U6Y3JlYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCdtZXNzYWdlRGV0YWlsJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICBtZXNzYWdlIDogJz1tZXNzYWdlJ1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYubWVzc2FnZSA9ICRzY29wZS5tZXNzYWdlO1xuICAgICAgc2VsZi5zaG93U2VsZWN0QnV0dG9uID0gISEgJHNjb3BlLiRwYXJlbnQubWVzc2FnZXM7XG4gICAgICBzZWxmLnNlbGVjdG1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCwgbWVzc2FnZSkge1xuICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06bWVzc2FnZTpzZWxlY3RlZCcsIG1lc3NhZ2UpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1lc3NhZ2UnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zeW5jLXNlcnZpY2UnKVxuXSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbiAgLCBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWVzc2FnZS5zeW5jJztcblxuZnVuY3Rpb24gcmVtb3ZlTG9jYWxWYXJzKG9iamVjdCkge1xuICBfLmtleXMob2JqZWN0KS5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKCdfJykgPT09IDA7XG4gIH0pLmZvckVhY2goZnVuY3Rpb24obG9jYWxLZXkpIHtcbiAgICBkZWxldGUgb2JqZWN0W2xvY2FsS2V5XTtcbiAgfSk7XG4gIGlmIChvYmplY3QucmVzdWx0cykge1xuICAgIF8udmFsdWVzKG9iamVjdC5yZXN1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgXy5rZXlzKHJlc3VsdC5zdWJtaXNzaW9uKS5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuaW5kZXhPZignXycpID09PSAwO1xuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihsb2NhbEtleSkge1xuICAgICAgICBkZWxldGUgcmVzdWx0LnN1Ym1pc3Npb25bbG9jYWxLZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpIHtcbiAgdmFyIHdyYXBwZWRNYW5hZ2VyID0gXy5jcmVhdGUobWFuYWdlcik7XG4gIHdyYXBwZWRNYW5hZ2VyLm5ldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ01lc3NhZ2UnXG4gICAgICAsIHN0YXR1czogJ05ldydcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG1lc3NhZ2UpO1xuICAgIH0sIDApO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuXG4gIHJldHVybiB3cmFwcGVkTWFuYWdlcjtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLnN5bmMnLCBbcmVxdWlyZSgnZmgtd2ZtLXN5bmMnKV0pXG4uZmFjdG9yeSgnbWVzc2FnZVN5bmMnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIHN5bmNTZXJ2aWNlKSB7XG4gIHN5bmNTZXJ2aWNlLmluaXQoJGZoLCBjb25maWcuc3luY09wdGlvbnMpO1xuICB2YXIgbWVzc2FnZVN5bmMgPSB7fTtcbiAgbWVzc2FnZVN5bmMuY3JlYXRlTWFuYWdlciA9IGZ1bmN0aW9uKHF1ZXJ5UGFyYW1zKSB7XG4gICAgaWYgKG1lc3NhZ2VTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKG1lc3NhZ2VTeW5jLm1hbmFnZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWVzc2FnZVN5bmMubWFuYWdlclByb21pc2UgPSBzeW5jU2VydmljZS5tYW5hZ2UoY29uZmlnLmRhdGFzZXRJZCwgbnVsbCwgcXVlcnlQYXJhbXMpXG4gICAgICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgICAgIG1lc3NhZ2VTeW5jLm1hbmFnZXIgPSB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQsICd3aXRoIGZpbHRlcjogJywgcXVlcnlQYXJhbXMpO1xuICAgICAgICByZXR1cm4gbWVzc2FnZVN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9O1xuICBtZXNzYWdlU3luYy5yZW1vdmVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1lc3NhZ2VTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlU3luYy5tYW5hZ2VyLnNhZmVTdG9wKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGUgbWVzc2FnZVN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHJldHVybiBtZXNzYWdlU3luYztcbn0pXG4uZmlsdGVyKCdyZXZlcnNlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbihpdGVtcykge1xuICAgIHJldHVybiBpdGVtcy5zbGljZSgpLnJldmVyc2UoKTtcbiAgfTtcbn0pO1xuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL21lc3NhZ2UnLFxuICBkYXRhc2V0SWQgOiAnbWVzc2FnZXMnLFxuICBzeW5jT3B0aW9ucyA6IHtcbiAgICBcInN5bmNfZnJlcXVlbmN5XCIgOiA1LFxuICAgIFwic3RvcmFnZV9zdHJhdGVneVwiOiBcImRvbVwiLFxuICAgIFwiZG9fY29uc29sZV9sb2dcIjogZmFsc2VcbiAgfVxufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5yZXN1bHQnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLnJlc3VsdCcsIFtcbiAgcmVxdWlyZSgnLi9zZXJ2aWNlJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnJlc3VsdC5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5nZXRCeVdvcmtvcmRlcklkID0gZnVuY3Rpb24od29ya29yZGVySWQpIHtcbiAgICByZXR1cm4gd3JhcHBlZE1hbmFnZXIubGlzdCgpXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgcmV0dXJuIHdyYXBwZWRNYW5hZ2VyLmZpbHRlckJ5V29ya29yZGVyKHJlc3VsdHMsIHdvcmtvcmRlcklkKTtcbiAgICB9KTtcbiAgfTtcbiAgd3JhcHBlZE1hbmFnZXIuZmlsdGVyQnlXb3Jrb3JkZXIgPSBmdW5jdGlvbihyZXN1bHRzQXJyYXksIHdvcmtvcmRlcklkKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgZmlsdGVyZWQgPSByZXN1bHRzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhyZXN1bHQud29ya29yZGVySWQpID09PSBTdHJpbmcod29ya29yZGVySWQpO1xuICAgIH0pO1xuICAgIHZhciByZXN1bHQgPSAgZmlsdGVyZWQgJiYgZmlsdGVyZWQubGVuZ3RoID8gZmlsdGVyZWRbMF0gOiB7fTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG4gIHdyYXBwZWRNYW5hZ2VyLmV4dHJhY3RBcHBmb3JtU3VibWlzc2lvbklkcyA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBzdWJtaXNzaW9uSWRzID0gbnVsbDtcbiAgICBpZiAoIHJlc3VsdCAmJiByZXN1bHQuc3RlcFJlc3VsdHMgJiYgISBfLmlzRW1wdHkocmVzdWx0LnN0ZXBSZXN1bHRzKSkge1xuICAgICAgdmFyIGFwcGZvcm1TdGVwUmVzdWx0cyA9IF8uZmlsdGVyKHJlc3VsdC5zdGVwUmVzdWx0cywgZnVuY3Rpb24oc3RlcFJlc3VsdCkge1xuICAgICAgICByZXR1cm4gISEgc3RlcFJlc3VsdC5zdGVwLmZvcm1JZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCEgXy5pc0VtcHR5KGFwcGZvcm1TdGVwUmVzdWx0cykpIHtcbiAgICAgICAgc3VibWlzc2lvbklkcyA9IF8ubWFwKGFwcGZvcm1TdGVwUmVzdWx0cywgZnVuY3Rpb24oc3RlcFJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiBzdGVwUmVzdWx0LnN1Ym1pc3Npb24uc3VibWlzc2lvbklkO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICByZXR1cm4gISEgaWQ7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBzdWJtaXNzaW9uSWRzO1xuICB9XG4gIHJldHVybiB3cmFwcGVkTWFuYWdlcjtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5yZXN1bHQuc3luYycsIFtyZXF1aXJlKCdmaC13Zm0tc3luYycpXSlcbi5mYWN0b3J5KCdyZXN1bHRTeW5jJywgZnVuY3Rpb24oJHEsICR0aW1lb3V0LCBzeW5jU2VydmljZSkge1xuICBzeW5jU2VydmljZS5pbml0KCRmaCwgY29uZmlnLnN5bmNPcHRpb25zKTtcbiAgdmFyIHJlc3VsdFN5bmMgPSB7fTtcbiAgcmVzdWx0U3luYy5tYW5hZ2VyUHJvbWlzZSA9IHN5bmNTZXJ2aWNlLm1hbmFnZShjb25maWcuZGF0YXNldElkKVxuICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgcmVzdWx0U3luYy5tYW5hZ2VyID0gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKTtcbiAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQpO1xuICAgIHJldHVybiByZXN1bHRTeW5jLm1hbmFnZXI7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0U3luYztcbn0pXG5cbi5maWx0ZXIoJ2lzRW1wdHknLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIChPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aCA9PT0gMCk7XG4gIH07XG59KVxuXG4ucnVuKGZ1bmN0aW9uKG1lZGlhdG9yLCByZXN1bHRTeW5jKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpjb21wbGV0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG1ldGFEYXRhID0gZXZlbnQubWV0YURhdGEud2ZtO1xuICAgIHZhciBzdWJtaXNzaW9uUmVzdWx0ID0gZXZlbnQuc3VibWlzc2lvblJlc3VsdDtcbiAgICByZXN1bHRTeW5jLm1hbmFnZXJQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0QnlXb3Jrb3JkZXJJZChtZXRhRGF0YS53b3Jrb3JkZXJJZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICB2YXIgc3RlcFJlc3VsdCA9IHJlc3VsdC5zdGVwUmVzdWx0c1ttZXRhRGF0YS5zdGVwLmNvZGVdO1xuICAgICAgICBzdGVwUmVzdWx0LnN1Ym1pc3Npb24gPSBzdWJtaXNzaW9uUmVzdWx0O1xuICAgICAgICByZXR1cm4gbWFuYWdlci51cGRhdGUocmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpyZXN1bHQ6cmVtb3RlLXVwZGF0ZTonICsgcmVzdWx0LndvcmtvcmRlcklkLCByZXN1bHQpO1xuICAgIH0pXG4gIH0pXG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL3Jlc3VsdCcsXG4gIGRhdGFzZXRJZCA6ICdyZXN1bHQnLFxuICBzeW5jT3B0aW9ucyA6IHtcbiAgICBcInN5bmNfZnJlcXVlbmN5XCIgOiA1LFxuICAgIFwic3RvcmFnZV9zdHJhdGVneVwiOiBcImRvbVwiLFxuICAgIFwiZG9fY29uc29sZV9sb2dcIjogZmFsc2VcbiAgfVxufVxuIiwicmVxdWlyZSgnLi9yaXNrLWFzc2Vzc21lbnQtZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9yaXNrLWFzc2Vzc21lbnQudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5yaXNrLWFzc2Vzc21lbnQnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnJpc2stYXNzZXNzbWVudCcsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnICA8ZGl2IG5nLXNob3c9XCJyaXNrQXNzZXNzbWVudFN0ZXAgPT09IDBcIiBsYXlvdXQtcGFkZGluZyBjbGFzcz1cInJpc2stYXNzZXNzc21lbnRcIj5cXG4nICtcbiAgICAnICAgICAgPGgyIGNsYXNzPVwibWQtdGl0bGVcIj5SaXNrIGFzc2Vzc21lbnQgY29tcGxldGU/PC9oMj5cXG4nICtcbiAgICAnICAgICAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIj5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLjwvcD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICAgIDxwIGNsYXNzPVwibWQtYm9keS0xXCI+RXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS48L3A+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIndvcmtmbG93LWFjdGlvbnMgbWQtcGFkZGluZyBtZC13aGl0ZWZyYW1lLXo0XCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5IG1kLXdhcm5cIiBuZy1jbGljaz1cImN0cmwuYW5zd2VyQ29tcGxldGUoJGV2ZW50LCB0cnVlKVwiPk5vPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5XCIgbmctY2xpY2s9XCJjdHJsLmFuc3dlckNvbXBsZXRlKCRldmVudCwgdHJ1ZSlcIj5ZZXM8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PjwhLS0gd29ya2Zsb3ctYWN0aW9ucy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBuZy1pZj1cInJpc2tBc3Nlc3NtZW50U3RlcCA9PSAxXCIgbGF5b3V0LXBhZGRpbmc+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGgzIGNsYXNzPVwibWQtdGl0bGVcIj5TaWduYXR1cmU8L2gzPlxcbicgK1xuICAgICcgICAgPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+RHJhdyB5b3VyIHNpZ25hdHVyZSBpbnNpZGUgdGhlIHNxdWFyZTwvcD5cXG4nICtcbiAgICAnICAgIDxzaWduYXR1cmUtZm9ybSB2YWx1ZT1cImN0cmwubW9kZWwuc2lnbmF0dXJlXCI+PC9zaWduYXR1cmUtZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid29ya2Zsb3ctYWN0aW9ucyBtZC1wYWRkaW5nIG1kLXdoaXRlZnJhbWUtejRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnkgbWQtaHVlLTFcIiBuZy1jbGljaz1cImN0cmwuYmFjaygkZXZlbnQpXCI+QmFjazwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeVwiIG5nLWNsaWNrPVwiY3RybC5kb25lKCRldmVudClcIj5Db250aW51ZTwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPC9kaXY+PCEtLSB3b3JrZmxvdy1hY3Rpb25zLS0+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnJpc2stYXNzZXNzbWVudCcpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50JywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9yaXNrLWFzc2Vzc21lbnQudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnICA8bWQtc3ViaGVhZGVyPlJpc2sgQXNzZXNzbWVudDwvbWQtc3ViaGVhZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdCBjbGFzcz1cInJpc2stYXNzZXNzbWVudFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cInJpc2tBc3Nlc3NtZW50LmNvbXBsZXRlXCIgY2xhc3M9XCJzdWNjZXNzXCI+Y2hlY2tfY2lyY2xlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctaWY9XCIhIHJpc2tBc3Nlc3NtZW50LmNvbXBsZXRlXCIgY2xhc3M9XCJkYW5nZXJcIj5jYW5jZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMyBuZy1pZj1cInJpc2tBc3Nlc3NtZW50LmNvbXBsZXRlXCI+Q29tcGxldGU8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxoMyBuZy1pZj1cIiEgcmlza0Fzc2Vzc21lbnQuY29tcGxldGVcIj5VbmNvbXBsZXRlZDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+UmlzayBBc3Nlc3NtZW50PC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmUgd2l0aC1pbWFnZVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Z2VzdHVyZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPjxzaWduYXR1cmUgdmFsdWU9XCJyaXNrQXNzZXNzbWVudC5zaWduYXR1cmVcIj48L3NpZ25hdHVyZT48L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlJpc2sgQXNzZXNzbWVudCBzaWduYXR1cmU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50JywgWyd3Zm0uY29yZS5tZWRpYXRvcicsIHJlcXVpcmUoJ2ZoLXdmbS1zaWduYXR1cmUnKV0pXG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdyaXNrQXNzZXNzbWVudCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgcmlza0Fzc2Vzc21lbnQ6IFwiPXZhbHVlXCJcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3Jpc2tBc3Nlc3NtZW50Rm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJHNjb3BlLnJpc2tBc3Nlc3NtZW50U3RlcCA9IDBcbiAgICAgIHNlbGYubW9kZWwgPSB7fTtcbiAgICAgIHNlbGYuYW5zd2VyQ29tcGxldGUgPSBmdW5jdGlvbihldmVudCwgYW5zd2VyKSB7XG4gICAgICAgIHNlbGYubW9kZWwuY29tcGxldGUgPSBhbnN3ZXI7XG4gICAgICAgICRzY29wZS5yaXNrQXNzZXNzbWVudFN0ZXArKztcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgICAgc2VsZi5iYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6YmFjaycpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmRvbmUnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbjtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnJpc2stYXNzZXNzbWVudCc7XG4iLCJyZXF1aXJlKCcuL3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3NjaGVkdWxlLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2NoZWR1bGUuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2NoZWR1bGUuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvc2NoZWR1bGUtd29ya29yZGVyLWNoaXAudHBsLmh0bWwnLFxuICAgICc8c3BhbiBjbGFzcz1cIndmbS1jaGlwIHdmbS1jaGlwLW5vLXBpY3R1cmVcIiBzdHlsZT1cIndpZHRoOjMwMHB4XCI+XFxuJyArXG4gICAgJyAgPHNwYW4gY2xhc3M9XCJ3Zm0tY2hpcC1uYW1lXCI+e3tjdHJsLndvcmtvcmRlci50eXBlfX0gI3t7Y3RybC53b3Jrb3JkZXIuaWR9fTwvc3Bhbj5cXG4nICtcbiAgICAnPC9zcGFuPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnQ09ORklERU5USUFMXFxuJyArXG4gICAgJ0NvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICdUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cIndmbS1zY2hlZHVsZXItdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuPlNjaGVkdWxlcjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtZGF0ZXBpY2tlciBuZy1tb2RlbD1cImN0cmwuc2NoZWR1bGVEYXRlXCIgbWQtcGxhY2Vob2xkZXI9XCJFbnRlciBkYXRlXCIgbmctY2hhbmdlPVwiY3RybC5kYXRlQ2hhbmdlKClcIj48L21kLWRhdGVwaWNrZXI+XFxuJyArXG4gICAgJyAgICA8IS0tXFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiRmF2b3JpdGVcIj5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5kYXRlX3JhbmdlPC9tZC1pY29uPlxcbicgK1xuICAgICcgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0PVwicm93XCI+XFxuJyArXG4gICAgJyAgPGRpdiBmbGV4PVwiNzBcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8dGFibGUgY2xhc3M9XCJ3Zm0tc2NoZWR1bGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxjb2wgd2lkdGg9XCIzMFwiPlxcbicgK1xuICAgICcgICAgICA8Y29sIHdpZHRoPVwiNzBcIj5cXG4nICtcbiAgICAnICAgICAgPHRyPlxcbicgK1xuICAgICcgICAgICAgIDx0ZCBjbGFzcz1cIndmbS1zY2hlZHVsZXItd29ya2VyXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwid2ZtLXRvb2xiYXItc21cIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzIGNsYXNzPVwibWQtc3ViaGVhZFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIFdvcmtlcnNcXG4nICtcbiAgICAnICAgICAgICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICAgICAgPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxpbWcgYWx0PVwiTmFtZVwiIG5nLXNyYz1cInt7d29ya2VyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiAvPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxwPnt7d29ya2VyLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgICAgICA8L21kLWxpc3Q+XFxuJyArXG4gICAgJyAgICAgICAgPC90ZD5cXG4nICtcbiAgICAnICAgICAgICA8dGQgY2xhc3M9XCJ3Zm0tc2NoZWR1bGVyLWNhbGVuZGFyXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8dGFibGU+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDx0cj48dGggbmctcmVwZWF0PVwiaG91ciBpbiBbXFwnN2FtXFwnLCBcXCc4YW1cXCcsIFxcJzlhbVxcJywgXFwnMTBhbVxcJywgXFwnMTFhbVxcJywgXFwnMTJwbVxcJywgXFwnMXBtXFwnLCBcXCcycG1cXCcsIFxcJzNwbVxcJywgXFwnNHBtXFwnLCBcXCc1cG1cXCcsIFxcJzZwbVxcJywgXFwnN3BtXFwnXVwiPnt7aG91cn19PC90aD48L3RyPlxcbicgK1xuICAgICcgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDx0ZCBuZy1yZXBlYXQ9XCJob3VyIGluIFs3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV1cIiBkcm9wcGFibGU9XCJ0cnVlXCIgZGF0YS1ob3VyPVwie3tob3VyfX1cIiBkYXRhLXdvcmtlcklkPVwie3t3b3JrZXIuaWR9fVwiPjwvdGQ+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvdHI+XFxuJyArXG4gICAgJyAgICAgICAgICA8L3RhYmxlPlxcbicgK1xuICAgICcgICAgICAgIDwvdGQ+XFxuJyArXG4gICAgJyAgICAgIDwvdHI+XFxuJyArXG4gICAgJyAgICA8L3RhYmxlPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8ZGl2IGZsZXg9XCIzMFwiIGNsYXNzPVwid2ZtLXNjaGVkdWxlci13b3Jrb3JkZXJzXCIgaWQ9XCJ3b3Jrb3JkZXJzLWxpc3RcIiBkcm9wcGFibGU9XCJ0cnVlXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid2ZtLXRvb2xiYXItc21cIj5cXG4nICtcbiAgICAnICAgICAgPGgzIGNsYXNzPVwibWQtc3ViaGVhZFwiPlxcbicgK1xuICAgICcgICAgICAgIFdvcmtvcmRlcnNcXG4nICtcbiAgICAnICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPHNwYW4gbmctcmVwZWF0PVwid29ya29yZGVyIGluIGN0cmwud29ya29yZGVycyB8IGZpbHRlcjp3b3JrT3JkZXJmaWx0ZXJcIiBjbGFzcz1cIndmbS1jaGlwIHdmbS1jaGlwLW5vLXBpY3R1cmVcIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS13b3Jrb3JkZXJJZD1cInt7d29ya29yZGVyLmlkfX1cIj5cXG4nICtcbiAgICAnICAgICAgPHNjaGVkdWxlLXdvcmtvcmRlci1jaGlwIHdvcmtvcmRlcj1cIndvcmtvcmRlclwiPjwvc2NoZWR1bGUtd29ya29yZGVyLWNoaXA+XFxuJyArXG4gICAgJyAgICA8L3NwYW4+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNjaGVkdWxlLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnNjaGVkdWxlLmRpcmVjdGl2ZXMnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2NoZWR1bGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgJGNvbXBpbGUsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuICBmdW5jdGlvbiBnZXRXb3JrZXJSb3dFbGVtZW50cyhlbGVtZW50LCB3b3JrZXJJZCkge1xuICAgIHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXdvcmtlcklkPVwiJyt3b3JrZXJJZCsnXCJdJyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRIb3VyRWxlbWVudChyb3dFbGVtZW50cywgaG91cikge1xuICAgIHZhciBob3VyRWxlbWVudCA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChyb3dFbGVtZW50cywgZnVuY3Rpb24oX2hvdXJFbGVtZW50KSB7XG4gICAgICByZXR1cm4gX2hvdXJFbGVtZW50LmRhdGFzZXQuaG91ciA9PT0gU3RyaW5nKGhvdXIpO1xuICAgIH0pO1xuICAgIHJldHVybiAoaG91ckVsZW1lbnQubGVuZ3RoKSA/IGhvdXJFbGVtZW50WzBdIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcldvcmtvcmRlcihzY29wZSwgaG91ckVsZW1lbnQsIHdvcmtvcmRlcikge1xuICAgIHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGhvdXJFbGVtZW50KTtcbiAgICB2YXIgX3dvcmtvcmRlciA9IHNjb3BlLndvcmtvcmRlcjtcbiAgICBzY29wZS53b3Jrb3JkZXIgPSB3b3Jrb3JkZXI7XG4gICAgdmFyIGNoaXAgPSBhbmd1bGFyLmVsZW1lbnQoJzxzY2hlZHVsZS13b3Jrb3JkZXItY2hpcCB3b3Jrb3JkZXI9XCJ3b3Jrb3JkZXJcIiBzY2hlZHVsZWQ9XCJ0cnVlXCIgZHJhZ2dhYmxlPVwidHJ1ZVwiPjwvc2NoZWR1bGUtd29ya29yZGVyLWNoaXA+Jyk7XG5cbiAgICBlbGVtZW50LmFwcGVuZChjaGlwKTtcbiAgICAkY29tcGlsZShjaGlwKShzY29wZSk7XG4gICAgY2hpcFswXS5pZCA9IHdvcmtvcmRlci5pZDtcbiAgICBjaGlwWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd3b3Jrb3JkZXJpZCcsIHdvcmtvcmRlci5pZCk7XG4gICAgfSk7XG4gICAgc2NvcGUud29ya29yZGVyID0gX3dvcmtvcmRlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcldvcmtvcmRlcnMoc2NvcGUsIGVsZW1lbnQsIHdvcmtvcmRlcnMpIHtcbiAgICB2YXIgd29ya29yZGVyc0J5V29ya2VyID0ge307XG4gICAgd29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgd29ya29yZGVyc0J5V29ya2VyW3dvcmtvcmRlci5hc3NpZ25lZV0gPSB3b3Jrb3JkZXJzQnlXb3JrZXJbd29ya29yZGVyLmFzc2lnbmVlXSB8fCBbXTtcbiAgICAgIHdvcmtvcmRlcnNCeVdvcmtlclt3b3Jrb3JkZXIuYXNzaWduZWVdLnB1c2god29ya29yZGVyKTtcbiAgICB9KTtcblxuICAgIF8uZm9ySW4od29ya29yZGVyc0J5V29ya2VyLCBmdW5jdGlvbih3b3Jrb3JkZXJzLCB3b3JrZXJJZCkge1xuICAgICAgdmFyIHdvcmtlclJvd0VsZW1lbnRzID0gZ2V0V29ya2VyUm93RWxlbWVudHMoZWxlbWVudCwgd29ya2VySWQpO1xuICAgICAgd29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICB2YXIgaG91ciA9IG5ldyBEYXRlKHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCkuZ2V0SG91cnMoKTtcbiAgICAgICAgdmFyIGhvdXJFbGVtZW50ID0gZ2V0SG91ckVsZW1lbnQod29ya2VyUm93RWxlbWVudHMsIGhvdXIpO1xuICAgICAgICBpZiAoaG91ckVsZW1lbnQpIHtcbiAgICAgICAgICByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIGhvdXJFbGVtZW50LCB3b3Jrb3JkZXIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlV29ya29yZGVyKHdvcmtvcmRlciwgd29ya2VySWQsIGhvdXIpIHtcbiAgICB3b3Jrb3JkZXIuYXNzaWduZWUgPSB3b3JrZXJJZDtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZS5zZXRIb3Vycyhob3VyKTtcbiAgICB3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXAgPSBkYXRlLmdldFRpbWUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdvcmtvcmRlcih3b3Jrb3JkZXJzLCBpZCkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHdvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgcmV0dXJuIFN0cmluZyh3b3Jrb3JkZXIuaWQpID09PSBTdHJpbmcoaWQpO1xuICAgIH0pXG4gICAgcmV0dXJuIGZpbHRlcmVkLmxlbmd0aCA/IGZpbHRlcmVkWzBdIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdvcmtlcih3b3JrZXJzLCBpZCkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHdvcmtlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgcmV0dXJuIHdvcmtlci5pZCA9PT0gaWQ7XG4gICAgfSlcbiAgICByZXR1cm4gZmlsdGVyZWQubGVuZ3RoID8gZmlsdGVyZWRbMF0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlV29ya29yZGVycyhlbGVtZW50KSB7XG4gICAgdmFyIGhvdXJFbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2Ryb3BwYWJsZT10cnVlXScpO1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoaG91ckVsZW1lbnRzLCBmdW5jdGlvbihob3VyRWxlbWVudCkge1xuICAgICAgd2hpbGUgKGhvdXJFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgaG91ckVsZW1lbnQucmVtb3ZlQ2hpbGQoaG91ckVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoc2NvcGUsIGN0cmwsIGVsZW1lbnQpIHtcbiAgICB2YXIgd29ya29yZGVyc09uRGF0ZSA9IHNjb3BlLndvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCkudG9EYXRlU3RyaW5nKCkgPT09IGN0cmwuc2NoZWR1bGVEYXRlLnRvRGF0ZVN0cmluZygpO1xuICAgIH0pO1xuICAgIHJlbmRlcldvcmtvcmRlcnMoc2NvcGUsIGVsZW1lbnQsIHdvcmtvcmRlcnNPbkRhdGUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICB3b3Jrb3JkZXJzIDogJz0nLFxuICAgICAgd29ya2VyczogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAvLyBHZXQgdGhlIHRocmVlIG1ham9yIGV2ZW50c1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gYWZ0ZXJEaWdlc3QoKSB7XG4gICAgICAgIHZhciBkcmFnZ2VkID0gbnVsbDtcbiAgICAgICAgdmFyIGRyb3BwYWJsZXMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkcm9wcGFibGU9dHJ1ZV0nKTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkcm9wcGFibGVzLCBmdW5jdGlvbihkcm9wcGFibGUpIHtcbiAgICAgICAgICBkcm9wcGFibGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZHJvcHBhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkcm9wcGFibGUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZihlLmN1cnJlbnRUYXJnZXQuaWQgIT0gJ3dvcmtvcmRlcnMtbGlzdCcpe1xuICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICAgIHZhciB3b3Jrb3JkZXIgPSBnZXRXb3Jrb3JkZXIoc2NvcGUud29ya29yZGVycywgZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnd29ya29yZGVyaWQnKSk7XG4gICAgICAgICAgICAgIHZhciB3b3JrZXIgPSBnZXRXb3JrZXIoc2NvcGUud29ya2VycywgdGhpcy5kYXRhc2V0LndvcmtlcmlkKTtcbiAgICAgICAgICAgICAgdmFyIGhvdXIgPSB0aGlzLmRhdGFzZXQuaG91cjtcbiAgICAgICAgICAgICAgdmFyIGRyb3BwZWQgPSBkcmFnZ2VkO1xuXG4gICAgICAgICAgICAgIHZhciBkcm9wRWxlbWVudCA9IHRoaXM7XG4gICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NoZWR1bGVkV29ya29yZGVyID0gYW5ndWxhci5jb3B5KHdvcmtvcmRlcik7XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVXb3Jrb3JkZXIoc2NoZWR1bGVkV29ya29yZGVyLCB3b3JrZXIuaWQsIGhvdXIpO1xuICAgICAgICAgICAgICAgIG1lZGlhdG9yLnJlcXVlc3QoJ3dmbTpzY2hlZHVsZTp3b3Jrb3JkZXInLCBzY2hlZHVsZWRXb3Jrb3JkZXIsIHt1aWQ6IHNjaGVkdWxlZFdvcmtvcmRlci5pZH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2F2ZWRXb3Jrb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c0NoaXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2F2ZWRXb3Jrb3JkZXIuaWQpO1xuICAgICAgICAgICAgICAgICAgaWYocHJldmlvdXNDaGlwRWxlbWVudCl7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQ2hpcEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwcmV2aW91c0NoaXBFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgcmVuZGVyV29ya29yZGVyKHNjb3BlLCBkcm9wRWxlbWVudCwgc2F2ZWRXb3Jrb3JkZXIpO1xuICAgICAgICAgICAgICAgICAgaWYoZHJvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy53Zm0tc2NoZWR1bGVyLXdvcmtvcmRlcnMnKS5yZW1vdmVDaGlsZChkcm9wcGVkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc2NvcGUud29ya29yZGVycy5pbmRleE9mKHdvcmtvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh+aW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzY29wZS53b3Jrb3JkZXJzW2luZGV4XSA9IHNhdmVkV29ya29yZGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIHRoZSBsaXN0LlxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBkcm9wcGFibGVCYWNrID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci13b3Jrb3JkZXJzJyk7XG4gICAgICAgIGRyb3BwYWJsZUJhY2suYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBkcm9wcGFibGVCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkcm9wcGFibGVCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vVE9ETyB0aGlzIHNob3VsZCBiZSBtZXJnZWQgd2l0IHRoZSBnbG9iYWwgZHJvcCBsaXN0ZW5lclxuICAgICAgICBkcm9wcGFibGVCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdmFyIHdvcmtvcmRlciA9IGdldFdvcmtvcmRlcihzY29wZS53b3Jrb3JkZXJzLCBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd3b3Jrb3JkZXJpZCcpKTtcbiAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNjaGVkdWxlZFdvcmtvcmRlciA9IGFuZ3VsYXIuY29weSh3b3Jrb3JkZXIpO1xuICAgICAgICAgICAgc2NoZWR1bGVkV29ya29yZGVyLnN0YXJ0VGltZXN0YW1wID0gbnVsbDtcbiAgICAgICAgICAgIG1lZGlhdG9yLnJlcXVlc3QoJ3dmbTpzY2hlZHVsZTp3b3Jrb3JkZXInLCBzY2hlZHVsZWRXb3Jrb3JkZXIsIHt1aWQ6IHNjaGVkdWxlZFdvcmtvcmRlci5pZH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihzYXZlZFdvcmtvcmRlcikge1xuICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNhdmVkV29ya29yZGVyLmlkKTtcbiAgICAgICAgICAgICAgaWYoZWxlbWVudCl7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IHNjb3BlLndvcmtvcmRlcnMuaW5kZXhPZih3b3Jrb3JkZXIpO1xuICAgICAgICAgICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyc1tpbmRleF0gPSBzYXZlZFdvcmtvcmRlcjtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnd29ya29yZGVyaWQnLCBzYXZlZFdvcmtvcmRlci5pZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZHJhZ2dhYmxlcyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnW2RyYWdnYWJsZT10cnVlXScpO1xuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRyYWdnYWJsZXMsIGZ1bmN0aW9uKGRyYWdnYWJsZSkge1xuICAgICAgICAgIGlmKCFkcmFnZ2FibGUuYXR0cmlidXRlcy5zY2hlZHVsZWQpIHtcbiAgICAgICAgICBkcmFnZ2FibGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3dvcmtvcmRlcmlkJywgZHJhZ2dhYmxlLmRhdGFzZXQud29ya29yZGVyaWQpO1xuICAgICAgICAgICAgZHJhZ2dlZCA9IHRoaXM7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkcmFnZ2VkID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkdGltZW91dCwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2NoZWR1bGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIHNlbGYuZGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZW1vdmVXb3Jrb3JkZXJzKCRlbGVtZW50WzBdKTtcbiAgICAgICAgcmVuZGVyKCRzY29wZSwgc2VsZiwgJGVsZW1lbnRbMF0pO1xuICAgICAgfVxuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlbmRlcigkc2NvcGUsIHNlbGYsICRlbGVtZW50WzBdKTtcbiAgICAgIH0pXG4gICAgICBzZWxmLndvcmtvcmRlcnMgPSAkc2NvcGUud29ya29yZGVycztcbiAgICAgICRzY29wZS4kd2F0Y2goJ3dvcmtvcmRlcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnM7XG4gICAgICB9KVxuICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnM7XG4gICAgICAkc2NvcGUud29ya09yZGVyZmlsdGVyICA9IGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICByZXR1cm4gd29ya29yZGVyLmFzc2lnbmVlID09IG51bGwgfHwgd29ya29yZGVyLnN0YXJ0VGltZXN0YW1wID09IG51bGw7XG4gICAgICB9O1xuXG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2NoZWR1bGVXb3Jrb3JkZXJDaGlwJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICB3b3Jrb3JkZXIgOiAnPSdcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdGhpcy53b3Jrb3JkZXIgPSAkc2NvcGUud29ya29yZGVyO1xuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzeW5jID0gcmVxdWlyZSgnLi4vY2xpZW50JylcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnN5bmMuc2VydmljZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uc3luYy5zZXJ2aWNlJywgW10pXG5cbi5mYWN0b3J5KCdzeW5jU2VydmljZScsIGZ1bmN0aW9uKCRxKSB7XG4gIHZhciBzeW5jU2VydmljZSA9IHt9O1xuICB2YXIgbWFuYWdlclByb21pc2U7XG5cbiAgZnVuY3Rpb24gTWFuYWdlcldyYXBwZXIoX21hbmFnZXIpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBfbWFuYWdlcjtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgbWV0aG9kTmFtZXMgPSBbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnbGlzdCcsICdzdGFydCcsICdzdG9wJywgJ3NhZmVTdG9wJywgJ2dldFF1ZXVlU2l6ZScsICdmb3JjZVN5bmMnLCAnd2FpdEZvclN5bmMnXTtcbiAgICBtZXRob2ROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHNlbGZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRxLndoZW4oc2VsZi5tYW5hZ2VyW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYubWFuYWdlciwgYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgc3luY1NlcnZpY2UuaW5pdCA9IGZ1bmN0aW9uKCRmaCwgc3luY09wdGlvbnMpIHtcbiAgICBzeW5jLmluaXQoJGZoLCBzeW5jT3B0aW9ucyk7XG4gIH1cblxuICBzeW5jU2VydmljZS5tYW5hZ2UgPSBmdW5jdGlvbihkYXRhc2V0SWQsIG9wdGlvbnMsIHF1ZXJ5UGFyYW1zLCBtZXRhRGF0YSkge1xuICAgIHJldHVybiAkcS53aGVuKHN5bmMubWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSlcbiAgICAudGhlbihmdW5jdGlvbihfbWFuYWdlcikge1xuICAgICAgdmFyIG1hbmFnZXIgPSBuZXcgTWFuYWdlcldyYXBwZXIoX21hbmFnZXIpO1xuICAgICAgbWFuYWdlci5zdHJlYW0gPSBfbWFuYWdlci5zdHJlYW07XG4gICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gc3luY1NlcnZpY2U7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgLCBxID0gcmVxdWlyZSgncScpXG4gICwgZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbiAgLCBSeCA9IHJlcXVpcmUoJ3J4JylcbiAgO1xuXG52YXIgJGZoLCBpbml0aWFsaXplZCA9IGZhbHNlLCBub3RpZmljYXRpb25TdHJlYW0sIGxpc3RlbmVycyA9IFtdO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1EYXRhU2V0KHN5bmNEYXRhKSB7XG4gIHZhciByZXN1bHQgPSBfLnZhbHVlcyhzeW5jRGF0YSkubWFwKGZ1bmN0aW9uKHN5bmNEYXRhKSB7XG4gICAgcmV0dXJuIHN5bmNEYXRhLmRhdGE7XG4gIH0pO1xuICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmlkOyB9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoY29kZSwgbXNnKSB7XG4gIHZhciBlcnJvciA9ICdFcnJvcic7XG4gIGlmIChjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICcgJyArIGNvZGUgKyAnOiAnICsgbXNnO1xuICB9IGVsc2UgaWYgKGNvZGUgJiYgIW1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBjb2RlO1xuICB9IGVsc2UgaWYgKCFjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBtc2c7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgKz0gJzogbm8gZXJyb3IgZGV0YWlscyBhdmFpbGFibGUnXG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBpbml0KF8kZmgsIF9zeW5jT3B0aW9ucykge1xuICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICBjb25zb2xlLmxvZygnc3luYy1jbGllbnQgYWxyZWFkeSBpbml0YWxpemVkLicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdzeW5jLWNsaWVudCBpbml0YWxpemluZy4nKTtcbiAgICAkZmggPSBfJGZoO1xuICAgIG5vdGlmaWNhdGlvblN0cmVhbSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgYWRkTGlzdGVuZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChub3RpZmljYXRpb24pO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuc2hhcmUoKTtcbiAgICB2YXIgc3luY09wdGlvbnMgPSBfLmRlZmF1bHRzKF9zeW5jT3B0aW9ucywgZGVmYXVsdENvbmZpZy5zeW5jT3B0aW9ucyk7XG5cbiAgICAkZmguc3luYy5pbml0KHN5bmNPcHRpb25zKTtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgJGZoLnN5bmMubm90aWZ5KGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbCh1bmRlZmluZWQsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoJ1N5bmMgbm90IHlldCBpbml0aWFsaXplZC4gIENhbGwgc3luYy1jbGllbnQuaW5pdCgpIGZpcnN0LicpO1xuICB9IGVsc2Uge1xuICAgIC8vbWFuYWdlIHRoZSBkYXRhU2V0XG4gICAgJGZoLnN5bmMubWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtYW5hZ2VyID0gbmV3IERhdGFNYW5hZ2VyKGRhdGFzZXRJZCk7XG4gICAgICBtYW5hZ2VyLnN0cmVhbSA9IG5vdGlmaWNhdGlvblN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uZGF0YXNldF9pZCA9PSBkYXRhc2V0SWQ7XG4gICAgICB9KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShtYW5hZ2VyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xufVxuXG5mdW5jdGlvbiBEYXRhTWFuYWdlcihkYXRhc2V0SWQpIHtcbiAgdGhpcy5kYXRhc2V0SWQgPSBkYXRhc2V0SWQ7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9MaXN0KHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihyZXMpIHtcbiAgICB2YXIgb2JqZWN0cyA9IHRyYW5zZm9ybURhdGFTZXQocmVzKTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKG9iamVjdHMpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLnN5bmMuZG9DcmVhdGUoc2VsZi5kYXRhc2V0SWQsIG9iamVjdCwgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PSAnbG9jYWxfdXBkYXRlX2FwcGxpZWQnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi5tZXNzYWdlID09ICdjcmVhdGUnXG4gICAgICAgIDsgLy8gJiYgbm90aWZpY2F0aW9uLnVpZCA9PSBvYmplY3QuX2xvY2FsdWlkOyAgVE9ETzogZ2V0IHRoZSBzeW5jIGZyYW1ld29yayB0byBpbmNsdWRlIHRoZSB0ZW1wb3JhcnkgdWlkIGluIHRoZSBub3RpZmljYXRpb25cbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICBvYmplY3QuX2xvY2FsdWlkID0gbXNnLnVpZDtcbiAgICAgIHJldHVybiBzZWxmLnVwZGF0ZShvYmplY3QpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9SZWFkKHRoaXMuZGF0YXNldElkLCBpZCwgZnVuY3Rpb24ocmVzKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzLmRhdGEpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICAvLyBmYWlsdXJlXG4gICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihmb3JtYXRFcnJvcihjb2RlLCBtc2cpKSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1aWRQcm9taXNlID0gXy5oYXMob2JqZWN0LCAnaWQnKVxuICAgID8gcS53aGVuKFN0cmluZyhvYmplY3QuaWQpKVxuICAgIDogc2VsZi5yZWFkKG9iamVjdC5fbG9jYWx1aWQpLnRoZW4oZnVuY3Rpb24oX29iamVjdCkge1xuICAgICAgY29uc29sZS5sb2coJ19vYmplY3QnLCBfb2JqZWN0KVxuICAgICAgaWYgKF8uaGFzKF9vYmplY3QsICdpZCcpKSB7XG4gICAgICAgIG9iamVjdC5pZCA9IF9vYmplY3QuaWQ7XG4gICAgICAgIHJldHVybiBTdHJpbmcoX29iamVjdC5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqZWN0Ll9sb2NhbHVpZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgdWlkUHJvbWlzZS50aGVuKGZ1bmN0aW9uKHVpZCkge1xuICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZyB3aXRoIGlkJywgdWlkKVxuICAkZmguc3luYy5kb1VwZGF0ZShzZWxmLmRhdGFzZXRJZCwgdWlkLCBvYmplY3QsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vIHN1Y2Nlc3NcbiAgICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmNvZGUgPT09ICdsb2NhbF91cGRhdGVfYXBwbGllZCdcbiAgICAgICAgJiYgbm90aWZpY2F0aW9uLm1lc3NhZ2UgPT09ICd1cGRhdGUnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi51aWQgPT09IHVpZDtcbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gc2VsZi5yZWFkKHVpZCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nJywgb2JqZWN0KTtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG59KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5kb0RlbGV0ZShzZWxmLmRhdGFzZXRJZCwgb2JqZWN0LmlkLCBmdW5jdGlvbihyZXMpIHtcbiAgICAvLyBzdWNjZXNzXG4gICAgdmFyIHVpZCA9IFN0cmluZyhvYmplY3QuaWQpO1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PT0gJ2xvY2FsX3VwZGF0ZV9hcHBsaWVkJ1xuICAgICAgICAmJiBub3RpZmljYXRpb24ubWVzc2FnZSA9PT0gJ2RlbGV0ZSdcbiAgICAgICAgJiYgU3RyaW5nKG5vdGlmaWNhdGlvbi51aWQpID09PSB1aWQ7XG4gICAgfSkudGFrZSgxKS50b1Byb21pc2UocS5Qcm9taXNlKVxuICAgIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShub3RpZmljYXRpb24ubWVzc2FnZSk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5zdGFydFN5bmModGhpcy5kYXRhc2V0SWQsIGZ1bmN0aW9uKCl7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgnc3luYyBsb29wIHN0YXJ0ZWQnKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5zdG9wU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agc3RvcHBlZCcpO1xuICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmZvcmNlU3luYyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5zeW5jLmZvcmNlU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agd2lsbCBydW4nKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5nZXRRdWV1ZVNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5nZXRQZW5kaW5nKHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihwZW5kaW5nKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShfLnNpemUocGVuZGluZykpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zYWZlU3RvcCA9IGZ1bmN0aW9uKHVzZXJPcHRpb25zKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHRpbWVvdXQ6IDIwMDBcbiAgfVxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyh1c2VyT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICBzZWxmLmdldFF1ZXVlU2l6ZSgpXG4gIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgc2VsZi5zdG9wKCkudGhlbihkZWZlcnJlZC5yZXNvbHZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQubm90aWZ5KCdDYWxsaW5nIGZvcmNlU3luYyBzeW5jIGJlZm9yZSBzdG9wJyk7XG4gICAgICByZXR1cm4gc2VsZi5mb3JjZVN5bmMoKVxuICAgICAgLnRoZW4oc2VsZi53YWl0Rm9yU3luYy5iaW5kKHNlbGYpKVxuICAgICAgLnRpbWVvdXQob3B0aW9ucy50aW1lb3V0KVxuICAgICAgLnRoZW4oc2VsZi5nZXRRdWV1ZVNpemUuYmluZChzZWxmKSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIGZhaWxlZCwgb3V0c3RhbmRpbmcgcmVzdWx0cyBzdGlsbCBwcmVzZW50JykpO1xuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC50aGVuKHNlbGYuc3RvcC5iaW5kKHNlbGYpKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKVxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIHRpbWVvdXQnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLndhaXRGb3JTeW5jID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5jb2RlID09ICdzeW5jX2NvbXBsZXRlJyB8fCBub3RpZmljYXRpb24uY29kZSA9PSAnc3luY19mYWlsZWQnO1xuICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfY29tcGxldGUnKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfZmFpbGVkJykge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignU3luYyBGYWlsZWQnLCBub3RpZmljYXRpb24pKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXRcbiwgbWFuYWdlOiBtYW5hZ2VcbiwgYWRkTGlzdGVuZXI6IGFkZExpc3RlbmVyXG59XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2dyb3VwLWZvcm0udHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXJcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICBHcm91cCAje3tjdHJsLm1vZGVsLmlkfX1cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0R3JvdXAoJGV2ZW50LCBjdHJsLm1vZGVsKVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICc8bWQtYnV0dG9uIGNsYXNzPVwibWQtZmFiXCIgYXJpYS1sYWJlbD1cIk5ldyBncm91cFwiIHVpLXNyZWY9XCJhcHAuZ3JvdXAubmV3XCI+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmFkZDwvbWQtaWNvbj5cXG4nICtcbiAgICAnPC9tZC1idXR0b24+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsXCI+XFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJncm91cEZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUoZ3JvdXBGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImdyb3VwbmFtZVwiPkdyb3VwIE5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJncm91cG5hbWVcIiBuYW1lPVwiZ3JvdXBuYW1lXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLm5hbWVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmdyb3VwbmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IGdyb3VwRm9ybS5ncm91cG5hbWUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBuYW1lIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImFzc2lnbmVlXCI+Um9sZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5yb2xlXCIgbmFtZT1cImFzc2lnbmVlXCIgaWQ9XCJhc3NpZ25lZVwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cImFkbWluXCI+QWRtaW48L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJtYW5hZ2VyXCI+TWFuYWdlcjwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cIndvcmtlclwiPldvcmtlcjwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlkIHx8IGN0cmwubW9kZWwuaWQgPT09IDAgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSBHcm91cDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAtbGlzdC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5Hcm91cHM8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBhY3Rpb249XCIjXCIgY2xhc3M9XCJwZXJzaXN0ZW50LXNlYXJjaFwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPjwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiIG5nLW1vZGVsPVwic2VhcmNoVmFsdWVcIiBuZy1jaGFuZ2U9XCJjdHJsLmFwcGx5RmlsdGVyKHNlYXJjaFZhbHVlKVwiPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdEdyb3VwKCRldmVudCwgZ3JvdXApXCIgbmctcmVwZWF0PVwiZ3JvdXAgaW4gY3RybC5ncm91cHNcIiBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IGdyb3VwLmlkfVwiPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2dyb3VwLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5ncm91cDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3tjdHJsLmdyb3VwLmlkfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Hcm91cCBpZDwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2N0cmwuZ3JvdXAubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+R3JvdXAgbmFtZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2N0cmwuZ3JvdXAucm9sZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+Um9sZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgIE1lbWJlcnNcXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RNZW1iZXIoJGV2ZW50LCBtZW1iZXIpXCIgbmctcmVwZWF0PVwibWVtYmVyIGluIGN0cmwubWVtYmVyc1wiPlxcbicgK1xuICAgICcgICAgPGltZyBhbHQ9XCJ1c2VyLm5hbWVcIiBuZy1zcmM9XCJ7e21lbWJlci5hdmF0YXJ9fVwiIGNsYXNzPVwibWQtYXZhdGFyXCIgLz5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3ttZW1iZXIubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+e3ttZW1iZXIucG9zaXRpb259fTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwicmVxdWlyZSgnLi9ncm91cC1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2dyb3VwLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vZ3JvdXAudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2VyLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtlci1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyXCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgV29ya2VyIElEIHt7Y3RybC5tb2RlbC5pZH19XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtlcigkZXZlbnQsIGN0cmwubW9kZWwpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxtZC1idXR0b24gY2xhc3M9XCJtZC1mYWJcIiBhcmlhLWxhYmVsPVwiTmV3IFdvcmtvcmRlclwiIHVpLXNyZWY9XCJhcHAud29ya2VyLm5ld1wiPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hZGQ8L21kLWljb24+XFxuJyArXG4gICAgJzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIndvcmtlckZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUod29ya2VyRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZXJuYW1lXCI+V29ya2VyIE5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ3b3JrZXJuYW1lXCIgbmFtZT1cIndvcmtlcm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwubmFtZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0ud29ya2VybmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0ud29ya2VybmFtZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIG5hbWUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwudXNlcm5hbWVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZXJGb3JtLnVzZXJuYW1lLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS51c2VybmFtZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHVzZXJuYW1lIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5CYW5uZXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJiYW5uZXJcIiBuYW1lPVwiYmFubmVyXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmJhbm5lclwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0uYmFubmVyLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5iYW5uZXIuJGRpcnR5XCI+PC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5BdmF0YXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhdmF0YXJcIiBuYW1lPVwiYXZhdGFyXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmF2YXRhclwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0uYXZhdGFyLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5hdmF0YXIuJGRpcnR5XCI+PC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwaG9uZW51bWJlclwiIG5hbWU9XCJwaG9uZW51bWJlclwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5waG9uZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0ucGhvbmVudW1iZXIuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZXJGb3JtLnBob25lbnVtYmVyLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgcGhvbmUgbnVtYmVyIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5FbWFpbDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmVtYWlsXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS5lbWFpbC4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0uZW1haWwuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gZW1haWwgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPlBvc2l0aW9uPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicG9zaXRpb25cIiBuYW1lPVwicG9zaXRpb25cIiBuZy1tb2RlbD1cImN0cmwubW9kZWwucG9zaXRpb25cIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZXJGb3JtLnBvc2l0aW9uLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5wb3NpdGlvbi4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BbiBwb3NpdGlvbiBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJhc3NpZ25lZVwiPkdyb3VwPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmdyb3VwXCIgbmFtZT1cImdyb3VwXCIgaWQ9XCJncm91cFwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJncm91cCBpbiBjdHJsLmdyb3Vwc1wiIHZhbHVlPVwie3tncm91cC5pZH19XCI+e3tncm91cC5uYW1lfX08L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj4gXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwuaWQgfHwgY3RybC5tb2RlbC5pZCA9PT0gMCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtlcjwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLWxpc3QudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPG1kLXRvb2xiYXI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+V29ya2Vyczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCI+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIiBuZy1tb2RlbD1cInNlYXJjaFZhbHVlXCIgbmctY2hhbmdlPVwiY3RybC5hcHBseUZpbHRlcihzZWFyY2hWYWx1ZSlcIj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RXb3JrZXIoJGV2ZW50LCB1c2VyKVwiICBuZy1yZXBlYXQ9XCJ1c2VyIGluIGN0cmwud29ya2Vyc1wiIG5nLWNsYXNzPVwie2FjdGl2ZTogY3RybC5zZWxlY3RlZC5pZCA9PT0gdXNlci5pZH1cIj5cXG4nICtcbiAgICAnICAgIDxpbWcgYWx0PVwidXNlci5uYW1lXCIgbmctc3JjPVwie3t1c2VyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiAvPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3VzZXIubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+e3t1c2VyLnBvc2l0aW9ufX08L3A+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC1jb250ZW50IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsIHdmbS1tYWluY29sLXNjcm9sbF93aXRoLW1lbnVcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwidXNlci1pbmZvLWhlYWRlclwiIG5nLXN0eWxlPVwiY3RybC5zdHlsZVwiPlxcbicgK1xuICAgICcgICAgPGgxIGNsYXNzPVwibWQtZGlzcGxheS0xXCI+e3tjdHJsLndvcmtlci5uYW1lfX08L2gxPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICcgIDxtZC1saXN0PlxcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBlcnNvbjwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7Y3RybC53b3JrZXIudXNlcm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+VXNlcm5hbWU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cGhvbmU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLnBob25lfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlBob25lIE51bWJlcjwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5lbWFpbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7Y3RybC53b3JrZXIuZW1haWx9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+RW1haWw8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cG9ydHJhaXQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLnBvc2l0aW9ufX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlBvc2l0aW9uPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3tjdHJsLmdyb3VwLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+R3JvdXA8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtc3ViaGVhZGVyIGNsYXNzPVwibWQtbm8tc3RpY2t5XCI+Tm90ZXM8L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnICAgIDxwIGNsYXNzPVwibWQtYm9keS0xXCIgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj57e2N0cmwud29ya2VyLm5vdGVzfX08L3A+XFxuJyArXG4gICAgJyAgPC9tZC1jb250ZW50PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udXNlci5kaXJlY3RpdmVzJztcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3dvcmtlckxpc3QnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtlci1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgd29ya2VycyA6ICc9JyxcbiAgICAgIHNlbGVjdGVkTW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYud29ya2VycyA9ICRzY29wZS53b3JrZXJzO1xuICAgICAgc2VsZi5zZWxlY3RlZCA9ICRzY29wZS5zZWxlY3RlZE1vZGVsO1xuICAgICAgc2VsZi5zZWxlY3RXb3JrZXIgPSBmdW5jdGlvbihldmVudCwgd29ya2VyKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6c2VsZWN0ZWQnLCB3b3JrZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNXb3JrZXJTaG93biA9IGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bldvcmtlciA9PT0gd29ya2VyO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya2VyLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKHdvcmtlci5uYW1lKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVybSkgIT09IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnd29ya2VyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZXIudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB3b3JrZXIgOiAnPScsXG4gICAgICBncm91cCA6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYud29ya2VyID0gJHNjb3BlLndvcmtlcjtcbiAgICAgIHNlbGYuZ3JvdXAgPSAkc2NvcGUuZ3JvdXA7XG4gICAgICB2YXIgYmFubmVyVXJsID0gc2VsZi53b3JrZXIuYmFubmVyIHx8IHNlbGYud29ya2VyLmF2YXRhcjtcbiAgICAgIHNlbGYuc3R5bGUgPSB7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnICsgYmFubmVyVXJsICsgJyknLFxuICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbic6IHNlbGYud29ya2VyLmJhbm5lciA/ICdjZW50ZXIgY2VudGVyJyA6ICd0b3AgY2VudGVyJyxcbiAgICAgICAgJ2JhY2tncm91bmQtc2l6ZSc6IHNlbGYud29ya2VyLmJhbm5lciA/ICdhdXRvJyA6ICdjb250YWluJyxcbiAgICAgICAgJ2JhY2tncm91bmQtcmVwZWF0JzogJ25vLXJlcGVhdCdcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCd3b3JrZXJGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZXItZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHdvcmtlciA6ICc9dmFsdWUnLFxuICAgICAgZ3JvdXBzIDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5ncm91cHMgPSAkc2NvcGUuZ3JvdXBzO1xuICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2VyKTtcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICBpZiAoIXNlbGYubW9kZWwuaWQgJiYgc2VsZi5tb2RlbC5pZCAhPT0gMCkge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpjcmVhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6dXBkYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ2dyb3VwTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAtbGlzdC50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGdyb3VwcyA6ICc9JyxcbiAgICAgIHNlbGVjdGVkTW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuZ3JvdXBzID0gJHNjb3BlLmdyb3VwcztcbiAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgIHNlbGYuc2VsZWN0R3JvdXAgPSBmdW5jdGlvbihldmVudCwgZ3JvdXApIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmdyb3VwOnNlbGVjdGVkJywgZ3JvdXApO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNHcm91cFNob3duID0gZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc2hvd25Hcm91cCA9PT0gZ3JvdXA7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmFwcGx5RmlsdGVyID0gZnVuY3Rpb24odGVybSkge1xuICAgICAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzZWxmLmdyb3VwcyA9ICRzY29wZS5ncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhncm91cC5pZCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgICAgIHx8IFN0cmluZyhncm91cC5uYW1lKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVybSkgIT09IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnZ3JvdXAnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2dyb3VwLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZ3JvdXAgOiAnPScsXG4gICAgICBtZW1iZXJzIDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5ncm91cCA9ICRzY29wZS5ncm91cDtcbiAgICAgIHNlbGYubWVtYmVycyA9ICRzY29wZS5tZW1iZXJzO1xuICAgICAgc2VsZi5zZWxlY3RNZW1iZXIgPSBmdW5jdGlvbihldmVudCwgbWVtYmVyKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZXI6c2VsZWN0ZWQnLCBtZW1iZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdncm91cEZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2dyb3VwLWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgICAgZ3JvdXAgOiAnPXZhbHVlJ1xuICAgICAgfVxuICAgICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUuZ3JvdXApO1xuICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLnNlbGVjdEdyb3VwID0gZnVuY3Rpb24oZXZlbnQsIGdyb3VwKSB7XG4gICAgICAgICAgaWYoZ3JvdXAuaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDpzZWxlY3RlZCcsIGdyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06Z3JvdXA6bGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDpjcmVhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06Z3JvdXA6dXBkYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgICB9O1xuICB9KTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuc2VydmljZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udXNlci5zZXJ2aWNlcyc7XG5cbnZhciBVc2VyQ2xpZW50ID0gcmVxdWlyZSgnLi4vdXNlci91c2VyLWNsaWVudCcpLFxuICAgIEdyb3VwQ2xpZW50ID0gcmVxdWlyZSgnLi4vZ3JvdXAvZ3JvdXAtY2xpZW50JyksXG4gICAgTWVtYmVyc2hpcENsaWVudCA9IHJlcXVpcmUoJy4uL21lbWJlcnNoaXAvbWVtYmVyc2hpcC1jbGllbnQnKTtcbiBcbmZ1bmN0aW9uIHdyYXBDbGllbnQoJHEsIGNsaWVudCwgbWV0aG9kTmFtZXMpIHtcbiAgdmFyIHdyYXBwZXIgPSB7fTtcbiAgbWV0aG9kTmFtZXMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgd3JhcHBlclttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRxLndoZW4oY2xpZW50W21ldGhvZE5hbWVdLmFwcGx5KGNsaWVudCwgYXJndW1lbnRzKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ3VzZXJDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnYXV0aCcsICdoYXNTZXNzaW9uJywgJ2NsZWFyU2Vzc2lvbicsICd2ZXJpZnknLCAnZ2V0UHJvZmlsZSddO1xuICB2YXIgdXNlckNsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBVc2VyQ2xpZW50KG1lZGlhdG9yKSwgbWV0aG9kTmFtZXMpO1xuICByZXR1cm4gdXNlckNsaWVudDtcbn0pO1xuXG5uZ01vZHVsZS5mYWN0b3J5KCdncm91cENsaWVudCcsIGZ1bmN0aW9uKCRxLCBtZWRpYXRvcikge1xuICB2YXIgbWV0aG9kTmFtZXMgPSBbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnbGlzdCcsICdtZW1iZXJzaGlwJ107XG4gIHZhciBncm91cENsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBHcm91cENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ21lbWJlcnNoaXBDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnbWVtYmVyc2hpcCddO1xuICB2YXIgZ3JvdXBDbGllbnQgPSB3cmFwQ2xpZW50KCRxLCBuZXcgTWVtYmVyc2hpcENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnVzZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXInLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlLmpzJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9ncm91cCdcbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWctZ3JvdXAnKTtcblxudmFyIEdyb3VwQ2xpZW50ID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdGhpcy5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICB0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG59O1xuXG52YXIgeGhyID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBhdGg6ICcvJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMoX29wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQob3B0aW9ucywgZnVuY3Rpb24ocmVzKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICB9LCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIGlkXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IEdyb3VwQ2xpZW50KG1lZGlhdG9yKTtcbn1cbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL21lbWJlcnNoaXAnXG59XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHEgPSByZXF1aXJlKCdxJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLW1lbWJlcnNoaXAnKTtcblxudmFyIE1lbWJlcnNoaXBDbGllbnQgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICB0aGlzLm1lZGlhdG9yID0gbWVkaWF0b3I7XG4gIHRoaXMuaW5pdENvbXBsZXRlID0gZmFsc2U7XG4gIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbn07XG5cbnZhciB4aHIgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcGF0aDogJy8nLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG4gIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyhfb3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5jbG91ZChvcHRpb25zLCBmdW5jdGlvbihyZXMpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gIH0sIGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BzKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZS5wcm9wcyA9IHByb3BzO1xuICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmFwcGlkID0gJGZoLmdldEZIUGFyYW1zKCkuYXBwaWQ7XG4gICAgc2VsZi5pbml0Q29tcGxldGUgPSB0cnVlO1xuICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgaWRcbiAgfSk7XG59O1xuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtZW1iZXJzaGlwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBtZW1iZXJzaGlwLmlkLFxuICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgZGF0YTogbWVtYmVyc2hpcFxuICB9KTtcbn07XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKG1lbWJlcnNoaXApIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGgsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgZGF0YTogbWVtYmVyc2hpcFxuICB9KTtcbn07XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKG1lbWJlcnNoaXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIG1lbWJlcnNoaXAuaWQsXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICBkYXRhOiBtZW1iZXJzaGlwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IE1lbWJlcnNoaXBDbGllbnQobWVkaWF0b3IpO1xufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL3VzZXInLFxuICBhdXRocG9saWN5UGF0aDogJy9ib3gvc3J2LzEuMS9hZG1pbi9hdXRocG9saWN5J1xufVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBxID0gcmVxdWlyZSgncScpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy11c2VyJyk7XG5cbnZhciBVc2VyQ2xpZW50ID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdGhpcy5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICB0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG59O1xuXG52YXIgeGhyID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBhdGg6ICcvJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMoX29wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQob3B0aW9ucywgZnVuY3Rpb24ocmVzKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICB9LCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBzdG9yZVByb2ZpbGUgPSBmdW5jdGlvbihwcm9maWxlRGF0YSkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmgud2ZtLnByb2ZpbGVEYXRhJywgSlNPTi5zdHJpbmdpZnkocHJvZmlsZURhdGEpKTtcbn07XG5cbnZhciByZXRyaWV2ZVByb2ZpbGVEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHZhciBqc29uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZoLndmbS5wcm9maWxlRGF0YScpO1xuICByZXR1cm4ganNvbiA/IEpTT04ucGFyc2UoanNvbikgOiBudWxsO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmxpc3QgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGhcbiAgfSk7XG59O1xuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBpZFxuICB9KTtcbn07XG5cblVzZXJDbGllbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIHVzZXIuaWQsXG4gICAgbWV0aG9kOiAncHV0JyxcbiAgICBkYXRhOiB1c2VyXG4gIH0pO1xufTtcblxuVXNlckNsaWVudC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgdXNlci5pZCxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIGRhdGE6IHVzZXJcbiAgfSk7XG59O1xuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGRhdGE6IHVzZXJcbiAgfSk7XG59O1xuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgJGZoLmF1dGgoe1xuICAgICAgcG9saWN5SWQ6ICd3Zm0nLFxuICAgICAgY2xpZW50VG9rZW46IHNlbGYuYXBwaWQsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdXNlcklkOiB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgLy8gcmVzLnNlc3Npb25Ub2tlbjsgLy8gVGhlIHBsYXRmb3JtIHNlc3Npb24gaWRlbnRpZmllclxuICAgICAgLy8gcmVzLmF1dGhSZXNwb25zZTsgLy8gVGhlIGF1dGhldGljYXRpb24gaW5mb3JtYXRpb24gcmV0dXJuZWQgZnJvbSB0aGUgYXV0aGV0aWNhdGlvbiBzZXJ2aWNlLlxuICAgICAgc3RvcmVQcm9maWxlKHJlcy5hdXRoUmVzcG9uc2UpO1xuICAgICAgc2VsZi5tZWRpYXRvci5wdWJsaXNoKCd3Zm06YXV0aDpwcm9maWxlOmNoYW5nZScsIHJlcy5hdXRoUmVzcG9uc2UpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgIH0sIGZ1bmN0aW9uIChtc2csIGVycikge1xuICAgICAgY29uc29sZS5sb2cobXNnLCBlcnIpO1xuICAgICAgdmFyIGVycm9yTXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICAvKiBQb3NzaWJsZSBlcnJvcnM6XG4gICAgICB1bmtub3duX3BvbGljeUlkIC0gVGhlIHBvbGljeUlkIHByb3ZpZGVkIGRpZCBub3QgbWF0Y2ggYW55IGRlZmluZWQgcG9saWN5LiBDaGVjayB0aGUgQXV0aCBQb2xpY2llcyBkZWZpbmVkLiBTZWUgQXV0aCBQb2xpY2llcyBBZG1pbmlzdHJhdGlvblxuICAgICAgdXNlcl9ub3RfZm91bmQgLSBUaGUgQXV0aCBQb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoZSBwb2xpY3lJZCBwcm92aWRlZCBoYXMgYmVlbiBzZXQgdXAgdG8gcmVxdWlyZSB0aGF0IGFsbCB1c2VycyBhdXRoZW50aWNhdGluZyBleGlzdCBvbiB0aGUgcGxhdGZvcm0sIGJ1dCB0aGlzIHVzZXIgZG9lcyBub3QgZXhpc3RzLlxuICAgICAgdXNlcl9ub3RfYXBwcm92ZWQgLSAtIFRoZSBBdXRoIFBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhlIHBvbGljeUlkIHByb3ZpZGVkIGhhcyBiZWVuIHNldCB1cCB0byByZXF1aXJlIHRoYXQgYWxsIHVzZXJzIGF1dGhlbnRpY2F0aW5nIGFyZSBpbiBhIGxpc3Qgb2YgYXBwcm92ZWQgdXNlcnMsIGJ1dCB0aGlzIHVzZXIgaXMgbm90IGluIHRoYXQgbGlzdC5cbiAgICAgIHVzZXJfZGlzYWJsZWQgLSBUaGUgdXNlciBoYXMgYmVlbiBkaXNhYmxlZCBmcm9tIGxvZ2dpbmcgaW4uXG4gICAgICB1c2VyX3B1cmdlX2RhdGEgLSBUaGUgdXNlciBoYXMgYmVlbiBmbGFnZ2VkIGZvciBkYXRhIHB1cmdlIGFuZCBhbGwgbG9jYWwgZGF0YSBzaG91bGQgYmUgZGVsZXRlZC5cbiAgICAgIGRldmljZV9kaXNhYmxlZCAtIFRoZSBkZXZpY2UgaGFzIGJlZW4gZGlzYWJsZWQuIE5vIHVzZXIgb3IgYXBwcyBjYW4gbG9nIGluIGZyb20gdGhlIHJlcXVlc3RpbmcgZGV2aWNlLlxuICAgICAgZGV2aWNlX3B1cmdlX2RhdGEgLSBUaGUgZGV2aWNlIGhhcyBiZWVuIGZsYWdnZWQgZm9yIGRhdGEgcHVyZ2UgYW5kIGFsbCBsb2NhbCBkYXRhIHNob3VsZCBiZSBkZWxldGVkLlxuICAgICAgKi9cbiAgICAgIGlmIChlcnJvck1zZyA9PSBcInVzZXJfcHVyZ2VfZGF0YVwiIHx8IGVycm9yTXNnID09IFwiZGV2aWNlX3B1cmdlX2RhdGFcIikge1xuICAgICAgICAvLyBUT0RPOiBVc2VyIG9yIGRldmljZSBoYXMgYmVlbiBibGFjayBsaXN0ZWQgZnJvbSBhZG1pbmlzdHJhdGlvbiBjb25zb2xlIGFuZCBhbGwgbG9jYWwgZGF0YSBzaG91bGQgYmUgd2lwZWRcbiAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgb3IgZGV2aWNlIGhhcyBiZWVuIGJsYWNrIGxpc3RlZCBmcm9tIGFkbWluaXN0cmF0aW9uIGNvbnNvbGUgYW5kIGFsbCBsb2NhbCBkYXRhIHNob3VsZCBiZSB3aXBlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQgLSBcIiArIGVycm9yTXNnKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yTXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSlcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmhhc1Nlc3Npb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguYXV0aC5oYXNTZXNzaW9uKGZ1bmN0aW9uKGVyciwgZXhpc3RzKXtcbiAgICBpZihlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY2hlY2sgc2Vzc2lvbjogJywgZXJyKTtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH0gZWxzZSBpZiAoZXhpc3RzKXtcbiAgICAgIC8vdXNlciBpcyBhbHJlYWR5IGF1dGhlbnRpY2F0ZWRcbiAgICAgIC8vb3B0aW9uYWxseSB3ZSBjYW4gYWxzbyB2ZXJpZnkgdGhlIHNlc3Npb24gaXMgYWN1dGFsbHkgdmFsaWQgZnJvbSBjbGllbnQuIFRoaXMgcmVxdWlyZXMgbmV0d29yayBjb25uZWN0aW9uLlxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUuY2xlYXJTZXNzaW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguYXV0aC5jbGVhclNlc3Npb24oZnVuY3Rpb24oZXJyKXtcbiAgICBpZihlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY2xlYXIgc2Vzc2lvbjogJywgZXJyKTtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdG9yZVByb2ZpbGUobnVsbCk7XG4gICAgICBzZWxmLm1lZGlhdG9yLnB1Ymxpc2goJ3dmbTphdXRoOnByb2ZpbGU6Y2hhbmdlJywgbnVsbCk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguYXV0aC52ZXJpZnkoZnVuY3Rpb24oZXJyLCB2YWxpZCl7XG4gICAgaWYoZXJyKXtcbiAgICAgIGNvbnNvbGUubG9nKCdmYWlsZWQgdG8gdmVyaWZ5IHNlc3Npb24nKTtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZih2YWxpZCkge1xuICAgICAgY29uc29sZS5sb2coJ3Nlc3Npb24gaXMgdmFsaWQnKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Nlc3Npb24gaXMgbm90IHZhbGlkJyk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUuZ2V0UHJvZmlsZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcS53aGVuKHJldHJpZXZlUHJvZmlsZURhdGEoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgcmV0dXJuIG5ldyBVc2VyQ2xpZW50KG1lZGlhdG9yKTtcbn1cbiIsInJlcXVpcmUoJy4vdmVoaWNsZS1pbnNwZWN0aW9uLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vdmVoaWNsZS1pbnNwZWN0aW9uLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXInLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3ZlaGljbGUtaW5zcGVjdGlvbi1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJyAgPGRpdiBsYXlvdXQ9XCJyb3dcIiBjbGFzcz1cIndmbS1pbnNwZWN0aW9uLXJvd1wiPlxcbicgK1xuICAgICcgICAgPGRpdiBmbGV4PVwiNDBcIiBsYXlvdXQ9XCJyb3dcIiBsYXlvdXQtYWxpZ249XCJzdGFydCBjZW50ZXJcIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1ib2R5LTJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bG9jYWxfZ2FzX3N0YXRpb248L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgRnVlbCAoJSlcXG4nICtcbiAgICAnICAgICAgPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtc2xpZGVyIGZsZXggbWQtZGlzY3JldGUgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmZ1ZWxcIiBzdGVwPVwiMjVcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgYXJpYS1sYWJlbD1cInJhdGluZ1wiPlxcbicgK1xuICAgICcgICAgPC9tZC1zbGlkZXI+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8ZGl2IGxheW91dD1cInJvd1wiIGNsYXNzPVwid2ZtLWluc3BlY3Rpb24tcm93XCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IGZsZXg9XCIzMFwiIGxheW91dD1cInJvd1wiIGxheW91dC1hbGlnbj1cInN0YXJ0IGNlbnRlclwiPlxcbicgK1xuICAgICcgICAgICA8c3BhbiBjbGFzcz1cIm1kLWJvZHktMlwiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hbGJ1bTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICBUaXJlc1xcbicgK1xuICAgICcgICAgICA8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleCBsYXlvdXQtYWxpZ249XCJzdGFydCBzdGFydFwiPlxcbicgK1xuICAgICcgICAgICA8bWQtcmFkaW8tZ3JvdXAgbGF5b3V0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC50aXJlc1wiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1yYWRpby1idXR0b24gbmctdmFsdWU9XCJmYWxzZVwiID5GYWlsPC9tZC1yYWRpby1idXR0b24+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLXJhZGlvLWJ1dHRvbiBuZy12YWx1ZT1cInRydWVcIj4gUGFzcyA8L21kLXJhZGlvLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgPC9tZC1yYWRpby1ncm91cD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBsYXlvdXQ9XCJyb3dcIiBjbGFzcz1cIndmbS1pbnNwZWN0aW9uLXJvd1wiPlxcbicgK1xuICAgICcgICAgPGRpdiBmbGV4PVwiMzBcIiBsYXlvdXQ9XCJyb3dcIiBsYXlvdXQtYWxpZ249XCJzdGFydCBjZW50ZXJcIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1ib2R5LTJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+YnJpZ2h0bmVzc19sb3c8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgTGlnaHRzXFxuJyArXG4gICAgJyAgICAgIDwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBmbGV4IGxheW91dC1hbGlnbj1cInN0YXJ0IHN0YXJ0XCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1yYWRpby1ncm91cCBsYXlvdXQgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmxpZ2h0c1wiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1yYWRpby1idXR0b24gbmctdmFsdWU9XCJmYWxzZVwiPkZhaWw8L21kLXJhZGlvLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtcmFkaW8tYnV0dG9uIG5nLXZhbHVlPVwidHJ1ZVwiPiBQYXNzIDwvbWQtcmFkaW8tYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8L21kLXJhZGlvLWdyb3VwPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJ3b3JrZmxvdy1hY3Rpb25zIG1kLXBhZGRpbmcgbWQtd2hpdGVmcmFtZS16NFwiPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeSBtZC1odWUtMVwiIG5nLWNsaWNrPVwiY3RybC5iYWNrKCRldmVudClcIj5CYWNrPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5XCIgbmctY2xpY2s9XCJjdHJsLmRvbmUoJGV2ZW50KVwiPkNvbnRpbnVlPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8L2Rpdj48IS0tIHdvcmtmbG93LWFjdGlvbnMtLT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXInLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3ZlaGljbGUtaW5zcGVjdGlvbi50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtc3ViaGVhZGVyPlZlaGljbGUgSW5zcGVjdGlvbjwvbWQtc3ViaGVhZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdCBjbGFzcz1cInJpc2stYXNzZXNzbWVudFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sb2NhbF9nYXNfc3RhdGlvbjwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7dmVoaWNsZUluc3BlY3Rpb24uZnVlbH19ICU8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkZ1ZWw8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIiBjbGFzcz1cInN1Y2Nlc3NcIj5jaGVja19jaXJjbGU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cIiEgdmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIiBjbGFzcz1cImRhbmdlclwiPmNhbmNlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIj5QYXNzPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLnRpcmVzXCI+RmFpbDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+VGlyZXM8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24ubGlnaHRzXCIgY2xhc3M9XCJzdWNjZXNzXCI+Y2hlY2tfY2lyY2xlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLmxpZ2h0c1wiIGNsYXNzPVwiZGFuZ2VyXCI+Y2FuY2VsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCJ2ZWhpY2xlSW5zcGVjdGlvbi5saWdodHNcIj5QYXNzPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLmxpZ2h0c1wiPkZhaWw8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkxpZ2h0czwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS52ZWhpY2xlLWluc3BlY3Rpb24nLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgndmVoaWNsZUluc3BlY3Rpb24nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3ZlaGljbGUtaW5zcGVjdGlvbi50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHZlaGljbGVJbnNwZWN0aW9uOiAnPXZhbHVlJ1xuICAgIH1cbiAgfTtcbn0pXG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgndmVoaWNsZUluc3BlY3Rpb25Gb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24tZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYubW9kZWwgPSB7fTtcbiAgICBzZWxmLmJhY2sgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6YmFjaycpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6ZG9uZScsIHNlbGYubW9kZWwpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udmVoaWNsZS1pbnNwZWN0aW9uJztcbiIsInJlcXVpcmUoJy4vd29ya2Zsb3ctZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZmxvdy1wcm9ncmVzcy50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZmxvdy1zdGVwLWRldGFpbC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZmxvdy1zdGVwLWZvcm0udHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3JrZmxvdy5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3JrZmxvdy5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3JrZmxvdy1mb3JtLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyIG1kLXByaW1hcnlcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPnt7Y3RybC5tb2RlbC5pZCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IHdvcmtmbG93PC9oMz5cXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtmbG93KCRldmVudCwgd29ya2Zsb3cpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya2Zsb3dGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKHdvcmtmbG93Rm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5UaXRsZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInRpdGxlXCIgbmFtZT1cInRpdGxlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnRpdGxlXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2Zsb3cudGl0bGUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZmxvd0Zvcm0udGl0bGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB0aXRsZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPnt7Y3RybC5tb2RlbC5pZCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtmbG93PC9tZC1idXR0b24+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndvcmtmbG93LXByb2dyZXNzXCIgbmctY2xhc3M9XCJ7Y2xvc2U6IGN0cmwuY2xvc2VkfVwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uIG1kLXdhcm0gZXhwYW5kLWNvbGxhcHNlXCI+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbmctc2hvdz1cImN0cmwuY2xvc2VkXCIgbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWNsaWNrPVwiY3RybC5vcGVuKClcIj5rZXlib2FyZF9hcnJvd19kb3duPC9tZC1pY29uPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG5nLXNob3c9XCIhY3RybC5jbG9zZWRcIiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctY2xpY2s9XCJjdHJsLmNsb3NlKClcIj5rZXlib2FyZF9hcnJvd191cDwvbWQtaWNvbj5cXG4nICtcbiAgICAnPC9tZC1idXR0b24+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwic2Nyb2xsLWJveFwiPlxcbicgK1xuICAgICcgIDxvbD5cXG4nICtcbiAgICAnICAgIDxsaSBuZy1jbGFzcz1cInthY3RpdmU6IFxcJy0xXFwnID09IGN0cmwuc3RlcEluZGV4LCBjb21wbGV0ZTogLTEgPCBjdHJsLnN0ZXBJbmRleH1cIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1jYXB0aW9uXCI+PG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnZpc2liaWxpdHk8L21kLWljb24+PC9zcGFuPk92ZXJ2aWV3XFxuJyArXG4gICAgJyAgICA8L2xpPlxcbicgK1xuICAgICcgICAgPGxpIG5nLXJlcGVhdD1cInN0ZXAgaW4gY3RybC5zdGVwc1wiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGluZGV4ID09IGN0cmwuc3RlcEluZGV4LCBjb21wbGV0ZTogJGluZGV4IDwgY3RybC5zdGVwSW5kZXh9XCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtY2FwdGlvblwiPnt7JGluZGV4ICsgMX19PC9zcGFuPnt7c3RlcC5uYW1lfX1cXG4nICtcbiAgICAnICAgIDwvbGk+XFxuJyArXG4gICAgJyAgICA8bGkgbmctY2xhc3M9XCJ7YWN0aXZlOiBjdHJsLnN0ZXBzLmxlbmd0aCA8PSBjdHJsLnN0ZXBJbmRleCwgY29tcGxldGU6IGN0cmwuc3RlcHMubGVuZ3RoIDw9IGN0cmwuc3RlcEluZGV4fVwiPlxcbicgK1xuICAgICcgICAgICA8c3BhbiBjbGFzcz1cIm1kLWNhcHRpb25cIj48bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+ZG9uZTwvbWQtaWNvbj48L3NwYW4+U3VtbWFyeVxcbicgK1xuICAgICcgICAgPC9saT5cXG4nICtcbiAgICAnICA8L29sPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Rpdj48IS0tIHdvcmtmbG93LXByb2dyZXNzIC0tPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3JrZmxvdy5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3JrZmxvdy5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3JrZmxvdy1zdGVwLWRldGFpbC50cGwuaHRtbCcsXG4gICAgJzxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+e3tzdGVwLm5hbWV9fTwvaDI+XFxuJyArXG4gICAgJzxtZC1saXN0PlxcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bGFiZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7c3RlcC5jb2RlfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Db2RlPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8ZGl2IG5nLXNob3c9XCJzdGVwLmZvcm1JZFwiPlxcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bGFiZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3N0ZXAuZm9ybUlkfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkZvcm1JZDwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICc8ZGl2IG5nLXNob3c9XCJzdGVwLnRlbXBsYXRlc1wiPlxcbicgK1xuICAgICcgIDxkaXYgbmctc2hvdz1cInN0ZXAudGVtcGxhdGVzLnZpZXdcIj5cXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxhYmVsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3tzdGVwLnRlbXBsYXRlcy52aWV3fX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlRlbXBsYXRlIHZpZXc8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJyAgPGRpdiBuZy1zaG93PVwic3RlcC50ZW1wbGF0ZXMuZm9ybVwiPlxcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bGFiZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3N0ZXAudGVtcGxhdGVzLmZvcm19fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+VGVtcGxhdGUgZm9ybTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXN0ZXAtZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhciBtZC1wcmltYXJ5XCIgbmctc2hvdz1cInN0ZXBcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlVwZGF0ZSBzdGVwPC9oMz5cXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtmbG93KCRldmVudCwgd29ya2Zsb3cpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya2Zsb3dTdGVwRm9ybVwiIG5nLXN1Ym1pdD1cImN0cmwuZG9uZSh3b3JrZmxvd1N0ZXBGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPkNvZGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJjb2RlXCIgbmFtZT1cImNvZGVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3RlcC5jb2RlXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2Zsb3cubW9kZWwuc3RlcC4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtmbG93Rm9ybS50aXRsZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIGNvZGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5OYW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAubmFtZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtmbG93Lm5hbWUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZmxvd0Zvcm0ubmFtZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIG5hbWUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5Gb3JtSUQ8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJmb3JtSWRcIiBuYW1lPVwiZm9ybUlkXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAuZm9ybUlkXCI+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWw+Zm9ybSB0ZW1wbGF0ZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZvcm1cIiBuYW1lPVwiZm9ybVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLnRlbXBsYXRlcy5mb3JtXCI+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWw+dmlldyB0ZW1wbGF0ZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInZpZXdcIiBuYW1lPVwidmlld1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLnRlbXBsYXRlcy52aWV3XCI+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPnt7Y3RybC5tb2RlbC5pc05ldyA/IFxcJ0FkZFxcJyA6IFxcJ1VwZGF0ZVxcJ319IHN0ZXA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXG4gICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnd29ya2Zsb3dQcm9ncmVzcycsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCkge1xuICBmdW5jdGlvbiBwYXJzZVN0ZXBJbmRleChjdHJsLCBzdGVwSW5kZXgpIHtcbiAgICBjdHJsLnN0ZXBJbmRleCA9IHN0ZXBJbmRleDtcbiAgICBjdHJsLnN0ZXAgPSBjdHJsLnN0ZXBzW2N0cmwuc3RlcEluZGV4XTtcbiAgfVxuICBmdW5jdGlvbiBzY3JvbGxUb0FjdGl2ZShlbGVtZW50KSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnRbMF07XG4gICAgdmFyIGFjdGl2ZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGkuYWN0aXZlJyk7XG4gICAgaWYgKCFhY3RpdmUpIHtcbiAgICAgIGFjdGl2ZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGknKTtcbiAgICB9O1xuICAgIHZhciBzY3JvbGxlciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbC1ib3gnKTtcbiAgICB2YXIgb2Zmc2V0ID0gYWN0aXZlLm9mZnNldFRvcDtcbiAgICBzY3JvbGxlci5zY3JvbGxUb3AgPSBvZmZzZXQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXByb2dyZXNzLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgc3RlcEluZGV4OiAnPScsXG4gICAgICB3b3JrZmxvdzogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzY3JvbGxUb0FjdGl2ZShlbGVtZW50KTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLndvcmtmbG93ID0gJHNjb3BlLndvcmtmbG93O1xuICAgICAgc2VsZi5zdGVwcyA9ICRzY29wZS53b3JrZmxvdy5zdGVwcztcbiAgICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc2VsZi5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY3JvbGxUb0FjdGl2ZSgkZWxlbWVudCk7XG4gICAgICAgIHNlbGYuY2xvc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHBhcnNlU3RlcEluZGV4KHNlbGYsICRzY29wZS5zdGVwSW5kZXggPyBwYXJzZUludCgkc2NvcGUuc3RlcEluZGV4KSA6IDApXG5cbiAgICAgICRzY29wZS4kd2F0Y2goJ3N0ZXBJbmRleCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RlcEluZGV4IGNoYW5nZWQnKVxuICAgICAgICBwYXJzZVN0ZXBJbmRleChzZWxmLCAkc2NvcGUuc3RlcEluZGV4ID8gcGFyc2VJbnQoJHNjb3BlLnN0ZXBJbmRleCkgOiAwKTtcbiAgICAgICAgc2VsZi5jbG9zZWQgPSB0cnVlO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBzY3JvbGxUb0FjdGl2ZSgkZWxlbWVudCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd3b3JrZmxvd1N0ZXAnLCBmdW5jdGlvbigkdGVtcGxhdGVSZXF1ZXN0LCAkY29tcGlsZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgc2NvcGU6IHtcbiAgICAgIHN0ZXA6ICc9JyAvLyB7IC4uLiwgdGVtcGxhdGU6IFwiYW4gaHRtbCB0ZW1wbGF0ZSB0byB1c2VcIiwgdGVtcGxhdGVQYXRoOiBcImEgdGVtcGxhdGUgcGF0aCB0byBsb2FkXCJ9XG4gICAgLCB3b3Jrb3JkZXI6ICc9J1xuICAgIH1cbiAgLCBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goJ3N0ZXAnLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgIGlmIChzY29wZS5zdGVwKSB7XG4gICAgICAgICAgaWYgKHNjb3BlLnN0ZXAuZm9ybUlkKSB7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoJzxhcHBmb3JtIGZvcm0taWQ9XCJzdGVwLmZvcm1JZFwiPjwvYXBwZm9ybT4nKTtcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2NvcGUuc3RlcC50ZW1wbGF0ZVBhdGgpIHtcbiAgICAgICAgICAgICR0ZW1wbGF0ZVJlcXVlc3Qoc2NvcGUuc3RlcC50ZW1wbGF0ZVBhdGgpLnRoZW4oZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5odG1sKHNjb3BlLnN0ZXAudGVtcGxhdGVzLmZvcm0pO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYubWVkaWF0b3IgPSBtZWRpYXRvcjtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtmbG93UmVzdWx0JywgZnVuY3Rpb24oJGNvbXBpbGUpIHtcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIGlmIChzY29wZS53b3JrZmxvdy5zdGVwcyAmJiBzY29wZS5yZXN1bHQpIHtcbiAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgIHNjb3BlLndvcmtmbG93LnN0ZXBzLmZvckVhY2goZnVuY3Rpb24oc3RlcCwgc3RlcEluZGV4KSB7XG4gICAgICAgIGlmIChzY29wZS5yZXN1bHQuc3RlcFJlc3VsdHMgJiYgc2NvcGUucmVzdWx0LnN0ZXBSZXN1bHRzW3N0ZXAuY29kZV0pIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZCgnPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPicpO1xuICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuICAgICAgICAgIHRlbXBsYXRlID0gJzx3b3Jrb3JkZXItc3VibWlzc2lvbi1yZXN1bHQnXG4gICAgICAgICAgdGVtcGxhdGUgKz0gJyByZXN1bHQ9XCJyZXN1bHQuc3RlcFJlc3VsdHNbXFwnJytzdGVwLmNvZGUrJ1xcJ11cIidcbiAgICAgICAgICB0ZW1wbGF0ZSArPSAnIHN0ZXA9XCJ3b3JrZmxvdy5zdGVwc1tcXCcnK3N0ZXBJbmRleCsnXFwnXVwiJ1xuICAgICAgICAgIHRlbXBsYXRlICs9ICc+PC93b3Jrb3JkZXItc3VibWlzc2lvbi1yZXN1bHQ+JztcbiAgICAgICAgICBjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7XG4gICAgICAgICAgZWxlbWVudC5hcHBlbmQodGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93OiAnPSdcbiAgICAsIHJlc3VsdDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJlbmRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCd3b3JrZmxvd0Zvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93IDogJz12YWx1ZSdcbiAgICAgIH1cbiAgICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtmbG93KTtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oaXNWYWxpZCkge1xuICAgICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLm1vZGVsLmlkICYmIHNlbGYubW9kZWwuaWQgIT09IDApIHtcbiAgICAgICAgICAgICAgc2VsZi5tb2RlbC5zdGVwcyA9IFtdO1xuICAgICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6Y3JlYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzZWxmLnNlbGVjdFdvcmtmbG93ID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtmbG93KSB7XG4gICAgICAgICAgaWYod29ya2Zsb3cuaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIHdvcmtmbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6bGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgIH07XG4gIH0pXG4uZGlyZWN0aXZlKCd3b3JrZmxvd1N0ZXBGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRSdcbiAgICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZmxvdy1zdGVwLWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93IDogJz0nLFxuICAgICAgc3RlcCA6ICc9J1xuICAgICAgfVxuICAgICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGV4aXN0aW5nU3RlcDtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYoISRzY29wZS5zdGVwKXtcbiAgICAgICAgICBzZWxmLm1vZGVsID0ge1xuICAgICAgICAgICAgc3RlcCA6IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVzIDoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZmxvdyA6IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2Zsb3cpLFxuICAgICAgICAgICAgaXNOZXcgOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNlbGYubW9kZWwgPSB7XG4gICAgICAgICAgICB3b3JrZmxvdyA6IGFuZ3VsYXIuY29weSgkc2NvcGUud29ya2Zsb3cpLFxuICAgICAgICAgICAgc3RlcCA6IGFuZ3VsYXIuY29weSgkc2NvcGUuc3RlcClcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhpc3RpbmdTdGVwID0gJHNjb3BlLndvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7cmV0dXJuIGl0ZW0uY29kZSA9PSAkc2NvcGUuc3RlcC5jb2RlO30pLmxlbmd0aD4wO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oaXNWYWxpZCkge1xuICAgICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAvL3dlIGNoZWNrIGlmIHRoZSBzdGVwIGFscmVhZHkgZXhpc3Qgb3Igbm90LCBpZiBpdCBleHNpdCB3ZSByZW1vdmUgdGhlIG9sZCBlbGVtZW50XG4gICAgICAgICAgICAgIGlmKGV4aXN0aW5nU3RlcCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLndvcmtmbG93LnN0ZXBzID0gJHNjb3BlLndvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7cmV0dXJuIGl0ZW0uY29kZSAhPSAkc2NvcGUuc3RlcC5jb2RlO30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vd2UgYWRkIHRoZSBuZXcgb3IgdXBkYXRlZCBzdGVwXG4gICAgICAgICAgICAgICRzY29wZS53b3JrZmxvdy5zdGVwcy5wdXNoKHNlbGYubW9kZWwuc3RlcCk7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzp1cGRhdGVkJywgJHNjb3BlLndvcmtmbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5zZWxlY3RXb3JrZmxvdyA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZmxvdykge1xuICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIHdvcmtmbG93KTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgIH07XG4gIH0pXG4gIC5kaXJlY3RpdmUoJ3dvcmtmbG93U3RlcERldGFpbCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwnKVxuICAgICAgLCBzY29wZToge1xuICAgICAgICAgIHN0ZXAgOiAnPSdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuICAsIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICA7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3JrZmxvdy5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5uZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHdvcmtmbG93ID0ge1xuICAgICAgICB0aXRsZTogJydcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHdvcmtmbG93KTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuc3luYycsIFtyZXF1aXJlKCdmaC13Zm0tc3luYycpXSlcbi5mYWN0b3J5KCd3b3JrZmxvd1N5bmMnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIHN5bmNTZXJ2aWNlKSB7XG4gIHN5bmNTZXJ2aWNlLmluaXQoJGZoLCBjb25maWcuc3luY09wdGlvbnMpO1xuICB2YXIgd29ya2Zsb3dTeW5jID0ge307XG4gIHdvcmtmbG93U3luYy5jcmVhdGVNYW5hZ2VyID0gZnVuY3Rpb24ocXVlcnlQYXJhbXMpIHtcbiAgICBpZiAod29ya2Zsb3dTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKHdvcmtmbG93U3luYy5tYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHdvcmtmbG93U3luYy5tYW5hZ2VyUHJvbWlzZSA9IHN5bmNTZXJ2aWNlLm1hbmFnZShjb25maWcuZGF0YXNldElkLCBudWxsLCBxdWVyeVBhcmFtcylcbiAgICAgIC50aGVuKGZ1bmN0aW9uKG1hbmFnZXIpIHtcbiAgICAgICAgd29ya2Zsb3dTeW5jLm1hbmFnZXIgPSB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQsICd3aXRoIGZpbHRlcjogJywgcXVlcnlQYXJhbXMpO1xuICAgICAgICAvLyBUT0RPOiB3ZSBzaG91bGQgcmVmYWN0b3IgdGhlc2UgdXRpbGl0aWVzIGZ1bmN0aW9ucyBzb21ld2hlcmUgZWxzZSBwcm9iYWJseVxuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlci5zdGVwUmV2aWV3ID0gZnVuY3Rpb24oc3RlcHMsIHJlc3VsdCkge1xuICAgICAgICAgIHZhciBzdGVwSW5kZXggPSAtMTtcbiAgICAgICAgICB2YXIgY29tcGxldGU7XG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3RlcFJlc3VsdHMgJiYgcmVzdWx0LnN0ZXBSZXN1bHRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHN0ZXAgPSBzdGVwc1tpXTtcbiAgICAgICAgICAgICAgdmFyIHN0ZXBSZXN1bHQgPSByZXN1bHQuc3RlcFJlc3VsdHNbc3RlcC5jb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHN0ZXBSZXN1bHQgJiYgKHN0ZXBSZXN1bHQuc3RhdHVzID09PSAnY29tcGxldGUnIHx8IHN0ZXBSZXN1bHQuc3RhdHVzID09PSAncGVuZGluZycpKSB7XG4gICAgICAgICAgICAgICAgc3RlcEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpZiAoc3RlcFJlc3VsdC5zdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgICAgY29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmV4dFN0ZXBJbmRleDogc3RlcEluZGV4LFxuICAgICAgICAgICAgY29tcGxldGU6IGNvbXBsZXRlIC8vIGZhbHNlIGlzIGFueSBzdGVwcyBhcmUgXCJwZW5kaW5nXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya2Zsb3dTeW5jLm1hbmFnZXIubmV4dFN0ZXBJbmRleCA9IGZ1bmN0aW9uKHN0ZXBzLCByZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdGVwUmV2aWV3KHN0ZXBzLCByZXN1bHQpLm5leHRTdGVwSW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlci5jaGVja1N0YXR1cyA9IGZ1bmN0aW9uKHdvcmtvcmRlciwgd29ya2Zsb3csIHJlc3VsdCkge1xuICAgICAgICAgIHZhciBzdGF0dXM7XG4gICAgICAgICAgdmFyIHN0ZXBSZXZpZXcgPSB0aGlzLnN0ZXBSZXZpZXcod29ya2Zsb3cuc3RlcHMsIHJlc3VsdCk7XG4gICAgICAgICAgaWYgKHN0ZXBSZXZpZXcubmV4dFN0ZXBJbmRleCA+PSB3b3JrZmxvdy5zdGVwcy5sZW5ndGggLSAxICYmIHN0ZXBSZXZpZXcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdDb21wbGV0ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmICghd29ya29yZGVyLmFzc2lnbmVlKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnVW5hc3NpZ25lZCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGVwUmV2aWV3Lm5leHRTdGVwSW5kZXggPCAwKSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnTmV3JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gJ0luIFByb2dyZXNzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd29ya2Zsb3dTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgd29ya2Zsb3dTeW5jLnJlbW92ZU1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAod29ya2Zsb3dTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB3b3JrZmxvd1N5bmMubWFuYWdlci5zYWZlU3RvcCgpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIHdvcmtmbG93U3luYy5tYW5hZ2VyO1xuICAgICAgfSlcbiAgICB9XG4gIH07XG4gIHJldHVybiB3b3JrZmxvd1N5bmM7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3JrZmxvdyc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlLmpzJylcbl0pXG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaUhvc3Q6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxuICBhcGlQYXRoOiAnL2FwaS93Zm0vd29ya2Zsb3cnLFxuICBkYXRhc2V0SWQgOiAnd29ya2Zsb3dzJyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsInJlcXVpcmUoJy4vd29ya29yZGVyLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya29yZGVyLWxpc3QudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya29yZGVyLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXItZm9ybS50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhciBtZC1wcmltYXJ5XCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz57e2N0cmwubW9kZWwuaWQgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSB3b3JrIG9yZGVyIElEIHt7Y3RybC5tb2RlbC5pZH19PC9oMz5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJ7e2N0cmwuc3RhdHVzfX1cIj5cXG4nICtcbiAgICAnICAgICAgPHdvcmtvcmRlci1zdGF0dXMgc3RhdHVzPVwiY3RybC5zdGF0dXNcIj48L3dvcmtvcmRlci1zdGF0dXM+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8c3BhbiBmbGV4Pjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIG5nLWNsaWNrPVwiY3RybC5zZWxlY3RXb3Jrb3JkZXIoJGV2ZW50LCBjdHJsLm1vZGVsKVwiPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gbmFtZT1cIndvcmtvcmRlckZvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUod29ya29yZGVyRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8IS0tXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3Jrb3JkZXJTdGF0ZVwiPlN0YXR1czwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0V29ya29yZGVyVHlwZVwiIG5hbWU9XCJ3b3Jrb3JkZXJTdGF0dXNcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3RhdHVzXCIgZGlzYWJsZWQ9XCJ0cnVlXCI+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgLS0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGxheW91dC1ndC1zbT1cInJvd1wiPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya29yZGVyVHlwZVwiPlR5cGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cImN0cmwubW9kZWwudHlwZVwiIG5hbWU9XCJ3b3Jrb3JkZXJUeXBlXCIgaWQ9XCJ3b3Jrb3JkZXJUeXBlXCI+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwiSm9iIE9yZGVyXCI+Sm9iIE9yZGVyPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwiVHlwZSAwMlwiPlR5cGUgMDI8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJUeXBlIDAzXCI+VHlwZSAwMzwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cIlR5cGUgMDRcIj5UeXBlIDA0PC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2Zsb3dcIj5Xb3JrZmxvdzwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC53b3JrZmxvd0lkXCIgbmFtZT1cIndvcmtmbG93XCIgaWQ9XCJ3b3JrZmxvd1wiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJ3b3JrZmxvdyBpbiBjdHJsLndvcmtmbG93c1wiIHZhbHVlPVwie3t3b3JrZmxvdy5pZH19XCI+e3t3b3JrZmxvdy5pZH19IC0ge3t3b3JrZmxvdy50aXRsZX19PC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJyAgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0ud29ya2Zsb3cuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLndvcmtmbG93LiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHdvcmtmbG93IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiYXNzaWduZWVcIj5Bc3NpZ25lZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5hc3NpZ25lZVwiIG5hbWU9XCJhc3NpZ25lZVwiIGlkPVwiYXNzaWduZWVcIj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiIHZhbHVlPVwie3t3b3JrZXIuaWR9fVwiPnt7d29ya2VyLm5hbWV9fSAoe3t3b3JrZXIucG9zaXRpb259fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPlRpdGxlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5wdXRUaXRsZVwiIG5hbWU9XCJ0aXRsZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC50aXRsZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0udGl0bGUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLnRpdGxlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgdGl0bGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0QWRkcmVzc1wiPkFkZHJlc3M8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgIGlkPVwiaW5wdXRBZGRyZXNzXCIgbmFtZT1cImFkZHJlc3NcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuYWRkcmVzc1wiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0uYWRkcmVzcy4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5hZGRyZXNzLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkFuIGFkZHJlc3MgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGxheW91dC1ndC1zbT1cInJvd1wiPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRBZGRyZXNzXCI+TGF0dGl0dWRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiICBpZD1cImlucHV0TGF0dGl0dWRlXCIgbmFtZT1cImxhdHRpdHVkZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5sb2NhdGlvblswXVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0ubGF0dGl0dWRlLiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLmxhdHRpdHVkZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BbiBsYXR0aXR1ZGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBmbGV4LWd0LXNtPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0QWRkcmVzc1wiPkxvbmdpdHVkZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgaWQ9XCJpbnB1dExhdHRpdHVkZVwiIG5hbWU9XCJsb25naXR1ZGVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwubG9jYXRpb25bMV1cIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmxvbmdpdHVkZS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5sb25naXR1ZGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gbG9uZ2l0dWRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBsYXlvdXQtZ3Qtc209XCJyb3dcIj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBmbGV4LWd0LXNtPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0RmluaXNoRGF0ZVwiPkZpbmlzaCBEYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiICBpZD1cImlucHV0RmluaXNoRGF0ZVwiIG5hbWU9XCJmaW5pc2hEYXRlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmZpbmlzaERhdGVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmZpbmlzaERhdGUuJGVycm9yXCIgbmctc2hvdz1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0uZmluaXNoRGF0ZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIGZpbmlzaCBkYXRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dEZpbmlzaFRpbWVcIiA+RmluaXNoIFRpbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0aW1lXCIgIGlkPVwiaW5wdXRGaW5pc2hUaW1lXCIgbmFtZT1cImZpbmlzaFRpbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuZmluaXNoVGltZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0uZmluaXNoVGltZS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5maW5pc2hUaW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgZmluaXNoIHRpbWUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWNsYXNzPVwieyBcXCdoYXMtZXJyb3JcXCcgOiB3b3Jrb3JkZXJGb3JtLnN1bW1hcnkuJGludmFsaWQgJiYgIXdvcmtvcmRlckZvcm0uc3VtbWFyeS4kcHJpc3RpbmUgfVwiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0U3VtbWFyeVwiPlN1bW1hcnk8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPHRleHRhcmVhIGlkPVwiaW5wdXRTdW1tYXJ5XCIgbmFtZT1cInN1bW1hcnlcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3VtbWFyeVwiIHJlcXVpcmVkIG1kLW1heGxlbmd0aD1cIjE1MFwiPjwvdGV4dGFyZWE+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0uc3VtbWFyeS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5zdW1tYXJ5LiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgc3VtbWFyeSBkYXRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlkID8gXFwnVXBkYXRlXFwnIDogXFwnQ3JlYXRlXFwnfX0gV29ya29yZGVyPC9tZC1idXR0b24+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXItbGlzdC50cGwuaHRtbCcsXG4gICAgJzwhLS1cXG4nICtcbiAgICAnIENPTkZJREVOVElBTFxcbicgK1xuICAgICcgQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXFxuJyArXG4gICAgJyBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5Xb3Jrb3JkZXJzPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9oMz5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gYWN0aW9uPVwiI1wiIGNsYXNzPVwicGVyc2lzdGVudC1zZWFyY2hcIiBoaWRlLXhzIGhpZGUtc20+XFxuJyArXG4gICAgJyAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIiBuZy1tb2RlbD1cInNlYXJjaFZhbHVlXCIgbmctY2hhbmdlPVwiY3RybC5hcHBseUZpbHRlcihzZWFyY2hWYWx1ZSlcIj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbVxcbicgK1xuICAgICcgICAgbmctcmVwZWF0PVwid29ya29yZGVyIGluIGN0cmwud29ya29yZGVyc1wiXFxuJyArXG4gICAgJyAgICBuZy1jbGljaz1cImN0cmwuc2VsZWN0V29ya29yZGVyKCRldmVudCwgd29ya29yZGVyKVwiXFxuJyArXG4gICAgJyAgICBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IHdvcmtvcmRlci5pZH1cIlxcbicgK1xuICAgICcgICAgY2xhc3M9XCJtZC0zLWxpbmUgd29ya29yZGVyLWl0ZW1cIlxcbicgK1xuICAgICcgID5cXG4nICtcbiAgICAnPCEtLVxcbicgK1xuICAgICcgIFRPRE86IGNoYW5nZSBjbGFzcyBuYW1lIGFjY29yZGluZyB0byB0aGUgY29sb3I6XFxuJyArXG4gICAgJyAgICBcInN1Y2Nlc3NcIiA9IGdyZWVuXFxuJyArXG4gICAgJyAgICBkYW5nZXIgPSBcInJlZFwiXFxuJyArXG4gICAgJyAgICB3YXJuaW5nID0gXCJ5ZWxsb3dcIlxcbicgK1xuICAgICcgICAgbm8gY2xhc3MgPSBncmV5XFxuJyArXG4gICAgJyAgLS0+XFxuJyArXG4gICAgJyAgPHdvcmtvcmRlci1zdGF0dXMgY2xhc3M9XCJcIiBzdGF0dXM9XCJjdHJsLnJlc3VsdE1hcFt3b3Jrb3JkZXIuaWRdLnN0YXR1c1wiPjwvd29ya29yZGVyLXN0YXR1cz5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPlxcbicgK1xuICAgICcgICAgICAgIHt7d29ya29yZGVyLnR5cGV9fSAtXFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4gbmctaWY9XCJ3b3Jrb3JkZXIuaWRcIj57e3dvcmtvcmRlci5pZH19PC9zcGFuPlxcbicgK1xuICAgICcgICAgICAgIDxzcGFuIG5nLWlmPVwiISB3b3Jrb3JkZXIuaWRcIiBzdHlsZT1cImZvbnQtc3R5bGU6IGl0YWxpYztcIj4mbHQ7bG9jYWwmZ3Q7PC9zcGFuPlxcbicgK1xuICAgICcgICAgICA8L2gzPlxcbicgK1xuICAgICcgICAgICA8aDQ+e3t3b3Jrb3JkZXIudGl0bGV9fTwvaDQ+XFxuJyArXG4gICAgJyAgICAgIDxwPnt7d29ya29yZGVyLmFkZHJlc3N9fTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLnRwbC5odG1sJyxcbiAgICAnPCEtLVxcbicgK1xuICAgICcgQ09ORklERU5USUFMXFxuJyArXG4gICAgJyBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cXG4nICtcbiAgICAnIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cXG4nICtcbiAgICAnLS0+XFxuJyArXG4gICAgJyAgPG1kLWxpc3Q+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDx3b3Jrb3JkZXItc3RhdHVzIHN0YXR1cz1cInN0YXR1c1wiPjwvd29ya29yZGVyLXN0YXR1cz5cXG4nICtcbiAgICAnICAgIDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICA8aDM+e3tzdGF0dXMgfHwgXCJOZXdcIn19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICA8cD5TdGF0dXM8L3A+XFxuJyArXG4gICAgJyAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSBtZC1sb25nLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBsYWNlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgPGgzPnt7d29ya29yZGVyLmxvY2F0aW9uWzBdfX0sIHt7d29ya29yZGVyLmxvY2F0aW9uWzFdfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgICA8cD5cXG4nICtcbiAgICAnICAgICAgICAgICB7e3dvcmtvcmRlci5hZGRyZXNzfX1cXG4nICtcbiAgICAnICAgICAgICAgPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hc3NpZ25tZW50PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3t3b3Jrb3JkZXIudGl0bGV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+V29ya29yZGVyPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5ldmVudDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7d29ya29yZGVyLnN0YXJ0VGltZXN0YW1wIHwgZGF0ZTpcXCd5eXl5LU1NLWRkXFwnIH19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5GaW5pc2ggRGF0ZTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+c2NoZWR1bGU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3dvcmtvcmRlci5zdGFydFRpbWVzdGFtcCB8IGRhdGU6XFwnSEg6bW06c3MgWlxcJyB9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+RmluaXNoIFRpbWU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLXNob3c9XCJhc3NpZ25lZSAmJiBhc3NpZ25lZS5uYW1lXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5wZXJzb248L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2Fzc2lnbmVlLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+QXNpZ25lZTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPC9tZC1saXN0PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtc3ViaGVhZGVyIGNsYXNzPVwibWQtbm8tc3RpY2t5XCI+V29yayBTdW1tYXJ5PC9tZC1zdWJoZWFkZXI+XFxuJyArXG4gICAgJyAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIiBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICcgICAge3t3b3Jrb3JkZXIuc3VtbWFyeX19XFxuJyArXG4gICAgJyAgPC9wPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxudmFyIGdldFN0YXR1c0ljb24gPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgdmFyIHN0YXR1c0ljb247XG4gIHN3aXRjaChzdGF0dXMpIHtcbiAgICBjYXNlICdJbiBQcm9ncmVzcyc6XG4gICAgICBzdGF0dXNJY29uID0gJ2F1dG9yZW5ldyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdDb21wbGV0ZSc6XG4gICAgICBzdGF0dXNJY29uID0gJ2Fzc2lnbm1lbnRfdHVybmVkX2luJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0Fib3J0ZWQnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhc3NpZ25tZW50X2xhdGUnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnT24gSG9sZCc6XG4gICAgICBzdGF0dXNJY29uID0gJ3BhdXNlJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1VuYXNzaWduZWQnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhc3NpZ25tZW50X2luZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdOZXcnOlxuICAgICAgc3RhdHVzSWNvbiA9ICduZXdfcmVsZWFzZXMnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXR1c0ljb24gPSAncmFkaW9fYnV0dG9uX3VuY2hlY2tlZCc7XG4gIH1cbiAgcmV0dXJuIHN0YXR1c0ljb247XG59XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnd29ya29yZGVyTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLWxpc3QudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB3b3Jrb3JkZXJzIDogJz0nLFxuICAgICAgcmVzdWx0TWFwOiAnPScsXG4gICAgICBzZWxlY3RlZE1vZGVsOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLndvcmtvcmRlcnMgPSAkc2NvcGUud29ya29yZGVycztcbiAgICAgIHNlbGYucmVzdWx0TWFwID0gJHNjb3BlLnJlc3VsdE1hcDtcbiAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgIHNlbGYuc2VsZWN0V29ya29yZGVyID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgICAgICAvLyBzZWxmLnNlbGVjdGVkV29ya29yZGVySWQgPSB3b3Jrb3JkZXIuaWQ7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCB3b3Jrb3JkZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNXb3Jrb3JkZXJTaG93biA9IGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bldvcmtvcmRlciA9PT0gd29ya29yZGVyO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya29yZGVyLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKHdvcmtvcmRlci50aXRsZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXIudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgd29ya29yZGVyOiAnPScsXG4gICAgYXNzaWduZWU6ICc9JyxcbiAgICBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2hvd1NlbGVjdEJ1dHRvbiA9ICEhICRzY29wZS4kcGFyZW50LndvcmtvcmRlcnM7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtvcmRlckZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1mb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgIHdvcmtvcmRlciA6ICc9dmFsdWUnXG4gICwgd29ya2Zsb3dzOiAnPSdcbiAgLCB3b3JrZXJzOiAnPSdcbiAgLCBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtvcmRlcik7XG4gICAgICBzZWxmLndvcmtmbG93cyA9ICRzY29wZS53b3JrZmxvd3M7XG4gICAgICBzZWxmLndvcmtlcnMgPSAkc2NvcGUud29ya2VycztcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBpZiAoc2VsZi5tb2RlbCAmJiBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKSB7XG4gICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKTtcbiAgICAgIH07XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wID0gbmV3IERhdGUoc2VsZi5tb2RlbC5maW5pc2hEYXRlKTsgLy8gVE9ETzogaW5jb3Jwb3JhdGUgc2VsZi5tb2RlbC5maW5pc2hUaW1lXG4gICAgICAgICAgc2VsZi5tb2RlbC5zdGFydFRpbWVzdGFtcC5zZXRIb3VycyhcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRIb3VycygpLFxuICAgICAgICAgICAgc2VsZi5tb2RlbC5maW5pc2hUaW1lLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRTZWNvbmRzKCksXG4gICAgICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd3b3Jrb3JkZXJTdGF0dXMnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICc8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+e3tzdGF0dXNJY29ufX08bWQtdG9vbHRpcD57e3N0YXR1c319PC9tZC10b29sdGlwPjwvbWQtaWNvbj4nXG4gICwgc2NvcGU6IHtcbiAgICAgIHN0YXR1cyA6ICc9c3RhdHVzJ1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICRzY29wZS5zdGF0dXNJY29uID0gZ2V0U3RhdHVzSWNvbigkc2NvcGUuc3RhdHVzKTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfVxufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyU3VibWlzc2lvblJlc3VsdCcsIGZ1bmN0aW9uKCRjb21waWxlKSB7XG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBpZiAoIXNjb3BlLnJlc3VsdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gc2NvcGUucmVzdWx0O1xuICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuICAgIGlmIChzY29wZS5zdGVwLmZvcm1JZCkge1xuICAgICAgdmFyIHN1Ym1pc3Npb24gPSByZXN1bHQuc3VibWlzc2lvbjtcbiAgICAgIHZhciB0YWcsIHN1YklkO1xuICAgICAgaWYgKHN1Ym1pc3Npb24uX3N1Ym1pc3Npb24pIHtcbiAgICAgICAgdGFnID0gJ3N1Ym1pc3Npb24nO1xuICAgICAgICBzdWJJZCA9IHN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cbiAgICAgICAgdGVtcGxhdGUgPSAnPGFwcGZvcm0tc3VibWlzc2lvbiBzdWJtaXNzaW9uPVwicmVzdWx0LnN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25JZCkge1xuICAgICAgICB0ZW1wbGF0ZSA9ICc8YXBwZm9ybS1zdWJtaXNzaW9uIHN1Ym1pc3Npb24taWQ9XCJcXCcnK3N1Ym1pc3Npb24uc3VibWlzc2lvbklkKydcXCdcIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgICAgIHRlbXBsYXRlID0gJzxhcHBmb3JtLXN1Ym1pc3Npb24gc3VibWlzc2lvbi1sb2NhbC1pZD1cIlxcJycrc3VibWlzc2lvbi5zdWJtaXNzaW9uTG9jYWxJZCsnXFwnXCI+PC9hcHBmb3JtLXN1Ym1pc3Npb24+JztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlID0gc2NvcGUuc3RlcC50ZW1wbGF0ZXMudmlldztcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmQodGVtcGxhdGUpO1xuICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHNjb3BlOiB7XG4gICAgICByZXN1bHQ6ICc9J1xuICAgICwgc3RlcDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJlbmRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLndvcmtvcmRlci5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5uZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHdvcmtvcmRlciA9IHtcbiAgICAgICAgdHlwZTogJ0pvYiBPcmRlcidcbiAgICAgICwgc3RhdHVzOiAnTmV3J1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUod29ya29yZGVyKTtcbiAgICB9LCAwKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlZE1hbmFnZXI7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLnN5bmMnLCBbcmVxdWlyZSgnZmgtd2ZtLXN5bmMnKV0pXG4uZmFjdG9yeSgnd29ya29yZGVyU3luYycsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgc3luY1NlcnZpY2UpIHtcbiAgc3luY1NlcnZpY2UuaW5pdCgkZmgsIGNvbmZpZy5zeW5jT3B0aW9ucyk7XG4gIHZhciB3b3Jrb3JkZXJTeW5jID0ge307XG4gIHdvcmtvcmRlclN5bmMuY3JlYXRlTWFuYWdlciA9IGZ1bmN0aW9uKHF1ZXJ5UGFyYW1zKSB7XG4gICAgaWYgKHdvcmtvcmRlclN5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuICRxLndoZW4od29ya29yZGVyU3luYy5tYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHdvcmtvcmRlclN5bmMubWFuYWdlclByb21pc2UgPSBzeW5jU2VydmljZS5tYW5hZ2UoY29uZmlnLmRhdGFzZXRJZCwgbnVsbCwgcXVlcnlQYXJhbXMpXG4gICAgICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgICAgIHdvcmtvcmRlclN5bmMubWFuYWdlciA9IHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcik7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTeW5jIGlzIG1hbmFnaW5nIGRhdGFzZXQ6JywgY29uZmlnLmRhdGFzZXRJZCwgJ3dpdGggZmlsdGVyOiAnLCBxdWVyeVBhcmFtcyk7XG4gICAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgd29ya29yZGVyU3luYy5yZW1vdmVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHdvcmtvcmRlclN5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuIHdvcmtvcmRlclN5bmMubWFuYWdlci5zYWZlU3RvcCgpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIHdvcmtvcmRlclN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHJldHVybiB3b3Jrb3JkZXJTeW5jO1xufSlcbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ud29ya29yZGVyJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXInLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zeW5jLXNlcnZpY2UnKVxuXSlcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS93b3Jrb3JkZXInLFxuICBkYXRhc2V0SWQgOiAnd29ya29yZGVycycsXG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCdkMycpXG52YXIgYzMgPSByZXF1aXJlKCdjMycpXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuYW5hbHl0aWNzJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5hbmFseXRpY3MnLCBbXG4gICd1aS5yb3V0ZXInLFxuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuYW5hbHl0aWNzJywge1xuICAgICAgdXJsOiAnL2FuYWx5dGljcycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYW5hbHl0aWNzL2FuYWx5dGljcy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2FuYWx5dGljc0NvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG59KVxuXG4uY29udHJvbGxlcignYW5hbHl0aWNzQ29udHJvbGxlcicsIGZ1bmN0aW9uICh3b3Jrb3JkZXJzLCB3b3JrZXJzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcblxuICAvL2FkZCBmYWtlIGRhdGEgZm9yIGJhciBjaGFydHNcbiAgc2VsZi53b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgdmFyIGVzdGltYXRlZCAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgIHZhciByZWFsID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICB3b3Jrb3JkZXIuZXN0aW1hdGVkSG91cnMgPSBlc3RpbWF0ZWQ7XG4gICAgd29ya29yZGVyLmVmZmVjdGl2ZUhvdXJzID0gcmVhbDtcbiAgfSk7XG5cbiAgdmFyIGFyZWFDaGFydCA9IGMzLmdlbmVyYXRlKHtcbiAgICBiaW5kdG86ICcjYXJlYS1jaGFydCcsXG4gICAgc2l6ZToge1xuICAgICAgd2lkdGg6IDQ1MFxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgY29sdW1uczogW1xuICAgICAgICBbJ2RhdGExJywgMzAwLCAzNTAsIDMwMCwgMCwgMCwgMF0sXG4gICAgICAgIFsnZGF0YTInLCAxMzAsIDEwMCwgMTQwLCAyMDAsIDE1MCwgNTBdXG4gICAgICBdLFxuICAgIHR5cGVzOiB7XG4gICAgICBkYXRhMTogJ2FyZWEnLFxuICAgICAgZGF0YTI6ICdhcmVhLXNwbGluZSdcbiAgICB9XG4gIH1cbn0pO1xuXG59KVxuXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYXBwZm9ybScsIFsndWkucm91dGVyJ10pXG5cbi5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuYXBwZm9ybS5kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvYXBwZm9ybS86Zm9ybUlkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hcHBmb3JtL2FwcGZvcm0udHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdBcHBmb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgZm9ybTogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50LmdldEZvcm0oJHN0YXRlUGFyYW1zLmZvcm1JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5hcHBmb3JtJywge1xuICAgICAgdXJsOiAnL2FwcGZvcm1zJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hcHBmb3JtL2FwcGZvcm0tbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0FwcGZvcm1MaXN0Q29udHJvbGxlcicsXG4gICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgZm9ybXM6IGZ1bmN0aW9uKGFwcGZvcm1DbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFwcGZvcm1DbGllbnQubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ0FwcGZvcm1Db250cm9sbGVyJywgZnVuY3Rpb24oJHEsIGZvcm0pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmZvcm0gPSBmb3JtO1xufSlcblxuLmNvbnRyb2xsZXIoJ0FwcGZvcm1MaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRxLCAkc3RhdGUsIGZvcm1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5mb3JtcyA9IGZvcm1zO1xuICBzZWxmLnNlbGVjdEZvcm0gPSBmdW5jdGlvbihldmVudCwgZm9ybSkge1xuICAgIHNlbGYuc2VsZWN0ZWRGb3JtSWQgPSBmb3JtLl9pZDtcbiAgICAkc3RhdGUuZ28oJ2FwcC5hcHBmb3JtLmRldGFpbCcsIHtmb3JtSWQ6IGZvcm0uX2lkfSk7XG4gIH07XG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5hcHBmb3JtJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuYXV0aCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYXV0aCcsIFtcbiAgJ3VpLnJvdXRlcicsXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9sb2dpbi50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBoYXNTZXNzaW9uOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLnByb2ZpbGUnLCB7XG4gICAgICB1cmw6ICcvcHJvZmlsZScsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9wcm9maWxlLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUN0cmwgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSwgdXNlckNsaWVudCwgaGFzU2Vzc2lvbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5oYXNTZXNzaW9uID0gaGFzU2Vzc2lvbjtcblxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24odmFsaWQpIHtcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHVzZXJDbGllbnQuYXV0aChzZWxmLnVzZXJuYW1lLCBzZWxmLnBhc3N3b3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICBzZWxmLmxvZ2luTWVzc2FnZXMuZXJyb3IgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZi5sb2dpbk1lc3NhZ2VzID0ge3N1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZmFsc2V9O1xuXG4gIHNlbGYubG9naW4gPSBmdW5jdGlvbih2YWxpZCkge1xuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB1c2VyQ2xpZW50LmF1dGgoc2VsZi51c2VybmFtZSwgc2VsZi5wYXNzd29yZClcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKGhhc1Nlc3Npb24pIHtcbiAgICAgIHNlbGYuaGFzU2Vzc2lvbiA9IGhhc1Nlc3Npb247XG4gICAgICBpZiAoJHJvb3RTY29wZS50b1N0YXRlKSB7XG4gICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnRvU3RhdGUsICRyb290U2NvcGUudG9QYXJhbXMpO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1N0YXRlO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1BhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcicpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgc2VsZi5sb2dpbk1lc3NhZ2VzLmVycm9yID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgdXNlckNsaWVudC5jbGVhclNlc3Npb24oKVxuICAgIC50aGVuKHVzZXJDbGllbnQuaGFzU2Vzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihoYXNTZXNzaW9uKSB7XG4gICAgICBzZWxmLmhhc1Nlc3Npb24gPSBoYXNTZXNzaW9uO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnIoZXJyKTtcbiAgICB9KTtcbiAgfVxufSlcblxuLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oKSB7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5maWxlJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5maWxlJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuZmlsZScsIHtcbiAgICAgIHVybDogJy9maWxlcycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGZpbGVzOiBmdW5jdGlvbihmaWxlQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGVDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZXJNYXA6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCkudGhlbihmdW5jdGlvbih3b3JrZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gd29ya2Vycy5yZWR1Y2UoZnVuY3Rpb24obWFwLCB3b3JrZXIpIHtcbiAgICAgICAgICAgICAgbWFwW3dvcmtlci5pZF0gPSB3b3JrZXI7XG4gICAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZmlsZS9maWxlLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdGaWxlTGlzdENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgIH0sXG4gICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2ZpbGUvZW1wdHkudHBsLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmZpbGUuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2RldGFpbC86ZmlsZVVpZCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGZpbGU6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZmlsZXMpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnVpZCA9PT0gJHN0YXRlUGFyYW1zLmZpbGVVaWQ7XG4gICAgICAgICAgfSlbMF07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZmlsZS9maWxlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0ZpbGVDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmZpbGU6c2VsZWN0ZWQnLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAuZmlsZS5kZXRhaWwnLCB7XG4gICAgICBmaWxlVWlkOiBmaWxlLnVpZH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignRmlsZUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgZmlsZXMsIHdvcmtlck1hcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbiAgc2VsZi5maWxlcyA9IGZpbGVzO1xuICBzZWxmLndvcmtlck1hcCA9IHdvcmtlck1hcDtcbn0pXG5cbi5jb250cm9sbGVyKCdGaWxlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGZpbGUsIHdvcmtlck1hcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBmaWxlLmlkfTtcbiAgc2VsZi5maWxlID0gZmlsZTtcbiAgc2VsZi53b3JrZXJNYXAgPSB3b3JrZXJNYXA7XG59KVxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5ncm91cCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuZ3JvdXAnLCBbXG4gICd1aS5yb3V0ZXInXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5ncm91cCcsIHtcbiAgICAgIHVybDogJy9ncm91cHMnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lbWJlcnNoaXA6IGZ1bmN0aW9uKG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZ3JvdXAtbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2dyb3VwTGlzdENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZW1wdHkudHBsLmh0bWwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5ncm91cC5kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvZ3JvdXAvOmdyb3VwSWQnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBncm91cDogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBncm91cHMpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBzWyRzdGF0ZVBhcmFtcy5ncm91cElkXTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9ncm91cC1kZXRhaWwudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdncm91cERldGFpbENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAuZ3JvdXAuZWRpdCcsIHtcbiAgICAgIHVybDogJy9ncm91cC86Z3JvdXBJZC9lZGl0JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgZ3JvdXA6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZ3JvdXBzKSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3Vwc1skc3RhdGVQYXJhbXMuZ3JvdXBJZF07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZ3JvdXAtZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2dyb3VwRm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmdyb3VwLm5ldycsIHtcbiAgICAgIHVybDogJy9uZXcnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBncm91cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvZ3JvdXAvZ3JvdXAtZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ2dyb3VwRm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTpncm91cDpzZWxlY3RlZCcsIGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAuZ3JvdXAuZGV0YWlsJywge1xuICAgICAgZ3JvdXBJZDogZ3JvdXAuaWRcbiAgICB9KTtcbiAgfSk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmdyb3VwOmxpc3QnLCBmdW5jdGlvbihncm91cCkge1xuICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdncm91cExpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVkaWF0b3IsIGdyb3Vwcykge1xuICB0aGlzLmdyb3VwcyA9IGdyb3VwcztcbiAgJHNjb3BlLiRwYXJlbnQuc2VsZWN0ZWQgPSB7aWQ6IG51bGx9O1xufSlcblxuLmNvbnRyb2xsZXIoJ2dyb3VwRGV0YWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJG1kRGlhbG9nLCBtZWRpYXRvciwgZ3JvdXAsIHVzZXJzLCBtZW1iZXJzaGlwLCBncm91cENsaWVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuZ3JvdXAgPSBncm91cDtcbiAgJHNjb3BlLnNlbGVjdGVkLmlkID0gZ3JvdXAuaWQ7XG4gIHZhciBncm91cE1lbWJlcnNoaXAgPSBtZW1iZXJzaGlwLmZpbHRlcihmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgIHJldHVybiBfbWVtYmVyc2hpcC5ncm91cCA9PSBncm91cC5pZFxuICB9KTtcbiAgc2VsZi5tZW1iZXJzID0gdXNlcnMuZmlsdGVyKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICByZXR1cm4gXy5zb21lKGdyb3VwTWVtYmVyc2hpcCwgZnVuY3Rpb24oX21lbWJlcnNoaXApIHtcbiAgICAgIHJldHVybiBfbWVtYmVyc2hpcC51c2VyID09IHVzZXIuaWQ7XG4gICAgfSlcbiAgfSk7XG4gIHNlbGYuZGVsZXRlID0gZnVuY3Rpb24oJGV2ZW50LCBncm91cCkge1xuICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIGdyb3VwICMnK2dyb3VwLmlkKyc/JylcbiAgICAgICAgICAudGV4dENvbnRlbnQoZ3JvdXAubmFtZSlcbiAgICAgICAgICAuYXJpYUxhYmVsKCdEZWxldGUgR3JvdXAnKVxuICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgZ3JvdXBDbGllbnQuZGVsZXRlKGdyb3VwKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cCcsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KVxuICAgIH0pO1xuICB9O1xufSlcblxuLmNvbnRyb2xsZXIoJ2dyb3VwRm9ybUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHN0YXRlLCAkc2NvcGUsIG1lZGlhdG9yLCBncm91cCwgZ3JvdXBDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmdyb3VwID0gZ3JvdXA7XG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06Z3JvdXA6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICByZXR1cm4gZ3JvdXBDbGllbnQudXBkYXRlKGdyb3VwKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cC5kZXRhaWwnLCB7Z3JvdXBJZDogc2VsZi5ncm91cC5pZH0sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTpncm91cDpjcmVhdGVkJywgJHNjb3BlLCBmdW5jdGlvbihncm91cCkge1xuICAgIHJldHVybiBncm91cENsaWVudC5jcmVhdGUoZ3JvdXApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNyZWF0ZWRncm91cCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwLmRldGFpbCcsIHtncm91cElkOiBjcmVhdGVkZ3JvdXAuaWR9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG59KVxuXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdhcHAuaG9tZScsIFsndWkucm91dGVyJ10pXG5cbi5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcbiAgICAgIHVybDogJy9ob21lJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ob21lL2hvbWUudHBsLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5ob21lJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnJlcXVpcmUoJ2ZlZWRoZW5yeScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICByZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpXG4sIHJlcXVpcmUoJ2FuZ3VsYXItbWF0ZXJpYWwnKVxuLCByZXF1aXJlKCdmaC13Zm0tbWVkaWF0b3InKVxuLCByZXF1aXJlKCdmaC13Zm0td29ya29yZGVyJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXJlc3VsdCcpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1tZXNzYWdlJylcbiwgcmVxdWlyZSgnZmgtd2ZtLWZpbGUnKVxuLCByZXF1aXJlKCdmaC13Zm0td29ya2Zsb3cnKVxuLCByZXF1aXJlKCdmaC13Zm0tYXBwZm9ybScpXG4sIHJlcXVpcmUoJ2ZoLXdmbS11c2VyJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXJpc2stYXNzZXNzbWVudCcpXG4sIHJlcXVpcmUoJ2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24nKVxuLCByZXF1aXJlKCdmaC13Zm0tbWFwJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXNjaGVkdWxlJylcbiwgcmVxdWlyZSgnZmgtd2ZtLWFuYWx5dGljcycpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1jYW1lcmEnKVxuXG4sIHJlcXVpcmUoJy4vYXV0aC9hdXRoJylcbiwgcmVxdWlyZSgnLi93b3Jrb3JkZXIvd29ya29yZGVyJylcbiwgcmVxdWlyZSgnLi93b3JrZmxvdy93b3JrZmxvdycpXG4sIHJlcXVpcmUoJy4vaG9tZS9ob21lJylcbiwgcmVxdWlyZSgnLi9hcHBmb3JtL2FwcGZvcm0nKVxuLCByZXF1aXJlKCcuL3dvcmtlci93b3JrZXInKVxuLCByZXF1aXJlKCcuL2dyb3VwL2dyb3VwJylcbiwgcmVxdWlyZSgnLi9tZXNzYWdlL21lc3NhZ2UnKVxuLCByZXF1aXJlKCcuL2ZpbGUvZmlsZScpXG4sIHJlcXVpcmUoJy4vc2NoZWR1bGUvc2NoZWR1bGUnKVxuLCByZXF1aXJlKCcuL21hcC9tYXAnKVxuLCByZXF1aXJlKCcuL2FuYWx5dGljcy9hbmFseXRpY3MnKVxuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93b3Jrb3JkZXJzL2xpc3QnKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tYWluLnRwbC5odG1sJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY29sdW1uczogM1xuICAgICAgfSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya29yZGVyTWFuYWdlcjogZnVuY3Rpb24od29ya29yZGVyU3luYykge1xuICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgd29ya2Zsb3dNYW5hZ2VyOiBmdW5jdGlvbih3b3JrZmxvd1N5bmMpIHtcbiAgICAgICAgICByZXR1cm4gd29ya2Zsb3dTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZU1hbmFnZXI6IGZ1bmN0aW9uKG1lc3NhZ2VTeW5jKSB7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VTeW5jLmNyZWF0ZU1hbmFnZXIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJvZmlsZURhdGE6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5nZXRQcm9maWxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJG1kU2lkZW5hdiwgbWVkaWF0b3IsIHByb2ZpbGVEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb2ZpbGVEYXRhJywgcHJvZmlsZURhdGEpO1xuICAgICAgICAkc2NvcGUucHJvZmlsZURhdGEgPSBwcm9maWxlRGF0YTtcbiAgICAgICAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXV0aDpwcm9maWxlOmNoYW5nZScsIGZ1bmN0aW9uKF9wcm9maWxlRGF0YSkge1xuICAgICAgICAgICRzY29wZS5wcm9maWxlRGF0YSA9IF9wcm9maWxlRGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlbmF2ID0gZnVuY3Rpb24oZXZlbnQsIG1lbnVJZCkge1xuICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLm5hdmlnYXRlVG8gPSBmdW5jdGlvbihzdGF0ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoJG1kU2lkZW5hdignbGVmdCcpLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgICRtZFNpZGVuYXYoJ2xlZnQnKS5jbG9zZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzdGF0ZS5nbyhzdGF0ZSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkcSwgbWVkaWF0b3IsIHVzZXJDbGllbnQpIHtcbiAgdmFyIGluaXRQcm9taXNlcyA9IFtdO1xuICB2YXIgaW5pdExpc3RlbmVyID0gbWVkaWF0b3Iuc3Vic2NyaWJlKCdwcm9taXNlOmluaXQnLCBmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgaW5pdFByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gIH0pO1xuICBtZWRpYXRvci5wdWJsaXNoKCdpbml0Jyk7XG4gIGNvbnNvbGUubG9nKGluaXRQcm9taXNlcy5sZW5ndGgsICdpbml0IHByb21pc2VzIHRvIHJlc29sdmUuJyk7XG4gIHZhciBhbGwgPSAoaW5pdFByb21pc2VzLmxlbmd0aCA+IDApID8gJHEuYWxsKGluaXRQcm9taXNlcykgOiAkcS53aGVuKG51bGwpO1xuICBhbGwudGhlbihmdW5jdGlvbigpIHtcbiAgICAkcm9vdFNjb3BlLnJlYWR5ID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhpbml0UHJvbWlzZXMubGVuZ3RoLCAnaW5pdCBwcm9taXNlcyByZXNvbHZlZC4nKTtcbiAgICBtZWRpYXRvci5yZW1vdmUoJ3Byb21pc2U6aW5pdCcsIGluaXRMaXN0ZW5lci5pZCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGUsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICBpZih0b1N0YXRlLm5hbWUgIT09IFwiYXBwLmxvZ2luXCIpe1xuICAgICAgdXNlckNsaWVudC5oYXNTZXNzaW9uKCkudGhlbihmdW5jdGlvbihoYXNTZXNzaW9uKSB7XG4gICAgICAgIGlmKCFoYXNTZXNzaW9uKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRyb290U2NvcGUudG9TdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgJHJvb3RTY29wZS50b1BhcmFtcyA9IHRvUGFyYW1zO1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdGF0ZSBjaGFuZ2UgZXJyb3I6ICcsIGVycm9yLCB7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICB0b1N0YXRlOiB0b1N0YXRlLFxuICAgICAgdG9QYXJhbXM6IHRvUGFyYW1zLFxuICAgICAgZnJvbVN0YXRlOiBmcm9tU3RhdGUsXG4gICAgICBmcm9tUGFyYW1zOiBmcm9tUGFyYW1zLFxuICAgICAgZXJyb3I6IGVycm9yXG4gICAgfSk7XG4gICAgaWYgKGVycm9yWydnZXQgc3RhY2snXSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvclsnZ2V0IHN0YWNrJ10oKSk7XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLm1hcCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAubWFwJywgW1xuICAndWkucm91dGVyJyxcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcbiAgICAgIHVybDogJy9tYXAnLFxuICAgICAgZGF0YToge1xuICAgICAgICBjb2x1bW5zOiAyXG4gICAgICB9LFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21hcC9tYXAudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdtYXBDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0pXG59KVxuXG4uY29udHJvbGxlcignbWFwQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCB3b3Jrb3JkZXJzKSB7XG4gIHRoaXMuY2VudGVyID0gWzQ5LjI3LCAtMTIzLjA4XTtcbiAgdGhpcy53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbn0pXG5cbjtcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnYW5ndWxhci1tZXNzYWdlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAubWVzc2FnZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAubWVzc2FnZScsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgICAuc3RhdGUoJ2FwcC5tZXNzYWdlJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2VzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tZXNzYWdlL21lc3NhZ2UtbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ01lc3NhZ2VMaXN0Q29udHJvbGxlciBhcyBtZXNzYWdlTGlzdENvbnRyb2xsZXInLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBmdW5jdGlvbihtZXNzYWdlTWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZU1hbmFnZXIubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2UvOm1lc3NhZ2VJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgbWVzc2FnZU1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLm1lc3NhZ2VJZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLW5ldy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VOZXdDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2VNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5uZXcoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTptZXNzYWdlOnNlbGVjdGVkJywgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICRzdGF0ZS5nbygnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlLmlkIHx8IG1lc3NhZ2UuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignTWVzc2FnZUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVzc2FnZXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG4gIHNlbGYubWVzc2FnZXMgPSBtZXNzYWdlcztcbn0pXG5cbi5jb250cm9sbGVyKCdtZXNzYWdlRGV0YWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lc3NhZ2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICBtZXNzYWdlLnN0YXR1cyA9IFwicmVhZFwiO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSBtZXNzYWdlLmlkO1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uIChtZWRpYXRvcikge1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VOZXdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgbWVzc2FnZU1hbmFnZXIsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOm1lc3NhZ2U6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIG1lc3NhZ2Uuc2VuZGVyID0gJHNjb3BlLnByb2ZpbGVEYXRhO1xuICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5jcmVhdGUobWVzc2FnZSkudGhlbihmdW5jdGlvbihfbWVzc2FnZSkge1xuICAgICAgJHN0YXRlLmdvKCdhcHAubWVzc2FnZScsIHt3b3JrZXJzOiB3b3JrZXJzfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgIH0pXG4gIH0pO1xufSlcbjtcbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5tZXNzYWdlJztcbiIsIi8qKlxuKiBDT05GSURFTlRJQUxcbiogQ29weXJpZ2h0IDIwMTYgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXMuXG4qIFRoaXMgaXMgdW5wdWJsaXNoZWQgcHJvcHJpZXRhcnkgc291cmNlIGNvZGUgb2YgUmVkIEhhdC5cbioqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuc2NoZWR1bGUnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnNjaGVkdWxlJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuc2NoZWR1bGUnLCB7XG4gICAgICB1cmw6ICcvc2NoZWR1bGUnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICBjb2x1bW5zOiAyXG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NjaGVkdWxlL3NjaGVkdWxlLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnc2NoZWR1bGVDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ3NjaGVkdWxlQ29udHJvbGxlcicsIGZ1bmN0aW9uIChtZWRpYXRvciwgd29ya29yZGVyTWFuYWdlciwgd29ya29yZGVycywgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya29yZGVycyA9IHdvcmtvcmRlcnM7XG4gIHNlbGYud29ya2VycyA9IHdvcmtlcnM7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOnNjaGVkdWxlOndvcmtvcmRlcicsIGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgIHdvcmtvcmRlck1hbmFnZXIudXBkYXRlKHdvcmtvcmRlcikudGhlbihmdW5jdGlvbih1cGRhdGVkV29ya29yZGVyKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTpzY2hlZHVsZTp3b3Jrb3JkZXI6JyArIHdvcmtvcmRlci5pZCwgdXBkYXRlZFdvcmtvcmRlcik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9KVxufSlcblxuO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3JrZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLndvcmtlcicsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLndvcmtlcicsIHtcbiAgICAgIHVybDogJy93b3JrZXJzJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZXJMaXN0Q29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2VyL2VtcHR5LnRwbC5odG1sJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya2VyLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3JrZXIvOndvcmtlcklkJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5yZWFkKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgd29ya29yZGVyTWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHdvcmtvcmRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJzLmZpbHRlcihmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh3b3Jrb3JkZXIuYXNzaWduZWUpID09PSBTdHJpbmcoJHN0YXRlUGFyYW1zLndvcmtlcklkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBtZXNzYWdlTWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5saXN0KCkudGhlbihmdW5jdGlvbihtZXNzYWdlcyl7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZXMuZmlsdGVyKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG1lc3NhZ2UucmVjZWl2ZXJJZCkgPT09IFN0cmluZygkc3RhdGVQYXJhbXMud29ya2VySWQpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZmlsZUNsaWVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlQ2xpZW50Lmxpc3QoKS50aGVuKGZ1bmN0aW9uKGZpbGVzKXtcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZmlsZS5vd25lcikgPT09IFN0cmluZygkc3RhdGVQYXJhbXMud29ya2VySWQpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzaGlwOiBmdW5jdGlvbihtZW1iZXJzaGlwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckRldGFpbENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya2VyLmVkaXQnLCB7XG4gICAgICB1cmw6ICcvd29ya2VyLzp3b3JrZXJJZC9lZGl0JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHVzZXJDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5yZWFkKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VwczogZnVuY3Rpb24oZ3JvdXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzaGlwOiBmdW5jdGlvbihtZW1iZXJzaGlwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtlci93b3JrZXItZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZXIubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBncm91cHM6IGZ1bmN0aW9uKGdyb3VwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3VwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVtYmVyc2hpcDogZnVuY3Rpb24obWVtYmVyc2hpcENsaWVudCkge1xuICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvd29ya2VyLWVkaXQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZXJGb3JtQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7XG4gICAgICB3b3JrZXJJZDogd29ya2VyLmlkXG4gICAgfSk7XG4gIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3JrZXI6bGlzdCcsIGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtlcicsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya2VyTGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBtZWRpYXRvciwgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya2VycyA9IHdvcmtlcnM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZXJEZXRhaWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtlciwgd29ya29yZGVycywgbWVzc2FnZXMsIGZpbGVzLCBtZW1iZXJzaGlwLCBncm91cHMsIHVzZXJDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlciA9IHdvcmtlcjtcbiAgc2VsZi53b3Jrb3JkZXJzID0gd29ya29yZGVycztcbiAgc2VsZi5tZXNzYWdlcyA9ICBtZXNzYWdlcztcbiAgc2VsZi5maWxlcyA9IGZpbGVzO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSB3b3JrZXIuaWQ7XG5cbiAgdmFyIHVzZXJNZW1iZXJzaGlwID0gbWVtYmVyc2hpcC5maWx0ZXIoZnVuY3Rpb24oX21lbWJlcnNoaXApIHtcbiAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB3b3JrZXIuaWRcbiAgfSlbMF07XG4gIHNlbGYuZ3JvdXAgPSBncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICByZXR1cm4gdXNlck1lbWJlcnNoaXAuZ3JvdXAgPT0gZ3JvdXAuaWQ7XG4gIH0pWzBdO1xuXG4gIHNlbGYuZGVsZXRlID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtlcikge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXG4gICAgICAgICAgLnRpdGxlKCdXb3VsZCB5b3UgbGlrZSB0byBkZWxldGUgd29ya2VyICMnK3dvcmtlci5pZCsnPycpXG4gICAgICAgICAgLnRleHRDb250ZW50KHdvcmtlci5uYW1lKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ0RlbGV0ZSBXb3JrZXInKVxuICAgICAgICAgIC50YXJnZXRFdmVudChldmVudClcbiAgICAgICAgICAub2soJ1Byb2NlZWQnKVxuICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbCcpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICB1c2VyQ2xpZW50LmRlbGV0ZSh3b3JrZXIpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2VyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH0sXG4gIHNlbGYuc2VsZWN0V29ya29yZGVyID0gZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgJHN0YXRlLmdvKFxuICAgICAgJ2FwcC53b3Jrb3JkZXIuZGV0YWlsJyxcbiAgICAgIHsgd29ya29yZGVySWQ6IHdvcmtvcmRlci5pZCB8fCB3b3Jrb3JkZXIuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSxcbiAgc2VsZi5zZWxlY3RNZXNzYWdlID0gIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAkc3RhdGUuZ28oJ2FwcC5tZXNzYWdlLmRldGFpbCcsIHtcbiAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZS5pZCB8fCBtZXNzYWdlLl9sb2NhbHVpZCB9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gIH1cblxufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtlckZvcm1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzdGF0ZSwgJHNjb3BlLCBtZWRpYXRvciwgd29ya2VyLCBncm91cHMsIG1lbWJlcnNoaXAsIHVzZXJDbGllbnQsIG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlciA9IHdvcmtlcjtcbiAgc2VsZi5ncm91cHMgPSBncm91cHM7XG4gIC8vaWYgd2UgYXJlIHVwZGF0aW5nIGxldCdzIGFzc2lnbiB0aGUgZ3JvdXBcbiAgaWYod29ya2VyLmlkIHx8IHdvcmtlci5pZCA9PT0gMCkge1xuICAgIHZhciB1c2VyTWVtYmVyc2hpcCA9IG1lbWJlcnNoaXAuZmlsdGVyKGZ1bmN0aW9uKF9tZW1iZXJzaGlwKSB7XG4gICAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB3b3JrZXIuaWRcbiAgICB9KVswXTtcbiAgICBzZWxmLndvcmtlci5ncm91cCA9IGdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIHVzZXJNZW1iZXJzaGlwLmdyb3VwID09IGdyb3VwLmlkO1xuICAgIH0pWzBdLmlkO1xuICB9XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3JrZXI6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2VyKSB7XG4gICAgcmV0dXJuIHVzZXJDbGllbnQudXBkYXRlKHdvcmtlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXBkYXRlZFdvcmtlcikge1xuICAgICAgICAgIC8vcmV0cmlldmUgdGhlIGV4aXN0aW5nIG1lbWJlcnNoaXBcbiAgICAgICAgICB2YXIgdXNlck1lbWJlcnNoaXAgPSBtZW1iZXJzaGlwLmZpbHRlcihmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgICAgICAgICAgcmV0dXJuIF9tZW1iZXJzaGlwLnVzZXIgPT0gd29ya2VyLmlkXG4gICAgICAgICAgfSlbMF07XG4gICAgICAgICAgdXNlck1lbWJlcnNoaXAuZ3JvdXAgPSB1cGRhdGVkV29ya2VyLmdyb3VwO1xuICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50LnVwZGF0ZSh1c2VyTWVtYmVyc2hpcClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNZW1iZXJzaGlwKSB7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7d29ya2VySWQ6IHVwZGF0ZWRNZW1iZXJzaGlwLnVzZXJ9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3JrZXI6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2VyKSB7XG4gICAgcmV0dXJuIHVzZXJDbGllbnQuY3JlYXRlKHdvcmtlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oY3JlYXRlZFdvcmtlcikge1xuICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50LmNyZWF0ZSh7XG4gICAgICAgICAgICBncm91cCA6IGNyZWF0ZWRXb3JrZXIuZ3JvdXAsXG4gICAgICAgICAgICB1c2VyOiBjcmVhdGVkV29ya2VyLmlkXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoY3JlYXRlZE1lbWJlcnNoaXApIHtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2VyLmRldGFpbCcsIHt3b3JrZXJJZDogY3JlYXRlZE1lbWJlcnNoaXAudXNlcn0sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSk7XG59KVxuXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnYW5ndWxhci1tZXNzYWdlcycpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLndvcmtmbG93JywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG4sICduZ01lc3NhZ2VzJ1xuLCByZXF1aXJlKCduZy1zb3J0YWJsZScpXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAud29ya2Zsb3cnLCB7XG4gICAgICB1cmw6ICcvd29ya2Zsb3dzL2xpc3QnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29sdW1uMjoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZmxvd0xpc3RDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93czogZnVuY3Rpb24od29ya2Zsb3dNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvZW1wdHkudHBsLmh0bWwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdy5kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvd29ya2Zsb3cvOndvcmtmbG93SWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93RGV0YWlsQ29udHJvbGxlciBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB3b3JrZmxvdzogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCB3b3JrZmxvd01hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5yZWFkKCRzdGF0ZVBhcmFtcy53b3JrZmxvd0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmFkZCcsIHtcbiAgICAgIHVybDogJy93b3JrZmxvd3MvJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZmxvdy93b3JrZmxvdy1hZGQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZmxvd0FkZENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLm5ldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmVkaXQnLCB7XG4gICAgICB1cmw6ICcvd29ya2Zsb3cvOndvcmtmbG93SWQvZWRpdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93Rm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgd29ya2Zsb3dNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya2Zsb3dJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdy5zdGVwJywge1xuICAgICAgdXJsOiAnL3dvcmtmbG93Lzp3b3JrZmxvd0lkL3N0ZXBzLzpjb2RlL2VkaXQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LXN0ZXAtZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93U3RlcEZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93OiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtmbG93SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSlcblxuLnJ1bihmdW5jdGlvbigkc3RhdGUsIG1lZGlhdG9yKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZmxvdy5kZXRhaWwnLCB7XG4gICAgICB3b3JrZmxvd0lkOiB3b3JrZmxvdy5pZCB8fCB3b3JrZmxvdy5fbG9jYWx1aWQgfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06d29ya2Zsb3c6bGlzdCcsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cnLCBudWxsLCB7cmVsb2FkOiB0cnVlfSk7XG4gIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtmbG93TGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBtZWRpYXRvciwgd29ya2Zsb3dzLCAkc3RhdGVQYXJhbXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cztcbiAgc2VsZi5zZWxlY3RlZFdvcmtmbG93SWQgPSAkc3RhdGVQYXJhbXMud29ya2Zsb3dJZDtcbiAgJHNjb3BlLiRwYXJlbnQuc2VsZWN0ZWQgPSB7aWQ6IG51bGx9O1xuICBzZWxmLnNlbGVjdFdvcmtmbG93ID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtmbG93KSB7XG4gICAgc2VsZi5zZWxlY3RlZFdvcmtmbG93SWQgPSB3b3JrZmxvdy5pZDtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c2VsZWN0ZWQnLCB3b3JrZmxvdyk7XG4gIH07XG59KVxuXG4uY29udHJvbGxlcignV29ya2Zsb3dEZXRhaWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkbWREaWFsb2csIG1lZGlhdG9yLCB3b3JrZmxvd01hbmFnZXIsIHdvcmtmbG93KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJHNjb3BlLnNlbGVjdGVkLmlkID0gd29ya2Zsb3cuaWQ7XG4gICRzY29wZS5kcmFnQ29udHJvbExpc3RlbmVycyA9IHtcbiAgICBjb250YWlubWVudDogJyNzdGVwTGlzdCdcbiAgfVxuICBzZWxmLndvcmtmbG93ID0gd29ya2Zsb3c7XG5cbiAgc2VsZi5kZWxldGUgPSBmdW5jdGlvbihldmVudCwgd29ya2Zsb3cpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIHdvcmtmbG93ICMnK3dvcmtmbG93LmlkKyc/JylcbiAgICAgICAgICAudGV4dENvbnRlbnQod29ya2Zsb3cudGl0bGUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIHdvcmtmbG93JylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5kZWxldGUod29ya2Zsb3cpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cnLCBudWxsLCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSlcbiAgICB9KTtcbiAgfTtcblxuICBzZWxmLmRlbGV0ZVN0ZXAgPSBmdW5jdGlvbihldmVudCwgc3RlcCwgd29ya2Zsb3cpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIHN0ZXAgOiAnKyBzdGVwLm5hbWUgKycgPycpXG4gICAgICAgICAgLnRleHRDb250ZW50KHN0ZXAubmFtZSlcbiAgICAgICAgICAuYXJpYUxhYmVsKCdEZWxldGUgc3RlcCcpXG4gICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxuICAgICAgICAgIC5vaygnUHJvY2VlZCcpXG4gICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsJyk7XG4gICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHdvcmtmbG93LnN0ZXBzID0gd29ya2Zsb3cuc3RlcHMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uY29kZSAhPT0gc3RlcC5jb2RlO1xuICAgICAgfSk7XG4gICAgICB3b3JrZmxvd01hbmFnZXIudXBkYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZmxvdy5kZXRhaWwnLFxuICAgICAgICAge3dvcmtmbG93SWQ6IF93b3JrZmxvdy5pZH0sXG4gICAgICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgICAgKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH07XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93LmRldGFpbCcsIHtcbiAgICAgICAgd29ya2Zsb3dJZDogX3dvcmtmbG93LmlkXG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtmbG93QWRkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lZGlhdG9yLCB3b3JrZmxvd01hbmFnZXIsIHdvcmtmbG93ICkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvdztcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtmbG93OmNyZWF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgd29ya2Zsb3dNYW5hZ2VyLmNyZWF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIF93b3JrZmxvdyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KVxuXG4uY29udHJvbGxlcignV29ya2Zsb3dGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgbWVkaWF0b3IsIHdvcmtmbG93LCB3b3JrZmxvd01hbmFnZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvdztcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtmbG93OnVwZGF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93LmRldGFpbCcsXG4gICAgICB7d29ya2Zsb3dJZDogX3dvcmtmbG93LmlkfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya2Zsb3dTdGVwRm9ybUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgbWVkaWF0b3IsIHdvcmtmbG93LCB3b3JrZmxvd01hbmFnZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvdztcbiAgc2VsZi5zdGVwID0gd29ya2Zsb3cuc3RlcHMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5jb2RlID09ICRzdGF0ZVBhcmFtcy5jb2RlO1xuICB9KVswXTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3JrZmxvdzp1cGRhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3JrZmxvdykge1xuICAgIHdvcmtmbG93TWFuYWdlci51cGRhdGUod29ya2Zsb3cpLnRoZW4oZnVuY3Rpb24oX3dvcmtmbG93KSB7XG4gICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZmxvdy5kZXRhaWwnLFxuICAgICAge3dvcmtmbG93SWQ6IF93b3JrZmxvdy5pZH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gIH0pO1xufSlcblxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAud29ya2Zsb3cnO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAud29ya29yZGVyJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG4sICduZ01lc3NhZ2VzJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcicsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXJzL2xpc3QnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZmxvd3M6IGZ1bmN0aW9uKHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHRNYW5hZ2VyOiBmdW5jdGlvbihyZXN1bHRTeW5jKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFN5bmMubWFuYWdlclByb21pc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdE1hcDogZnVuY3Rpb24ocmVzdWx0TWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiByZXN1bHRNYW5hZ2VyLmxpc3QoKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgbWFwW3Jlc3VsdC53b3Jrb3JkZXJJZF0gPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3Jrb3JkZXJMaXN0Q29udHJvbGxlciBhcyB3b3Jrb3JkZXJMaXN0Q29udHJvbGxlcicsXG4gICAgICAgIH0sXG4gICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlci5uZXcnLCB7XG4gICAgICB1cmw6ICcvbmV3JyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLW5ldy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlck5ld0NvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya29yZGVyOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLm5ldygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdvcmtlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya29yZGVyLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXIvOndvcmtvcmRlcklkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlckRldGFpbENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya29yZGVyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGFwcGZvcm1DbGllbnQsIHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya29yZGVySWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0OiBmdW5jdGlvbih3b3Jrb3JkZXIsIHJlc3VsdE1hcCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0TWFwW3dvcmtvcmRlci5pZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXIuZWRpdCcsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXIvOndvcmtvcmRlcklkL2VkaXQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci93b3Jrb3JkZXItZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlckZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtvcmRlcjogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCB3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtvcmRlcklkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uKHdvcmtvcmRlciwgcmVzdWx0TWFwKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRNYXBbd29ya29yZGVyLmlkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAkc3RhdGUuZ28oXG4gICAgICAnYXBwLndvcmtvcmRlci5kZXRhaWwnLFxuICAgICAgeyB3b3Jrb3JkZXJJZDogd29ya29yZGVyLmlkIHx8IHdvcmtvcmRlci5fbG9jYWx1aWQgfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06d29ya29yZGVyOmxpc3QnLCBmdW5jdGlvbih3b3JrZmxvdykge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcicsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya29yZGVyTGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB3b3Jrb3JkZXJzLCByZXN1bHRNYXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtvcmRlcnMgPSB3b3Jrb3JkZXJzO1xuICBzZWxmLnJlc3VsdE1hcCA9IHJlc3VsdE1hcDtcbiAgJHNjb3BlLiRwYXJlbnQuc2VsZWN0ZWQgPSB7aWQ6IG51bGx9O1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtvcmRlckRldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtmbG93TWFuYWdlciwgd29ya2Zsb3dzLCB3b3Jrb3JkZXIsIHJlc3VsdCwgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS5zZWxlY3RlZC5pZCA9IHdvcmtvcmRlci5pZDtcblxuICBzZWxmLndvcmtvcmRlciA9IHdvcmtvcmRlcjtcbiAgdmFyIHdvcmtmbG93ID0gd29ya2Zsb3dzLmZpbHRlcihmdW5jdGlvbih3b3JrZmxvdykge1xuICAgIHJldHVybiBTdHJpbmcod29ya2Zsb3cuaWQpID09PSBTdHJpbmcod29ya29yZGVyLndvcmtmbG93SWQpO1xuICB9KTtcbiAgaWYgKHdvcmtmbG93Lmxlbmd0aCkge1xuICAgIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvd1swXTtcbiAgfVxuICBzZWxmLnJlc3VsdCA9IHJlc3VsdDtcbiAgdmFyIGFzc2lnbmVlID0gd29ya2Vycy5maWx0ZXIoZnVuY3Rpb24od29ya2VyKSB7XG4gICAgcmV0dXJuIFN0cmluZyh3b3JrZXIuaWQpID09PSBTdHJpbmcod29ya29yZGVyLmFzc2lnbmVlKTtcbiAgfSlcbiAgaWYgKGFzc2lnbmVlLmxlbmd0aCkge1xuICAgIHNlbGYuYXNzaWduZWUgPSBhc3NpZ25lZVswXTtcbiAgfVxuXG4gIHZhciBuZXh0U3RlcEluZGV4ID0gd29ya2Zsb3dNYW5hZ2VyLm5leHRTdGVwSW5kZXgoc2VsZi53b3JrZmxvdy5zdGVwcywgc2VsZi5yZXN1bHQpO1xuICB2YXIgbnVtU3RlcHMgPSBzZWxmLndvcmtmbG93LnN0ZXBzLmxlbmd0aDtcbiAgc2VsZi5wcm9ncmVzcyA9ICgxMDAgKiAobmV4dFN0ZXBJbmRleCArIDEpIC8gbnVtU3RlcHMpLnRvUHJlY2lzaW9uKDMpO1xuICBjb25zb2xlLmxvZyhuZXh0U3RlcEluZGV4LCBudW1TdGVwcywgc2VsZi5wcm9ncmVzcyk7XG5cbiAgc2VsZi5iZWdpbldvcmtmbG93ID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpiZWdpbicsIHdvcmtvcmRlci5pZCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICBzZWxmLmRlbGV0ZSA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIHdvcmtvcmRlciAjJyt3b3Jrb3JkZXIuaWQrJz8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudCh3b3Jrb3JkZXIudGl0bGUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIFdvcmtvcmRlcicpXG4gICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxuICAgICAgICAgIC5vaygnUHJvY2VlZCcpXG4gICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsJyk7XG4gICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLmRlbGV0ZSh3b3Jrb3JkZXIpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cbn0pXG5cbi5jb250cm9sbGVyKCdXb3Jrb3JkZXJOZXdDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCB3b3Jrb3JkZXIsIHdvcmtmbG93cywgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya29yZGVyID0gd29ya29yZGVyO1xuICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtvcmRlcjpjcmVhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICB3b3Jrb3JkZXJNYW5hZ2VyLmNyZWF0ZSh3b3Jrb3JkZXIpLnRoZW4oZnVuY3Rpb24oX3dvcmtvcmRlcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIF93b3Jrb3JkZXIpO1xuICAgIH0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3Jrb3JkZXJGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtvcmRlciwgd29ya2Zsb3dzLCB3b3JrZXJzLCByZXN1bHQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya29yZGVyID0gd29ya29yZGVyO1xuICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcbiAgc2VsZi5yZXN1bHQgPSByZXN1bHQ7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3Jrb3JkZXI6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIudXBkYXRlKHdvcmtvcmRlcikudGhlbihmdW5jdGlvbihfd29ya29yZGVyKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOnNlbGVjdGVkJywgX3dvcmtvcmRlcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3Jrb3JkZXInO1xuIl19
