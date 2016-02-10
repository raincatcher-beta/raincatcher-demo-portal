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
  function initMap() {
    var myOptions = {
      zoom:11,
      center:new google.maps.LatLng(49.2075439,-123.1108627),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
    workorders.forEach(function(workorder) {
      var x = 49.2075439 + (Math.random() - 0.5) * 0.1;
      var y =-123.1108627 + (Math.random() - 0.5) * 0.1;
      var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(x, y)});
      var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #'+workorder.id+'</strong><br>Vancouver, BC<br>'});
      google.maps.event.addListener(marker, 'click', function(){
        infowindow.open(map,marker);
      });
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
