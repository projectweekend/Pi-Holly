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
            
            socket.on( 'update:system:temp', function ( data ) {
            
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
            socket.on( 'update:system:temp', function ( data ) {
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
            var values = this.values;
            // TOOD: Make a socket and hook this up
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
