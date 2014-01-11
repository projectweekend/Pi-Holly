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
                    recentTempChart.data.labels.push( newLabel );
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
