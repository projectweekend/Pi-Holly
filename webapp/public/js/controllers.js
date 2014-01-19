'use strict';


var cMod = angular.module( 'myApp.controllers', [] );


cMod.controller( 'AppCtrl', function ( $scope, $location ) {

	$scope.navActiveElement = function ( routeName ) {

		var currentRoute = $location.path();
		if ( currentRoute == routeName ) {
			return "active";
		}

	};

} );


cMod.controller( 'HomeCtrl', function ( $scope, socket ) {

} );


cMod.controller( 'SystemCtrl', function ( $scope, socket, SystemTempReporting, SystemTempCurrent, SystemTempStats, SystemMemoryCurrent, SystemStorageCurrent, SystemConfigCurrent ) {

    $scope.systemTempReporting = SystemTempReporting;
    $scope.systemTempReporting.init('F');
    $scope.systemTempReporting.listenForUpdates('F');

    $scope.systemCurrentTemp = SystemTempCurrent;
    $scope.systemCurrentTemp.init();
    $scope.systemCurrentTemp.listenForUpdates();

    $scope.systemTempStats = SystemTempStats;
    $scope.systemTempStats.init();

    $scope.systemCurrentMemory = SystemMemoryCurrent;
    $scope.systemCurrentMemory.init();

    $scope.systemCurrentStorage = SystemStorageCurrent;
    $scope.systemCurrentStorage.init();

    $scope.systemCurrentConfig = SystemConfigCurrent;
    $scope.systemCurrentConfig.init();

} );


cMod.controller( 'NewsCtrl', function ( $scope ) {
    // write Ctrl here
} );


cMod.controller( 'NewsConfigCtrl', function ( $scope ) {
    // write Ctrl here
} );


cMod.controller( 'MyCtrl2', function ( $scope ) {
	// write Ctrl here
} );
