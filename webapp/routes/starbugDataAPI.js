var appModels = require( '../models' ),
 async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


exports.starbugTemperatureData = function ( req, res ) {

    if ( req.method == 'GET') {
        
        var q = StarbugTemperatureData.findOne( ).sort( '-date' );
        
        q.exec( function ( err, data ) {
        
            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );

        } );

    }

    if ( req.method == 'POST') {

        var newTemperatureData = {
            date: new Date(),
            celsius: req.body.celsius,
            fahrenheit: req.body.fahrenheit
        };

        StarbugTemperatureData.create( newTemperatureData, function ( err, data ) {

            if ( err ) {
                return errorHandler( err, res );
            }

            res.send( 201 );
            
        } );

    }

};


exports.starbugTemperatureDataRecent = function ( req, res ) {

    var q = StarbugTemperatureData.find( ).sort( '-date' ).limit(18);
    
    q.exec( function ( err, data ) {

        if ( err ) {
            return errorHandler( err, res);
        }

        return res.json( data );

    } );

};


exports.starbugTemperatureDataStats = function ( req, res ) {
    
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

    // performs fahrenheit average map reduce
    var fahrenheitAverage = function ( callback ) {

        var avgConfig = {};
        avgConfig.out = { replace: "AverageStarbugTempFahrenheit" };
        
        avgConfig.map =  function () {
            emit( 1, this.fahrenheit );
        };
        
        avgConfig.reduce =  function ( keyVal, fahrenheitValues ) {
            return Array.avg( fahrenheitValues );
        };
        
        StarbugTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
            
            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( {}, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.average.fahrenheit = data[0].value;
                callback();
            } );
        } );

    };

    // performs celsius average map reduce
    var celsiusAverage = function ( callback ) {

        var avgConfig = {};
        avgConfig.out = { replace: "AverageStarbugTempCelsius" };

        avgConfig.map =  function () {
            emit( 1, this.celsius );
        };
        
        avgConfig.reduce =  function ( keyVal, celsiusValues ) {
            return Array.avg( celsiusValues );
        };

        StarbugTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {

            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( {}, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.average.celsius = data[0].value;
                callback();
            } );
        } );

    };

    // performs fahrenheit min/max map reduce
    var fahrenheitMinMax = function ( callback ) {
        
        var maxConfig = {};
        maxConfig.out = { replace: "MinMaxStarbugTempFahrenheit" };

        maxConfig.map = function () {
            var x = { fahrenheit: this.fahrenheit, _id: this._id };
            emit( 1, { min: x, max: x } );
        };

        maxConfig.reduce = function (key, fahrenheitValues) {
            var result = fahrenheitValues[0];
            for ( var i = 1; i < fahrenheitValues.length; i++ ) {
                if ( fahrenheitValues[i].min.fahrenheit < result.min.fahrenheit ) {
                    result.min = fahrenheitValues[i].min;
                }
                if ( fahrenheitValues[i].max.fahrenheit > result.max.fahrenheit ) {
                    result.max = fahrenheitValues[i].max;
                }
            }
            return result;
        };

        StarbugTemperatureData.mapReduce( maxConfig, function ( err, model, stats ) {

            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( {}, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.min.fahrenheit = data[0].value.min.fahrenheit;
                output.max.fahrenheit = data[0].value.max.fahrenheit;
                callback();
            } );
        } );

    };

    // performs celsius min/max map reduce
    var celsiusMinMax = function ( callback ) {
        
        var maxConfig = {};
        maxConfig.out = { replace: "MinMaxStarbugTempCelsius" };

        maxConfig.map = function () {
            var x = { celsius: this.celsius, _id: this._id };
            emit( 1, { min: x, max: x } );
        };

        maxConfig.reduce = function (key, celsiusValues) {
            var result = celsiusValues[0];
            for ( var i = 1; i < celsiusValues.length; i++ ) {
                if ( celsiusValues[i].min.celsius < result.min.celsius ) {
                    result.min = celsiusValues[i].min;
                }
                if ( celsiusValues[i].max.celsius > result.max.celsius ) {
                    result.max = celsiusValues[i].max;
                }
            }
            return result;
        };

        StarbugTemperatureData.mapReduce( maxConfig, function ( err, model, stats ) {

            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( {}, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.min.celsius = data[0].value.min.celsius;
                output.max.celsius = data[0].value.max.celsius;
                callback();
            } );
        } );

    };

    // run all stat calculations async
    async.parallel( [
        fahrenheitAverage,
        celsiusAverage,
        fahrenheitMinMax,
        celsiusMinMax
    ],
    // callback function for processes running async
    function( err ){
        if ( err ) {
            return errorHandler( err, res );
        }
        return res.json( output );
    } );

};
