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


exports.systemStorageData = function ( req, res ) {

    if ( req.method == 'POST' ) {

        var requiredFields = ['available', 'percent', 'used'];
        var fieldCount = 0;

        requiredFields.forEach( function ( field ) {
            if ( field in req.body ) {
                fieldCount += 1;
            }
        } );

        if ( fieldCount != 3 ) {
            res.send( 400, "Required fields: available, percent, used" );
            return;
        }

        var newSystemStorage = {
            date: new Date(),
            available: req.body.available,
            used: req.body.used,
            percent: req.body.percent
        };

        SystemStorageData.create( newSystemStorage, function ( err, storData ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }
            res.send( 201 );

        } );

    } else {

        var query = SystemStorageData.findOne( ).sort( '-date' );

        query.exec( function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );
            
        } );
    }

};


exports.systemConfigData = function ( req, res ) {

    if ( req.method == 'POST' ) {

        var newSystemConfig = {
            date: new Date(),
            arm_freq: req.body.arm_freq,
            config_hdmi_boost: req.body.config_hdmi_boost,
            core_freq: req.body.core_freq,
            disable_overscan: req.body.disable_overscan,
            disable_splash: req.body.disable_splash,
            emmc_pll_core: req.body.emmc_pll_core,
            force_pwm_open: req.body.force_pwm_open,
            hdmi_force_hotplug: req.body.hdmi_force_hotplug,
            hdmi_group: req.body.hdmi_group,
            hdmi_ignore_edid: req.body.hdmi_ignore_edid,
            hdmi_mode: req.body.hdmi_mode,
            hdmi_safe: req.body.hdmi_safe,
            overscan_bottom: req.body.overscan_bottom,
            overscan_left: req.body.overscan_left,
            overscan_right: req.body.overscan_right,
            overscan_top: req.body.overscan_top,
            pause_burst_frames: req.body.pause_burst_frames,
            program_serial_random: req.body.program_serial_random,
            sdram_freq: req.body.sdram_freq,
            second_boot: req.body.second_boot,
            temp_limit: req.body.temp_limit
        };

        SystemConfigData.create( newSystemConfig, function ( err, configData ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }
            res.send( 201 );

        } );

    } else {

        var query = SystemConfigData.findOne( ).sort( '-date' );

        query.exec( function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res);
            }

            res.json( data );
            
        } );

    }

};


exports.newsSourceConfig = function ( req, res ) {

    if ( req.method == 'GET' ) {

        var q = NewsSourceConfig.find( ).sort( {category: 1, url: 1} );

        q.exec( function ( err, data ) {

            if ( err ) {
                return errorHandler( err, res );
            }

            res.json( data );

        } );

    }

    if ( req.method == 'POST' ) {

        var newConfigItem = {
            date: new Date(),
            url: req.body.url
        };

        NewsSourceConfig.create( newConfigItem, function ( err, configItemData) {

            if ( err ) {
                return errorHandler( err, res );
            }

            res.send( 201 );

        } );

    }

    if ( req.method == 'PUT' ) {

        var update = {
            $set: {
                url: req.body.url
            }
        };
        var callback = function ( err, updatedItem ) {
            
            if ( err ) {
                return errorHandler( err, res );
            }

            res.json( updatedItem );

        };

        NewsSourceConfig.findByIdAndUpdate( req.body._id, update, callback );

    }

    if ( req.method == 'DELETE' ) {

        NewsSourceConfig.findById( req.query.id, function ( err, itemToDelete ) {
            
            if ( err ) {
                return errorHandler( err, res );
            }

            itemToDelete.remove();
            res.send( 200 );
            
        } );

    }

};


exports.newsArticles = function ( req, res ) {

    if (  req.query.id ) {
        
        NewsArticle.findById( req.query.id, function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res );
            }

            res.json( data );

        } );

    } else {
        
        var q = NewsArticle.find();
        q.exec( function ( err, data ) {
            
            if ( err ) {
                return errorHandler( err, res );
            }

            res.json( data );

        } );
    }

};


// Used in readArticle and ignoreArticle routes
var updateWordScore = function ( wordToUpdate, scoreIncrement, callback ) {
    wordToUpdate.score += scoreIncrement;
    wordToUpdate.save( function ( err ) {
        if ( err ) {
            callback( err );
        } else {
            callback();
        }
    } );
};


// Used in readArticle and ignoreArticle routes
var addNewKeyWord = function ( newKeyword, startingScore, callback ) {
    NewsArticleKeyword.create({word: newKeyword, score: startingScore}, function ( err, newKeyword ) {
        if ( err ) {
            callback( err );
        } else {
            callback();
        }
    });
};

// Used in readArticle and ignoreArticle routes
var removeArticle = function ( articleID ) {
    NewsArticle.findById( articleID, function ( err, article ) {
        if ( err ) {
            return next( errorHandler( err, res ) );
        } else {
            article.remove();
        }
    } );
};


exports.readArticle = function ( req, res ) {

    // Take a keyword as input and return a function that can be used in 
    // async.parallel call
    var buildAsyncCallback = function ( word ) {
        
        return function ( callback ) {
            var q = NewsArticleKeyword.findOne( {word: word} );
            q.exec( function ( err, wordToUpdate ) {
                
                if ( err ) {
                    callback( err );
                } else {
                    if ( wordToUpdate ) {
                        updateWordScore( wordToUpdate, 1, callback );
                    } else {
                        addNewKeyWord( word, 1, callback );
                    }
                }

            } );
        };

    };

    var keywords = req.body.keywords;
    var asyncTaskList = keywords.map( buildAsyncCallback );

    async.parallel( asyncTaskList, function ( err ) {
        if ( err ) {
            return next( errorHandler( err, res ) );
        }
        removeArticle( req.body._id );
        return res.send( 200 );
    } );

};


exports.ignoreArticle = function ( req, res ) {

    // Take a keyword as input and return a function that can be used in 
    // async.parallel call
    var buildAsyncCallback = function ( word ) {
        
        return function ( callback ) {
            var q = NewsArticleKeyword.findOne( {word: word} );
            q.exec( function ( err, wordToUpdate ) {
                
                if ( err ) {
                    callback( err );
                } else {
                    if ( wordToUpdate ) {
                        updateWordScore( wordToUpdate, -1, callback );
                    } else {
                        addNewKeyWord( word, -1, callback );
                    }
                }

            } );
        };

    };

    var keywords = req.body.keywords;
    var asyncTaskList = keywords.map( buildAsyncCallback );

    async.parallel( asyncTaskList, function ( err ) {
        if ( err ) {
            return next( errorHandler( err, res ) );
        }
        removeArticle( req.body._id );
        return res.send( 200 );
    } );

};


exports.articleKeywords = function ( req, res ) {

    NewsArticleKeyword.find( {}, function ( err, data ) {

        if ( err ) {
            return errorHandler( err, res );
        }

        res.json( data );

    } );

};
