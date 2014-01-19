'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var makeHoursMinutesTimeString = function ( dateString ) {

    var d = new Date( dateString );
    var h = d.getHours();
    var m = d.getMinutes();

    if ( m === 0 ) {
        m = "00";
    }

    return h + ":" + m;
};


var svcMod = angular.module('myApp.services', []);


svcMod.value('version', '0.1');

// System Reporting
svcMod.factory( "SystemTempReporting", function ( $http, socket ) {

    return {
        recentTempChart: {
            options: {},
            data: {
                labels: [],
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0)",
                        strokeColor : "#e67e22",
                        pointColor : "rgba(151,187,205,0)",
                        pointStrokeColor : "#e67e22",
                        data: []
                    }
                ]
            }
        },
        buildRecentTempChart: function ( display_units ) {
            var recentTempChart = this.recentTempChart;
            var apiUrl = "/api/reporting/system-temperature-data/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( element, index, array ) {

                        var parsedTime = makeHoursMinutesTimeString( element.date );
                        recentTempChart.data.labels.push( parsedTime );

                        if ( display_units == 'F' ) {
                            recentTempChart.data.datasets[0].data.push( element.fahrenheit );
                        } else {
                            recentTempChart.data.datasets[0].data.push( element.celsius );
                        }

                    } );
                }).
                error( function ( data, status ) {
                    console.log( data );
                });
        },
        clearRecentTempChart: function () {
            var recentTempChart = this.recentTempChart;
            recentTempChart.data.labels = [];
            recentTempChart.data.datasets[0].data = [];
        },
        listenForUpdates: function ( display_units ) {
            
            var recentTempChart = this.recentTempChart;
            
            socket.on( 'updates:system:temp', function ( data ) {
            
                var newLabel = makeHoursMinutesTimeString( data.date );
                var latestLabel = recentTempChart.data.labels[0];

                console.log("New Label: " + newLabel);
                console.log("Latest Label: " + latestLabel);

                if ( newLabel != latestLabel ) {
                    // remove oldest one
                    recentTempChart.data.labels.pop();
                    recentTempChart.data.datasets[0].data.pop();
                    // add new one
                    recentTempChart.data.labels.unshift( newLabel );
                    if ( display_units == 'F' ) {
                        recentTempChart.data.datasets[0].data.unshift( data.fahrenheit );
                    } else {
                        recentTempChart.data.datasets[0].data.unshift( data.celsius );
                    }

                }

            } );
        },
        init: function ( display_units ) {
            var SystemTempReporting = this;
            var currentData = SystemTempReporting.recentTempChart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                SystemTempReporting.buildRecentTempChart( display_units );
            }
        }

    };

} );

// Current System Temp
svcMod.factory( "SystemTempCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            fahrenheit: null,
            celsius: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/system-temperature-data";

            $http.get( apiUrl ).
                success( function ( data, status) {
                    values.date = data.date;
                    values.fahrenheit = data.fahrenheit;
                    values.celsius = data.celsius;
                } ).
                error( function ( data, status ) {
                    console.log( data );
                } );
        },
        listenForUpdates: function () {
            var values = this.values;
            socket.on( 'updates:system:temp', function ( data ) {
                if ( values.date != data.date ) {
                    values.date = data.date;
                    values.fahrenheit = data.fahrenheit;
                    values.celsius = data.celsius;
                }
            } );
        },
        init: function () {
            var SystemTempCurrent = this;
            var currentFarenheit = SystemTempCurrent.values.fahrenheit;
            var currentCelsius = SystemTempCurrent.values.celsius;
            if ( currentFarenheit === null && currentCelsius === null ) {
                SystemTempCurrent.getValues();
            }
        }
    };

} );

// System Temp Stats
svcMod.factory( "SystemTempStats", function ( $http, socket ) {

    return {
        values: {
            average: null,
            min: null,
            max: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/reporting/system-temperature-data/stats";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.average = data.average;
                    values.min = data.min;
                    values.max = data.max;
                } ).
                error( function ( data, status ) {
                    console.log( data );
                } );

        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {
            var SystemTempStats = this;
            var values = this.values;
            if ( values.average === null || values.min === null || values.max === null ) {
                SystemTempStats.getValues();
            }
        }
    };

} );

