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


cMod.controller( 'SystemCtrl', function ( $scope, socket ) {

    $scope.systemTempChart = {
        options: {},
        data: {
            labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets : [
                {
                    fillColor : "rgba(151,187,205,0)",
                    strokeColor : "#e67e22",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#e67e22",
                    data : [4, 3, 5, 4, 6]
                },
                {
                    fillColor : "rgba(151,187,205,0)",
                    strokeColor : "#f1c40f",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#f1c40f",
                    data : [8, 3, 2, 5, 4]
                }
            ],
        }
    };

} );


cMod.controller( 'MyCtrl2', function ( $scope ) {
	// write Ctrl here
} );
