/*
 * Serve JSON to our AngularJS client
 */

var appModels = require( '../models' ),
 async = require( 'async' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


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
                return errorHandler( err, res);
            }
            res.send( 201 );
            
        } );

	} else {

        var query = IndoorEnvironmentalData.findOne( ).sort( '-date' );

        query.exec( function ( err, data ) {

            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );

        } );

	}

};


exports.systemTemperatureData = function ( req, res ) {

    if ( req.method == 'POST' ) {

        if ( !req.body.celsius || !req.body.fahrenheit ) {
            res.send( 400, "Required fields: celsius, fahrenheit" );
            return;
        }

        var newSystemTemp = {
            date: new Date(),
            celsius: req.body.celsius,
            fahrenheit: req.body.fahrenheit
        };

        SystemTemperatureData.create( newSystemTemp, function ( err, tempData ) {

            if ( err ) {
                return errorHandler( err, res);
            }
            res.send( 201 );

        } );

    } else {

        var query = SystemTemperatureData.findOne( ).sort( '-date' );

        query.exec( function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );

        } );

    }

};


exports.systemTemperatureDataReportingAll = function ( req, res ) {

    var query = SystemTemperatureData.find().sort( '-date' );

    query.exec( function ( err, data ) {

        if ( err ) {
            return errorHandler( err, res);
        }

        return res.json( data );

    } );

};


exports.systemTemperatureDataReportingRecent = function ( req, res ) {

    var query = SystemTemperatureData.find().sort( '-date' ).limit(18);

    query.exec( function ( err, data ) {

        if ( err ) {
            return errorHandler( err, res);
        }

        return res.json( data );

    } );

};


exports.systemTemperatureDataReportingStats = function ( req, res ) {

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
        avgConfig.out = { replace: "AverageSystemTempFahrenheit" };
        
        avgConfig.map =  function () {
            emit( 1, this.fahrenheit );
        };
        
        avgConfig.reduce =  function ( keyVal, fahrenheitValues ) {
            return Array.avg( fahrenheitValues );
        };
        
        SystemTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
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
        avgConfig.out = { replace: "AverageSystemTempCelsius" };

        avgConfig.map =  function () {
            emit( 1, this.celsius );
        };
        
        avgConfig.reduce =  function ( keyVal, celsiusValues ) {
            return Array.avg( celsiusValues );
        };

        SystemTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
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
        maxConfig.out = { replace: "MinMaxSystemTempFahrenheit" };

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

        SystemTemperatureData.mapReduce( maxConfig, function ( err, model, stats ) {
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
        maxConfig.out = { replace: "MinMaxSystemTempCelsius" };

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

        SystemTemperatureData.mapReduce( maxConfig, function ( err, model, stats ) {
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
            return next( errorHandler( err, res ) );
        }
        return res.json( output );
    } );

};


exports.systemMemoryData = function ( req, res ) {

    if ( req.method == 'POST' ) {

        var requiredFields = ['total', 'used', 'free', 'shared', 'buffers', 'cached'];
        var fieldCount = 0;
        
        requiredFields.forEach( function ( field ) {
            if ( field in req.body ) {
                fieldCount += 1;
            }
        } );

        if ( fieldCount != 6 ) {
            res.send( 400, "Required fields: total, used, free, shared, buffers, cached" );
            return;
        }

        var newSystemMemory = {
            date: new Date(),
            total: req.body.total,
            used: req.body.used,
            free: req.body.free,
            shared: req.body.shared,
            buffers: req.body.buffers,
            cached: req.body.cached
        };

        SystemMemoryData.create( newSystemMemory, function ( err, memData ) {

            if ( err ) {
                return errorHandler( err, res);
            }
            res.send( 201 );

        } );

    } else {

        var query = SystemMemoryData.findOne( ).sort( '-date' );

        query.exec( function ( err, data ) {

            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );            

        } );

    }

};
