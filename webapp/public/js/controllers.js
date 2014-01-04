'use strict';


var cMod = angular.module( 'myApp.controllers', [] );


cMod.controller( 'AppCtrl', function ( $scope, socket ) {

	socket.on( 'send:name', function ( data ) {
		$scope.name = data.name;
	} );

} );


cMod.controller( 'HomeCtrl', function ( $scope, socket ) {
	
	socket.on( 'send:time', function ( data ) {
		$scope.time = data.time;
	} );

} );


cMod.controller( 'MyCtrl2', function ( $scope ) {
	// write Ctrl here
} );
