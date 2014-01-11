/*
 * Serve JSON to our AngularJS client
 */

var appModels = require( '../models' );


var errorHandler = function ( err, res ) {
    console.log( err );
    res.send( 500 );
};


var avgTempMapReduce = function ( units, output ) {
    
    var avgConfig = {};
    avgConfig.out = { replace: "AverageSystemTemp" };

    if ( units == 'F' ) {
        
        avgConfig.map =  function () {
            emit( 1, this.fahrenheit );
        };
        
        avgConfig.reduce =  function ( keyVal, fahrenheitValues ) {
            return Array.avg( fahrenheitValues );
        };
        
    } else {
        
        avgConfig.map =  function () {
            emit( 1, this.celsius );
        };
        
        avgConfig.reduce =  function ( keyVal, celsiusValues ) {
            return Array.avg( celsiusValues );
        };

    }

    SystemTemperatureData.mapReduce( avgConfig, function ( err, model, stats ) {
        
        model.find( {}, function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }

            output = data.value;

        } );

    } );

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

    var output = {
        celsius: null,
        fahrenheit: null
    };

    avgTempMapReduce( "F",  output.fahrenheit );
    avgTempMapReduce( "C",  output.celsius );

    return res.json( output );

};
