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
      views: {
        content: {
          templateUrl: 'app/map/map.tpl.html',
          controller: 'mapController as ctrl'
        }
      }

    })
})

.controller('mapController', function (mediator) {
  function init_map() {
    var myOptions = {
      zoom:11,
      center:new google.maps.LatLng(49.2075439,-123.1108627),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
    var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(49.2075439,-123.1108627)});
    var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #1234567</strong><br>Vancouver, BC<br>'});
    google.maps.event.addListener(marker, 'click', function(){
      infowindow.open(map,marker);
    });
    infowindow.open(map,marker);
  }
  init_map();
})

;
