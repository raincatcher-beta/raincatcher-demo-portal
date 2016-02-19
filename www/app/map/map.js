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
  var lat0 = 49.27, long0 = -123.08;
  function initMap() {
    var myOptions = {
      zoom:14,
      center:new google.maps.LatLng(lat0, long0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
    workorders.forEach(function(workorder) {
      console.log(workorder);
      if (workorder.location) {
        // var lat = lat0 + (Math.random() - 0.5) * 0.05;
        // var long = long0 + (Math.random() - 0.5) * 0.2;
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

  function resizeMap() {
    var map = $document[0].getElementById('gmap_canvas');
    var parent = map.parentElement.parentElement;
    var height = parent.clientHeight;
    var width = parent.clientWidth;
    map.style.height = height + 'px';
    map.style.width = width + 'px';

    console.log('Map dimensions:', width, height);
    google.maps.event.trigger(map, 'resize');
  };

  $window.onresize = function() { // TODO: throttle this
    resizeMap();
  }

  initMap();
  $timeout(function() {
    resizeMap()
  });
})

;
