/*
 * Serve JSON to our AngularJS client
 */

 var appModels = require( '../models' );


exports.indoorEnvironmentalData = function ( req, res ) {

	if ( req.method == 'POST' ) {

		if ( !req.body.temperature || !req.body.humidity || !req.body.pressure ) {
			res.send( 400, "Required fields: temperature, humidity, pressure" );
			return;
		}

        var newIndoorData = {
            date: new Date(),
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            pressure: req.body.pressure
        };

        IndoorEnvironmentalData.create( newIndoorData, function ( err, indoorData ) {
            
            if ( err ) {
                console.log( err );
                res.send( 500 );
                return;
            }
            res.send( 201 );
            
        } );

	} else {

		res.json( {
			error: "This route is for POST requests only"
		} );

	}

};
