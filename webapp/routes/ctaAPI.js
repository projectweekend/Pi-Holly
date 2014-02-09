var appModels = require( '../models' ),
	http = require( 'http' ),
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

	var output = [];

	var buildAsyncCallback = function ( busStopConfig ) {
		return function ( callback ) {

			var apiOptions = {
				hostname: "www.ctabustracker.com",
				path: "/bustime/api/v1/getpredictions?key=" + busTrackerKey + "&rt=" + busStopConfig.rt + "&stpid=" + busStopConfig.stpid
			};
			
			http.get( apiOptions, function ( ctaRes ) {

				var fullResponse = "";

				ctaRes.on( 'data', function ( chunk ) {
					fullResponse += chunk;
				} );

				ctaRes.on( 'end', function () {
					output.push( fullResponse );
					callback();
				} );

			} ).on( 'error', function ( err ) {
				callback( err );
			} );

		};
	};

	var asyncTaskList = busStopsToTrack.map( buildAsyncCallback );

	async.parallel( asyncTaskList, function ( err ) {
		if ( err ) {
			return errorHandler( err, res );
		}
		console.log( output );
		return res.send( 200 );
	} );

};
