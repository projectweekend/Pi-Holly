'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var svcMod = angular.module('myApp.services', []);


svcMod.value('version', '0.1');

svcMod.factory( "SystemTempReporting", function ( $http ) {

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

                        var d = new Date( element.date );
                        var h = d.getHours();
                        var m = d.getMinutes();
                        if ( m === 0 ) {
                            m = "00";
                        }
                        recentTempChart.data.labels.push( h + ":" + m );

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
        init: function ( display_units ) {
            var SystemTempReporting = this;
            var currentData = SystemTempReporting.recentTempChart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                SystemTempReporting.buildRecentTempChart( display_units );
            }
        }

    };

} );


svcMod.factory( "SystemTempCurrent", function ( $http ) {

    return {
        values: {
            fahrenheit: null,
            celsius: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/system-temperature-data";

            $http.get( apiUrl ).
                success( function ( data, status) {
                    values.fahrenheit = data.fahrenheit;
                    values.celsius = data.celsius;
                } ).
                error( function ( data, status ) {
                    console.log( data );
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
