var appModels = require( '../models' ),
 async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


var busTrackerKey = process.env.BUS_TRACKER_API_KEY || "Not defined";
var busStopsToTrack = [
	{ stpid: 5518, rt: 56 }
];

exports.busTrackerPredictions = function ( req, res ) {


	var buildAsyncCallback = function ( busStopConfig ) {
		var apiURL = "http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=" + busTrackerKey + "&rt=" + busStopConfig.rt + "&stpid=" + busStopConfig.stpid;
		return function ( callback ) {
			
		};
	};





    res.json( { value: busTrackerKey } );

};