// Current System Memory
svcMod.factory( "SystemMemoryCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            total: null,
            used: null,
            free: null,
            shared: null,
            buffers: null,
            cached: null
        },
        currentMemoryChart: {
            options: {},
            data: []
        },
        buildCurrentMemoryChart: function () {
            var values = this.values;
            var currentMemoryChart = this.currentMemoryChart;
            currentMemoryChart.data = [
                {
                    value: values.used,
                    color: "#F7464A"
                },
                {
                    value: values.free,
                    color: "#4D5360"
                },
                {
                    value: values.shared,
                    color: "#7EC5BC"
                },
                {
                    value: values.buffers,
                    color : "#949FB1"
                },
                {
                    value: values.cached,
                    color : "#D4CCC5"
                }
            ];
        },
        getValues: function () {
            var SystemMemoryCurrent = this;
            var values = this.values;
            var apiUrl = "/api/system-memory-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.total = data.total;
                    values.used = data.used;
                    values.free = data.free;
                    values.shared = data.shared;
                    values.buffers = data.buffers;
                    values.cached = data.cached;
                    SystemMemoryCurrent.buildCurrentMemoryChart();
                }).
                error( function ( data, status ) {
                    console.log( data );
                });
        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {
            
            var SystemMemoryCurrent = this;
            
            var values = this.values;
            if ( values.date === null || values.total === null || values.used === null || values.free === null || values.shared === null || values.buffers === null || values.cached === null ) {
                SystemMemoryCurrent.getValues();
            }

        }

    };

} );

// Current System Storage
svcMod.factory( "SystemStorageCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            available: null,
            used: null
        },
        currentStorageChart: {
            options: {},
            data: []
        },
        buildCurrentStorageChart: function () {
            var values = this.values;
            var currentStorageChart = this.currentStorageChart;
            currentStorageChart.data = [
                {
                    value: values.available,
                    color: "#4D5360"
                },
                {
                    value: values.used,
                    color: "#F7464A"
                }
            ];

        },
        getValues: function () {
            var SystemStorageCurrent = this;
            var values = this.values;
            var apiUrl = "/api/system-storage-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.available = data.available;
                    values.used = data.used;
                    SystemStorageCurrent.buildCurrentStorageChart();
                }).
                error( function ( data, status ) {
                    console.log( data );
                });
        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {

            var SystemStorageCurrent = this;

            var values = this.values;
            if ( values.available === null || values.used === null ) {
                SystemStorageCurrent.getValues();
            }
        }
    };

} );

// Current System Config
svcMod.factory( "SystemConfigCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            arm_freq: null,
            core_freq: null,
            sdram_freq: null,
            temp_limit: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/system-config-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.arm_freq = data.arm_freq;
                    values.core_freq = data.core_freq;
                    values.sdram_freq = data.sdram_freq;
                    values.temp_limit = data.temp_limit;
                } ).
                error( function ( data, status ) {
                    console.log( data );
                } );
        },
        init: function () {

            var SystemConfigCurrent = this;

            var values = this.values;
            if ( values.arm_freq === null || values.core_freq === null || values.sdram_freq === null || values.temp_limit === null ) {
                SystemConfigCurrent.getValues();
            }

        }
    };

} );

// News Source Config
svcMod.factory( "NewsSourceConfig", function ( $http ) {

    return {
        editing: {
            _id: "",
            url: "",
            category:"",
            clearForm: function () {
                var editing = this;
                editing.url = "";
                editing.category = "";
            }
        },
        save: function () {
            var NewsSourceConfig = this;
            var apiUrl = "/api/news-source/config";

            if ( !NewsSourceConfig.editing._id ) {
                $http.post( apiUrl, NewsSourceConfig.editing ).
                    success( function ( data, status ) {
                        NewsSourceConfig.editing.clearForm();
                        NewsSourceConfig.getSources();
                    } ).
                    error( function ( data, status ) {
                        console.log( data );
                    } );
            } else {
                $http.put( apiUrl, NewsSourceConfig.editing ).
                    success( function ( data, status ) {
                        console.log( "SUCCESS" );
                        console.log( data );
                    } ).
                    error( function ( data, status ) {
                        console.log( data );
                    } );
            }

        },
        cancel: function () {
            var NewsSourceConfig = this;
            NewsSourceConfig.editing.clearForm();
        },
        sources: [],
        getSources: function () {
            var NewsSourceConfig = this;
            var apiUrl = "/api/news-source/config";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    NewsSourceConfig.sources = data;
                } ).
                error( function ( data, status ) {
                    console.log( data );
                } );
        },
        init: function () {
            var NewsSourceConfig = this;
            NewsSourceConfig.getSources();
        }
    };

} );
