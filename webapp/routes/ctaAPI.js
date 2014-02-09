var appModels = require( '../models' ),
 async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


exports.busTrackerKey = function ( req, res ) {

    var busTrackerKey = process.env.BUS_TRACKER_API_KEY || "Not defined";

    res.json( { value: busTrackerKey } );

};
