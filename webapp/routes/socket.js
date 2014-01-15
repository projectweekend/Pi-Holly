/*
 * Serve content over a socket
 */

 var appModels = require( '../models' ),
	ERRORSocket = require( '../helpers/ERRORSocket' ),
	CRUDSocket = require( '../helpers/CRUDSocket' );


module.exports = function ( socket ) {

	var handleError = ERRORSocket( socket, {route: 'app:error'} );

	
	// System Temperature CRUD operations can be performed on the 'system:temp' channel
	CRUDSocket( socket, handleError, {route: 'system:temp', model: SystemTemperatureData} );
	

	// The latest System Temperature reading is broadcast on 
	setInterval( function () {

		var query = SystemTemperatureData.findOne( ).sort( '-date' );

		query.exec( function ( err, data ) {
			if ( err ) {
				console.log( err );
			} else {
				socket.emit( 'updates:system:temp', data );
			}
		} );

	}, 120000 );

};
