var appModels = require( '../models' ),
    asyncCallbackHelpers = require( '../helpers/AsyncCallbacks' ),
    async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


exports.systemTemperatureStatsOverall = function ( req, res ) {


    // The Temperature Stats output object
    var output = {
        average: {
            celsius: null,
            fahrenheit: null
        },
        min: {
            celsius: null,
            fahrenheit: null
        },
        max: {
            celsius: null,
            fahrenheit: null
        }
    };

    var getFahrenheitAverage = asyncCallbackHelpers.buildFahrenheitAverageCallback (
        {
            model: SystemTemperatureData,
            collection: "AverageSystemTempFahrenheit",
            query: {}
        },
        output
    );

    var getCelsiusAverage = asyncCallbackHelpers.buildCelsiusAverageCallback (
        {
            model: SystemTemperatureData,
            collection: "AverageSystemTempCelsius",
            query: {}
        },
        output
    );

    var getFahrenheitMinMax = asyncCallbackHelpers.buildFahrenheitMinMaxCallback(
        {
            model: SystemTemperatureData,
            collection: "MinMaxSystemTempFahrenheit",
            query: {}
        },
        output
    );

    var getCelsiusMinMax = asyncCallbackHelpers.buildCelsiusMinMaxCallback(
        {
            model: SystemTemperatureData,
            collection: "MinMaxSystemTempCelsius",
            query: {}
        },
        output
    );

    // run all stat calculations async
    async.parallel( [
        getFahrenheitAverage,
        getCelsiusAverage,
        getFahrenheitMinMax,
        getCelsiusMinMax
    ],
    // callback function for processes running async
    function( err ){
        if ( err ) {
            return errorHandler( err, res );
        }
        return res.json( output );
    } );

};


exports.systemTemperatureStatsDay = function ( req, res ) {

};


exports.systemTemperatureStatsWeek = function ( req, res ) {

};


exports.systemTemperatureStatsMonth = function ( req, res ) {

};
