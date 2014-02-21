var appModels = require( '../models' ),
	asyncCallbackHelpers = require( '../helpers/AsyncCallbacks' ),
	async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


exports.indoorHumidityStatsOverall = function ( req, res ) {
    
    var output = {
        average: {
            percent: 0
        },
        min: {
			percent: 0
        },
        max: {
			percent: 0
        }
    };

    var getHumidityAverage = asyncCallbackHelpers.buildHumidityAverageCallback (
		{
			model: IndoorHumidityData,
			collection: "AverageIndoorOverallHumidity",
			query: {}
		},
		output
    );

    var getHumidityMinMax = asyncCallbackHelpers.buildHumidityMinMaxCallback (
		{
			model: IndoorHumidityData,
			collection: "MinMaxIndoorOverallHumidity",
			query: {}
		},
		output
    );

    // run all stat calculations async
    async.parallel( [
        getHumidityAverage,
        getHumidityMinMax
    ],
    // callback function for processes running async
    function( err ){
        if ( err ) {
            return errorHandler( err, res );
        }
        return res.json( output );
    } );

};


exports.indoorHumidityStatsDay = function ( req, res ) {

};


exports.indoorHumidityStatsWeek = function ( req, res ) {

};


exports.indoorHumidityStatsMonth = function ( req, res ) {

};
