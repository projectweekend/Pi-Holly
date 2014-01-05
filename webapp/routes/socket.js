/*
 * Serve content over a socket
 */

 var appModels = require( '../models' ),
	ERRORSocket = require( '../helpers/ERRORSocket' ),
	CRUDSocket = require( '../helpers/CRUDSocket' );

module.exports = function ( socket ) {

	var handleError = ERRORSocket( socket, {route: 'app:error'} );

	CRUDSocket( socket, handleError, {route: 'environmental:indoor', model: IndoorEnvironmentalData} );

	setInterval( function () {

		var query = IndoorEnvironmentalData.findOne( ).sort( '-date' );

		query.exec( function ( err, data ) {
			socket.emit( 'send:environmental:indoor', data );
		} );

	}, 60000 );

};
