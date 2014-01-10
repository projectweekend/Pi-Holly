/*
 * Serve content over a socket
 */

 var appModels = require( '../models' ),
	ERRORSocket = require( '../helpers/ERRORSocket' ),
	CRUDSocket = require( '../helpers/CRUDSocket' );

module.exports = function ( socket ) {

	var handleError = ERRORSocket( socket, {route: 'app:error'} );

	CRUDSocket( socket, handleError, {route: 'environmental:indoor', model: IndoorEnvironmentalData} );	
	// setInterval( function () {

	// 	var query = IndoorEnvironmentalData.findOne( ).sort( '-date' );

	// 	query.exec( function ( err, data ) {
	// 		if ( err ) {
	// 			console.log( err );
	// 		} else {
	// 			socket.emit( 'send:environmental:indoor', data );
	// 		}
	// 	} );

	// }, 60000 );

	CRUDSocket( socket, handleError, {route: 'system:temp', model: SystemTemperatureData} );
	setInterval( function () {

		var query = SystemTemperatureData.findOne( ).sort( '-date' );

		query.exec( function ( err, data ) {
			if ( err ) {
				console.log( err );
			} else {
				socket.emit( 'update:system:temp', data );
			}
		} );

	}, 30000 );

};
