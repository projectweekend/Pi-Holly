var appModels = require( '../models' ),
	http = require( 'http' ),
	async = require( 'async' ),
	xml2js = require( 'xml2js' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


var busTrackerKey = process.env.BUS_TRACKER_API_KEY || "Not defined";
var busStopsToTrack = [
	{ stpid: 5518, rt: 56 },
	{ stpid: 5029, rt: 125 },
	{ stpid: 5012, rt: 124 },
	{ stpid: 15356, rt: 8 }
];

exports.busTrackerPredictions = function ( req, res ) {

	var output = [];

	var buildAsyncCallback = function ( busStopConfig ) {
		return function ( callback ) {

			var apiOptions = {
				hostname: "www.ctabustracker.com",
				path: "/bustime/api/v1/getpredictions?key=" + busTrackerKey + "&rt=" + busStopConfig.rt + "&stpid=" + busStopConfig.stpid + "&top=5"
			};
			
			http.get( apiOptions, function ( ctaRes ) {

				var shittyXML = "";

				ctaRes.on( 'data', function ( chunk ) {
					shittyXML += chunk;
				} );

				ctaRes.on( 'end', function () {
					xml2js.parseString( shittyXML, function ( err, awesomeJSON ) {

						if ( err ) {
							callback( err );
						}

						var formattedJSON = {
							title: "",
							predictions: []
						};

						if ( awesomeJSON['bustime-response']['error'] ) {
							
							var busRoute = awesomeJSON['bustime-response']['error'][0]['rt'];
							var message = awesomeJSON['bustime-response']['error'][0]['msg'];

							formattedJSON.title = busRoute + " - " + message;

						} else {
							
							var busRoute = awesomeJSON['bustime-response']['prd'][0]['rt'][0];
							var routeDirection = awesomeJSON['bustime-response']['prd'][0]['rtdir'][0];
							
							formattedJSON.title = busRoute + " - " + routeDirection;
							awesomeJSON['bustime-response']['prd'].forEach( function ( prd, index, array ) {
								
								formattedJSON.predictions.push( {
									type: prd.typ[0],
									time: prd.prdtm[0],
									distanceToStop: prd.dstp[0]
								} );
								
							} );

						}
						output.push( awesomeJSON );
						callback();

					} );
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
		return res.json( output );
	} );

};
