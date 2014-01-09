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
        buildRecentTempChart: function () {
            var recentTempChart = this.recentTempChart;
            var apiUrl = "/api/reporting/system-temperature-data/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    console.log( recentTempChart );
                    data.forEach( function ( element, index, array ) {

                        var d = new Date( element.date );
                        recentTempChart.data.labels.push( d.getHours() + ":" + d.getMinutes() );

                        recentTempChart.data.datasets[0].data.push( element.fahrenheit );

                    } );
                }).
                error( function ( data, status ) {
                    console.log( data );
                });
        }

    };

} );
