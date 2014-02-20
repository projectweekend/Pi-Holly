exports.buildFahrenheitAverageCallback = function ( config, output ) {

    // performs fahrenheit average map reduce
    return function ( callback ) {

        var avgConfig = {
            out: { replace: config.collection },
            query: config.query,
            map: function () { emit( 1, this.fahrenheit ); },
            reduce: function ( keyVal, fahrenheitValues ) { return Array.avg( fahrenheitValues ); }
        };

        config.model.mapReduce( avgConfig, function ( err, model, stats ) {
            console.log( avgConfig.query );
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

};


exports.buildCelsiusAverageCallback = function ( config, output ) {
    
    // performs celsius average map reduce
    return function ( callback ) {

        var avgConfig = {
            out: { replace: config.collection },
            map: function () { emit( 1, this.celsius ); },
            reduce: function ( keyVal, celsiusValues ) { return Array.avg( celsiusValues ); }
        };

        config.model.mapReduce( avgConfig, function ( err, model, stats ) {
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


exports.buildFahrenheitMinMaxCallback = function ( config, output ) {

    // performs fahrenheit min/max map reduce
    return function ( callback ) {
        
        var maxConfig = {};
        maxConfig.out = { replace: config.collection };

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

        config.model.mapReduce( maxConfig, function ( err, model, stats ) {

            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( config.query, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.min.fahrenheit = data[0].value.min.fahrenheit;
                output.max.fahrenheit = data[0].value.max.fahrenheit;
                callback();
            } );
        } );

    };

};


exports.buildCelsiusMinMaxCallback = function ( config, output ) {

    // performs celsius min/max map reduce
    return function ( callback ) {
        
        var maxConfig = {};
        maxConfig.out = { replace: config.collection };

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

        config.model.mapReduce( maxConfig, function ( err, model, stats ) {

            if ( err ) {
                console.log( err );
                return callback( err );
            }

            model.find( config.query, function ( err, data ) {
                if ( err ) {
                    return callback( err );
                }
                output.min.celsius = data[0].value.min.celsius;
                output.max.celsius = data[0].value.max.celsius;
                callback();
            } );
        } );

    };

};
