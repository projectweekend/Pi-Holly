var appModels = require( '../models' ),
 async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


var buildFahrenheitAverageCallback = function ( config, output ) {

    // performs fahrenheit average map reduce
    return function ( callback ) {

        var avgConfig = {
            out: { replace: config.collection },
            map: function () { emit( 1, this.fahrenheit ); },
            reduce: function ( keyVal, fahrenheitValues ) { return Array.avg( fahrenheitValues ); }
        };

        IndoorTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
            if ( err ) {
                console.log( err );
                return callback( err );
            }
            model.find( config.query, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.average.fahrenheit = data[0].value;
                callback();
            } );
        } );

    };

};

var buildCelsiusAverageCallback = function ( config, output ) {
    
    // performs celsius average map reduce
    return function ( callback ) {

        var avgConfig = {
            out: { replace: config.collection },
            map: function () { emit( 1, this.celsius ); },
            reduce: function ( keyVal, celsiusValues ) { return Array.avg( celsiusValues ); }
        };

        IndoorTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
            if ( err ) {
                console.log( err );
                return callback( err );
            }
            model.find( config.query, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.average.celsius = data[0].value;
                callback();
            } );
        } );

    };
};


exports.indoorTemperatureStatsOverall = function ( req, res ) {

    var output = {
        average: {
            celsius: 0,
            fahrenheit: 0
        },
        min: {
            celsius: 0,
            fahrenheit: 0
        },
        max: {
            celsius: 0,
            fahrenheit: 0
        }
    };

    var fahrenheitAverage = buildFahrenheitAverageCallback(
        {
            collection: "AverageIndoorOverallTempFahrenheit",
            query: {}
        },
        output
    );

    var celsiusAverage = buildCelsiusAverageCallback(
        {
            collection: "AverageIndoorOverallTempCelsius",
            query: {}
        },
        output
    );

    // run all stat calculations async
    async.parallel( [
        fahrenheitAverage,
        celsiusAverage
    ],
    // callback function for processes running async
    function( err ){
        if ( err ) {
            return errorHandler( err, res );
        }
        return res.json( output );
    } );

};


exports.indoorTemperatureStatsDay = function ( req, res ) {

};


exports.indoorTemperatureStatsWeek = function ( req, res ) {

};


exports.indoorTemperatureStatsMonth = function ( req, res ) {

};
