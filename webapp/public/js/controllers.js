'use strict';


var cMod = angular.module( 'myApp.controllers', [] );


cMod.controller( 'AppCtrl', function ( $scope, socket ) {

	socket.on( 'send:name', function ( data ) {
		$scope.name = data.name;
	} );

} );


cMod.controller( 'HomeCtrl', function ( $scope, socket ) {
	
	socket.on( 'send:time', function ( data ) {
		$scope.environmentalData = data;
	} );

} );


cMod.controller( 'SystemCtrl', function ( $scope, socket, SystemTempReporting, SystemTempCurrent, SystemTempStats ) {

    $scope.systemTempReporting = SystemTempReporting;
    $scope.systemTempReporting.init('F');
    $scope.systemTempReporting.listenForUpdates('F');

    $scope.systemCurrentTemp = SystemTempCurrent;
    $scope.systemCurrentTemp.init();
    $scope.systemCurrentTemp.listenForUpdates();

    $scope.systemTempStats = SystemTempStats;
    $scope.systemTempStats.init();

} );


cMod.controller( 'MyCtrl2', function ( $scope ) {
	// write Ctrl here
} );
